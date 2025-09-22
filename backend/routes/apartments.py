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

# --- MAIN FEED ENDPOINT ---

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
        
        # Smart location handling
        user_city = user.get('city', 'Orlando')
        user_state = user.get('state', 'FL')
        location_query = f"{user_city}, {user_state}" if ',' not in user_city else user_city
        
        print(f"📍 Prepared location query for scraper: '{location_query}'")
        
        user_lat = user.get('lat') or 28.5383
        user_lng = user.get('lng') or -81.3792
        
        data_source = "redfin_scraper"
        
        # 2. Data Sourcing & Insertion (from Scraper)
        try:
            raw_scraped_data = scrape_redfin_rentals(location=location_query, max_listings=20)
            
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

                if not price or not address or address in existing_addresses:
                    continue

                bedrooms = parse_integer_value(item.get('bedrooms'))
                bathrooms = parse_integer_value(item.get('bathrooms'))
                sqft_val = parse_integer_value(item.get('sqft'))
                
                try:
                    address_city = address.split(',')[1].strip()
                except IndexError:
                    address_city = user_city.split(',')[0]

                apartment_data = {
                    'id': str(uuid.uuid4()),
                    'title': f"{bedrooms or 'Studio'}, {bathrooms or 1} bath in {address_city}",
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
                existing_addresses.add(address)
            
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

        # 3. Filtering & Ranking Logic
        all_db_apartments_result = SupabaseService.get_data('apartments')
        all_db_apartments = all_db_apartments_result['data'] if all_db_apartments_result.get('success') else []

        swipes_data = SupabaseService.get_data('apartment_swipes', {'user_id': user_id})
        swiped_ids = {swipe['apartment_id'] for swipe in swipes_data['data']} if swipes_data.get('success') else set()
        
        available_apartments = [apt for apt in all_db_apartments if apt['id'] not in swiped_ids]
        
        # 4. Fallback Data Generation (if needed)
        if not available_apartments and not all_db_apartments:
            print("⚠️ No apartments found. Generating fallback data for a first-time user.")
            data_source = "fallback_generator"
            available_apartments = generate_and_save_apartments_for_city(user_city, user_state, user)

        if not available_apartments:
            return jsonify({
                "success": True, "apartments": [], "message": "No more apartments available",
                "data_source": data_source
            })
        
        # 5. ML Ranking
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.apartment_recommendations(
            user_vector, available_apartments, [float(user_lat), float(user_lng)]
        )
        
        result_apartments = []
        apartment_lookup = {apt['id']: apt for apt in available_apartments}
        for rec in recommendations[:10]:
            apartment = apartment_lookup.get(rec['apartment_id'])
            if apartment:
                apartment['match_score'] = rec['score']
                result_apartments.append(apartment)
        
        return jsonify({
            "success": True, "apartments": result_apartments, "total_available": len(available_apartments),
            "data_source": data_source, "location_searched": location_query
        })
        
    except Exception as e:
        print(f"❌ Apartment feed error: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": "An internal server error occurred"}), 500

# --- SWIPE AND MATCH ENDPOINT ---

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
        
        # Record the swipe action
        swipe_data = {
            'id': str(uuid.uuid4()), 'user_id': user_id, 
            'apartment_id': apartment_id, 'direction': direction
        }
        result = SupabaseService.insert_data('apartment_swipes', swipe_data)
        
        if not result['success']:
            return jsonify({'success': False, 'error': 'Failed to record swipe'}), 500
        
        # If the user liked the apartment, create a match
        if is_like:
            match_data = {
                'id': str(uuid.uuid4()), 'user_id': user_id, 'apartment_id': apartment_id
            }
            SupabaseService.insert_data('apartment_matches', match_data)
            return jsonify({
                'success': True, 'match': True,
                'message': 'Apartment liked! Added to your matches.'
            }), 200
        
        # If it was a 'pass'
        return jsonify({'success': True, 'match': False, 'message': 'Swipe recorded'}), 200

    except Exception as e:
        print(f"Apartment swipe error: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'An internal server error occurred'}), 500

# --- FALLBACK DATA GENERATION FUNCTIONS ---

def generate_and_save_apartments_for_city(city, state, user):
    """Generate apartments and save them to the database."""
    print(f"Generating and saving apartments for {city}, {state}")
    apartments = generate_realistic_apartments_for_city(city, state, user)
    
    # Prepare for bulk insert, removing match_score
    apartments_to_insert = [{k: v for k, v in apt.items() if k != 'match_score'} for apt in apartments]
    
    if apartments_to_insert:
        result = SupabaseService.insert_data('apartments', apartments_to_insert)
        if not result['success']:
            print(f"Warning: Failed to save generated apartments: {result.get('error')}")
    
    return apartments

def generate_realistic_apartments_for_city(city, state, user):
    """Fallback function to generate apartment data if scraper and DB fail."""
    neighborhoods = {'orlando': ['Downtown', 'Lake Nona', 'Winter Park'], 'austin': ['Downtown', 'South Congress']}
    city_neighborhoods = neighborhoods.get(city.lower(), ['Downtown', 'Midtown'])
    
    user_lat = user.get('lat', 28.5383)
    user_lng = user.get('lng', -81.3792)
    
    apartments = []
    apartment_photos = [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
    ]
    
    for _ in range(20):
        neighborhood = random.choice(city_neighborhoods)
        bedrooms = random.choice([0, 1, 1, 2, 2, 3])
        apartment = {
            'id': str(uuid.uuid4()),
            'title': f"Spacious {bedrooms if bedrooms > 0 else 'Studio'} in {neighborhood}",
            'address': f"{random.randint(100, 9999)} Main St, {neighborhood}, {city}, {state}",
            'price': random.randint(1400, 3500),
            'bedrooms': bedrooms,
            'bathrooms': max(1, bedrooms),
            'square_feet': random.randint(500, 1800),
            'lat': float(user_lat) + random.uniform(-0.1, 0.1),
            'lng': float(user_lng) + random.uniform(-0.1, 0.1),
            'photos': random.sample(apartment_photos, 2),
            'description': f"A beautiful apartment in {neighborhood}.",
            'amenities': ['Pool', 'Gym', 'Parking'],
            'match_score': 0.0 # Will be calculated by ML engine
        }
        apartments.append(apartment)
    
    return apartments