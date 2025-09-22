from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
from services.scraper import scrape_redfin_rentals
import uuid
import re
import random
import traceback

apartments_bp = Blueprint('apartments', __name__)
ml_engine = MLEngine()

# --- HELPER FUNCTIONS ---
def parse_price(price_str):
    """Cleans a string to extract an integer price."""
    if not price_str or "contact" in price_str.lower():
        return None
    cleaned_price = re.sub(r'[$,+A-Za-z/]', '', price_str).strip()
    try:
        return int(cleaned_price.split('-')[0])
    except (ValueError, IndexError):
        return None

def parse_integer_value(value):
    """Removes commas and other characters to parse an integer from a string."""
    if value is None:
        return None
    cleaned_value = re.sub(r'[^\d]', '', str(value))
    if cleaned_value:
        try:
            return int(cleaned_value)
        except ValueError:
            return None
    return None


@apartments_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_apartment_feed():
    try:
        # 1. Get User Data
        user_id = get_jwt_identity()
        user_result = SupabaseService.get_data('users', {'id': user_id})
        if not user_result['success'] or not user_result['data']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_result['data'][0]
        user_city_state = user.get('city', 'University Park, FL')
        user_lat = user.get('lat') or 27.3365
        user_lng = user.get('lng') or -82.5307
        
        data_source = "redfin_scraper"
        
        # 2. --- DATA SOURCING & INSERTION ---
        try:
            raw_scraped_data = scrape_redfin_rentals(location=user_city_state, max_listings=20)
            
            # Get existing apartment addresses to avoid duplicates
            print("🔍 Checking for existing apartments in the database...")
            existing_apartments_result = SupabaseService.get_data('apartments')
            existing_addresses = {
                apt['address'] for apt in existing_apartments_result['data']
            } if existing_apartments_result.get('success') else set()
            print(f"Found {len(existing_addresses)} existing addresses.")

            new_apartments_to_insert = []
            for item in raw_scraped_data:
                price = parse_price(item.get('price'))
                address = item.get('address')

                # Skip if essential data is missing or if it already exists
                if not price or not address or address in existing_addresses:
                    continue

                bedrooms = parse_integer_value(item.get('bedrooms'))
                bathrooms = parse_integer_value(item.get('bathrooms'))
                sqft_val = parse_integer_value(item.get('sqft'))
                
                apartment_data = {
                    'id': str(uuid.uuid4()),
                    'title': f"{bedrooms or 'Studio'}, {bathrooms or 1} bath in {address.split(',')[1].strip()}",
                    'address': address,
                    'price': price,
                    'bedrooms': bedrooms if bedrooms is not None else 0,
                    'bathrooms': bathrooms if bathrooms is not None else 1,
                    'square_feet': sqft_val,
                    'lat': float(user_lat) + random.uniform(-0.05, 0.05),
                    'lng': float(user_lng) + random.uniform(-0.05, 0.05),
                    'photos': [item.get('image')] if item.get('image') else [],
                    'description': "A spacious apartment available for rent.",
                    'amenities': [],
                }
                new_apartments_to_insert.append(apartment_data)
                existing_addresses.add(address) # Add to set to prevent re-adding in this loop
            
            if new_apartments_to_insert:
                print(f"✍️ Inserting {len(new_apartments_to_insert)} new apartments into the database...")
                insertion_result = SupabaseService.insert_data('apartments', new_apartments_to_insert)
                if not insertion_result['success']:
                    print(f"🔥 Database insertion failed: {insertion_result.get('error')}")
            else:
                print("✅ No new apartments to insert from this scrape.")

        except Exception as scraper_error:
            print(f"⚠️ Scraper threw an exception: {scraper_error}")
            traceback.print_exc()

        # 3. --- FILTERING & RANKING (Corrected Logic) ---
        # Fetch ALL apartments from the database to create the feed from
        print("🔄 Fetching all apartments from DB for ranking...")
        all_db_apartments_result = SupabaseService.get_data('apartments')
        if not all_db_apartments_result.get('success'):
            return jsonify({"error": "Could not retrieve apartments from database"}), 500
        all_db_apartments = all_db_apartments_result['data']
        print(f"👍 Fetched {len(all_db_apartments)} total apartments from the database.")

        # Get IDs of apartments the user has already swiped on
        swipes_data = SupabaseService.get_data('apartment_swipes', {'user_id': user_id})
        swiped_ids = {swipe['apartment_id'] for swipe in swipes_data['data']} if swipes_data.get('success') else set()
        print(f"User has swiped on {len(swiped_ids)} apartments.")
        
        # Filter the comprehensive list from the database
        available_apartments = [apt for apt in all_db_apartments if apt['id'] not in swiped_ids]
        print(f"Found {len(available_apartments)} available apartments for the user's feed.")
        
        if not available_apartments:
            return jsonify({
                "success": True, 
                "apartments": [],
                "message": "No more apartments available",
                "data_source": data_source
            })
        
        # Rank the available apartments using the ML engine
        print(f"🧠 Ranking {len(available_apartments)} apartments with ML Engine...")
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.apartment_recommendations(
            user_vector, 
            available_apartments, 
            [float(user_lat), float(user_lng)]
        )
        
        # Prepare the final list of apartments for the response
        result_apartments = []
        apartment_lookup = {apt['id']: apt for apt in available_apartments}
        for rec in recommendations[:10]: # Limit to top 10 recommendations
            apartment = apartment_lookup.get(rec['apartment_id'])
            if apartment:
                apartment['match_score'] = rec['score']
                result_apartments.append(apartment)
        
        return jsonify({
            "success": True,
            "apartments": result_apartments,
            "total_available": len(available_apartments),
            "data_source": data_source,
            "location_searched": user_city_state
        })
        
    except Exception as e:
        print(f"❌ Apartment feed error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": "An internal server error occurred"}), 500

@apartments_bp.route('/swipe', methods=['POST'])
@jwt_required()
def record_apartment_swipe():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        apartment_id = data.get('apartment_id')
        direction = data.get('direction')

        if not apartment_id or not direction:
            return jsonify({'success': False, 'error': 'Missing apartment_id or direction'}), 400
        
        is_like = direction == 'right'
        
        swipe_data = {
            'id': str(uuid.uuid4()), 
            'user_id': user_id, 
            'apartment_id': apartment_id, 
            'is_like': is_like
        }
        result = SupabaseService.insert_data('apartment_swipes', swipe_data)
        
        if not result['success']:
            print(f"Failed to record apartment swipe: {result.get('error')}")
            return jsonify({'success': False, 'error': 'Failed to record swipe'}), 500
        
        return jsonify({'success': True}), 200

    except Exception as e:
        print(f"Apartment swipe error: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'An internal server error occurred'}), 500