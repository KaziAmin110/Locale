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
        user_id = get_jwt_identity()
        user_result = SupabaseService.get_data('users', {'id': user_id})
        if not user_result['success'] or not user_result['data']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_result['data'][0]
        user_city_state = user.get('city', 'University Park, FL')
        user_lat = user.get('lat') or 27.3365
        user_lng = user.get('lng') or -82.5307
        
        all_apartments = []
        data_source = "redfin_scraper"
        
        # --- PRIMARY DATA SOURCE: SCRAPER ---
        try:
            raw_scraped_data = scrape_redfin_rentals(location=user_city_state, max_listings=20)
            
            new_apartments_to_insert = []
            
            print("🔍 Checking for existing apartments in the database...")
            existing_apartments_result = SupabaseService.get_data('apartments')
            existing_addresses = {
                apt['address'] for apt in existing_apartments_result['data']
            } if existing_apartments_result.get('success') else set()
            print(f"Found {len(existing_addresses)} existing addresses.")

            for item in raw_scraped_data:
                price = parse_price(item.get('price'))
                if price is None:
                    continue

                address = item.get('address')
                if not address:
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
                all_apartments.append(apartment_data)

                if address not in existing_addresses:
                    new_apartments_to_insert.append(apartment_data)
                    existing_addresses.add(address)
            
            if new_apartments_to_insert:
                print(f"✍️ Inserting {len(new_apartments_to_insert)} new apartments into the database...")
                insertion_result = SupabaseService.insert_data('apartments', new_apartments_to_insert)
                if not insertion_result['success']:
                    print(f"🔥 Database insertion failed: {insertion_result.get('error')}")
            else:
                print("✅ No new apartments to insert.")

        except Exception as scraper_error:
            print(f"⚠️ Scraper threw an exception: {scraper_error}")
            traceback.print_exc()
            all_apartments = []

        # --- FILTERING & RANKING ---
        swipes_data = SupabaseService.get_data('apartment_swipes', {'user_id': user_id})
        swiped_ids = {swipe['apartment_id'] for swipe in swipes_data['data']} if swipes_data.get('success') else set()
        
        # --- FIX --- Filter the 'all_apartments' list from the scraper, not the entire database.
        available_apartments = [apt for apt in all_apartments if apt['id'] not in swiped_ids]
        
        if not available_apartments:
            return jsonify({
                "success": True, 
                "apartments": [],
                "message": "No more apartments available",
                "data_source": data_source
            })
        
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.apartment_recommendations(
            user_vector, 
            available_apartments, 
            [float(user_lat), float(user_lng)]
        )
        
        result_apartments = []
        for rec in recommendations[:10]:
            apartment = next((apt for apt in available_apartments if apt['id'] == rec['apartment_id']), None)
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
        is_like = direction == 'right'

        if not apartment_id or not direction:
            return jsonify({'success': False, 'error': 'Missing apartment_id or action'}), 400
        
        swipe_data = {'id': str(uuid.uuid4()), 'user_id': user_id, 'apartment_id': apartment_id, 'is_like': is_like}
        result = SupabaseService.insert_data('apartment_swipes', swipe_data)
        
        if not result['success']:
            print(f"Failed to record apartment swipe: {result.get('error')}")
            return jsonify({'success': False, 'error': 'Failed to record swipe'}), 500
        
        return jsonify({'success': True}), 200

    except Exception as e:
        print(f"Apartment swipe error: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'An internal server error occurred'}), 500