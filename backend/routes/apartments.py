from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
from services.scraper import scrape_redfin_rentals
import uuid
import re
import random

apartments_bp = Blueprint('apartments', __name__)
ml_engine = MLEngine()

# --- HELPER FUNCTIONS ---
def parse_price(price_str):
    if not price_str or "contact" in price_str.lower():
        return None
    cleaned_price = re.sub(r'[$,+A-Za-z/]', '', price_str).strip()
    try:
        return int(cleaned_price.split('-')[0])
    except (ValueError, IndexError):
        return None

def parse_stat(stat_str):
    # This function seems unused, but keeping it in case it's needed elsewhere.
    if not stat_str:
        return None
    match = re.search(r'[\d.]+', stat_str)
    if match:
        try:
            return float(match.group(0))
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
        user_city_state = user.get('city', 'Austin, TX')
        user_lat = user.get('lat') or 30.2672
        user_lng = user.get('lng') or -97.7431

        all_apartments = []
        data_source = "redfin_scraper"
        
        # --- PRIMARY DATA SOURCE: SCRAPER ---
        try:
            raw_scraped_data = scrape_redfin_rentals(location=user_city_state, max_listings=20)
            
            # --- NEW: DATABASE INSERTION LOGIC ---
            new_apartments_to_insert = []
            
            # 1. Fetch existing apartment addresses to prevent duplicates
            print("🔍 Checking for existing apartments in the database...")
            existing_apartments_result = SupabaseService.get_data('apartments')
            existing_addresses = {
                apt['address'] for apt in existing_apartments_result['data']
            } if existing_apartments_result['success'] else set()
            print(f"Found {len(existing_addresses)} existing addresses.")

            # Process scraped data
            for item in raw_scraped_data:
                price = parse_price(item.get('price'))
                if price is None:
                    continue

                address = item.get('address')
                if not address:
                    continue

                bedrooms = item.get('bedrooms')
                bathrooms = item.get('bathrooms')
                sqft_val = item.get('sqft')
                
                # Format the apartment data
                apartment_data = {
                    'title': f"{bedrooms or 'Studio'}, {bathrooms} in {address.split(',')[1].strip()}",
                    'address': address,
                    'price': price,
                    'bedrooms': bedrooms if bedrooms is not None else 0,
                    'bathrooms': bathrooms if bathrooms is not None else 1,
                    'square_feet': sqft_val if sqft_val is not None else None,
                    'lat': float(user_lat) + random.uniform(-0.05, 0.05),
                    'lng': float(user_lng) + random.uniform(-0.05, 0.05),
                    'photos': [item.get('image')] if item.get('image') else [],
                    'description': "A spacious apartment available for rent.",
                    'amenities': [],
                }
                all_apartments.append(apartment_data)

                # 2. Check if the apartment is new before adding it to the insert list
                if address not in existing_addresses:
                    new_apartments_to_insert.append(apartment_data)
                    existing_addresses.add(address) # Add to set to prevent duplicate inserts from the same scrape
            
            # 3. Insert new apartments into the database if any were found
            if new_apartments_to_insert:
                insertion_result = SupabaseService.insert_data('apartments', new_apartments_to_insert)
                if not insertion_result['success']:
                    print(f"🔥 Database insertion failed: {insertion_result.get('error')}")
            else:
                print("✅ No new apartments to insert.")

        except Exception as scraper_error:
            print(f"⚠️ Scraper threw an exception: {scraper_error}")
            all_apartments = []

        print(f"✅ Data source used: '{data_source}'. Total apartments for this feed: {len(all_apartments)}.")

        # --- Filter out swiped items and apply ML ---
        apartment_data = SupabaseService.get_data('apartments')['data']
        swipes_data = SupabaseService.get_data('apartment_swipes', {'user_id': user_id})

        swiped_ids = {swipe['apartment_id'] for swipe in swipes_data['data']} if swipes_data['success'] else set()

        print(apartment_data[0]['id'] in swiped_ids)
        available_apartments = [apt for apt in apartment_data if apt['id'] not in swiped_ids]

        print("Test Available Apartments:", available_apartments[0])
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
        return jsonify({"error": str(e)}), 500

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
            print("Data already exists or insertion failed. (Swiped before?)")
            return jsonify({'success': False, 'error': 'Failed to record swipe'}), 500
        
        return jsonify({'success': True}), 200

    except Exception as e:
        print(f"Apartment swipe error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500