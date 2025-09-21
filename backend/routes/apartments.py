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
            
            for item in raw_scraped_data:
                price = parse_price(item.get('price'))
                if price is None:
                    continue


                bedrooms = item.get('bedrooms')
                bathrooms = item.get('bathrooms')
                sqft_val = item.get('sqft')

                all_apartments.append({
                    'id': str(uuid.uuid4()),
                    'title': f"{item.get('bedrooms', 'Studio')}, {bathrooms} in {item.get('address').split(',')[1]}",
                    'address': item.get('address'),
                    'price': price,
                    'bedrooms': bedrooms if bedrooms is not None else 0,
                    'bathrooms': bathrooms if bathrooms is not None else 1,
                    'square_feet': sqft_val if sqft_val is not None else None,
                    'lat': float(user_lat) + random.uniform(-0.05, 0.05),
                    'lng': float(user_lng) + random.uniform(-0.05, 0.05),
                    'photos': [item.get('image')] if item.get('image') else [],
                    'description': "A spacious apartment available for rent.",
                    'amenities': [],
                })
        except Exception as scraper_error:
            print(f"⚠️ Scraper threw an exception: {scraper_error}")
            all_apartments = [] # Ensure list is empty if scraper fails midway

        # --- FALLBACK DATA SOURCE: GENERATED APARTMENTS ---
        if not all_apartments:
            print("✅ Scraper returned no results. Falling back to generated data.")
            data_source = "fallback_generated"
            city, state = 'Austin', 'TX'
            if ',' in user_city_state:
                parts = [p.strip() for p in user_city_state.split(',')]
                if len(parts) >= 2:
                    city = parts[-2]
                    state_zip = parts[-1].split(' ')
                    state = state_zip[0]
            all_apartments = generate_realistic_apartments_for_city(city, state, user)

        print(f"✅ Data source used: '{data_source}'. Total apartments: {len(all_apartments)}.")

        # --- Filter out swiped items and apply ML ---
        swipes_data = SupabaseService.get_data('apartment_swipes', {'user_id': user_id})
        swiped_ids = [swipe['apartment_id'] for swipe in swipes_data['data']] if swipes_data['success'] else []
        
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
        return jsonify({"error": str(e)}), 500

@apartments_bp.route('/swipe', methods=['POST'])
@jwt_required()
def record_apartment_swipe():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Handle both frontend formats
        apartment_id = data.get('apartment_id') or data.get('item_id')
        direction = data.get('direction', 'right')
        action = 'like' if direction == 'right' else 'pass'
        
        if not apartment_id:
            return jsonify({'success': False, 'error': 'Missing apartment_id'}), 400
        
        # Record swipe
        swipe_data = {
            'id': str(uuid.uuid4()), 
            'user_id': user_id, 
            'apartment_id': apartment_id, 
            'is_like': action == 'like',
            'created_at': 'now()'
        }
        result = SupabaseService.insert_data('apartment_swipes', swipe_data)
        if not result['success']:
            return jsonify({'success': False, 'error': 'Failed to record swipe'}), 500
        
        # Create match if liked
        is_match = action == 'like'
        if is_match:
            match_data = {
                'id': str(uuid.uuid4()), 
                'user_id': user_id, 
                'apartment_id': apartment_id, 
                'created_at': 'now()'
            }
            match_result = SupabaseService.insert_data('apartment_matches', match_data)
            if match_result['success']:
                return jsonify({
                    'success': True, 
                    'match': True,
                    'message': 'Apartment liked! Added to your matches.'
                }), 200
        
        return jsonify({
            'success': True, 
            'match': False,
            'message': 'Swipe recorded'
        }), 200
        
    except Exception as e:
        print(f"Apartment swipe error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

def generate_realistic_apartments_for_city(city, state, user):
    """Fallback function to generate apartment data if scraper fails."""
    neighborhoods = {'austin': ['Downtown', 'South Austin'], 'orlando': ['Downtown', 'Lake Nona']}
    city_neighborhoods = neighborhoods.get(city.lower(), ['Downtown', 'Midtown'])
    
    user_lat = user.get('lat') or 30.2672
    user_lng = user.get('lng') or -97.7431
    budget_min = user.get('budget_min', 1000) 
    budget_max = user.get('budget_max', 3000)
    
    apartments = []
    apartment_photos = [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
    ]
    
    for i in range(25):
        neighborhood = random.choice(city_neighborhoods)
        bedrooms = random.choice([0, 1, 1, 2, 2, 3])
        apartment = {
            'id': str(uuid.uuid4()),
            'title': f"Spacious {bedrooms}BR in {neighborhood}",
            'address': f"{random.randint(100, 9999)} Main St, {neighborhood}, {city}, {state}",
            'price': random.randint(max(budget_min - 200, 800), min(budget_max + 300, 5000)),
            'bedrooms': bedrooms,
            'bathrooms': max(1, bedrooms),
            'square_feet': random.randint(400, 1200),
            'lat': float(user_lat) + random.uniform(-0.1, 0.1),
            'lng': float(user_lng) + random.uniform(-0.1, 0.1),
            'photos': random.sample(apartment_photos, 2),
            'description': f"A beautiful apartment in {neighborhood}.",
            'amenities': ['Pool', 'Gym'],
            'match_score': round(random.uniform(0.7, 0.95), 2)
        }
        apartments.append(apartment)
    
    return apartments
