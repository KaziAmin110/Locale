from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
from external_apis.apartment_list_api import ApartmentListAPI, PadMapperAPI
from external_apis.rentspree_api import RentSpreeAPI, ZillowAPI
from data.mock_data import MOCK_APARTMENTS
from config import Config
import uuid

apartments_bp = Blueprint('apartments', __name__)
ml_engine = MLEngine()

@apartments_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_apartment_feed():
    """Get apartments using free APIs + your existing mock data"""
    try:
        user_id = get_jwt_identity()
        
        # Get user data
        user_result = SupabaseService.get_data('users', {'id': user_id})
        if not user_result['success'] or not user_result['data']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_result['data'][0]
        user_city = user.get('city', 'Austin, TX')
        
        # Parse city and state
        if ',' in user_city and not user_city.replace('.', '').replace(',', '').replace('-', '').replace(' ', '').isdigit():
            city_parts = user_city.split(',')
            city = city_parts[0].strip()
            state = city_parts[1].strip() if len(city_parts) > 1 else 'TX'
        else:
            # If user location is coordinates, use default city
            city = 'Austin'
            state = 'TX'
        
        print(f"🔍 Searching apartments in {city}, {state}")
        
        # Try free apartment APIs in order of reliability
        real_apartments = None
        
        # Generate realistic apartment data for the user's city and preferences
        city_apartments = generate_realistic_apartments_for_city(city, state, user)
        data_source = "realistic_generated"
        print(f"✅ Generated realistic apartments: {len(city_apartments)} apartments for {city}, {state}")
        
        # Get user's previous swipes to exclude them
        swipes_data = SupabaseService.get_data('apartment_swipes', {'user_id': user_id})
        swiped_ids = []
        if swipes_data['success']:
            swiped_ids = [swipe['apartment_id'] for swipe in swipes_data['data']]
        
        # Filter out already swiped
        available_apartments = [apt for apt in city_apartments if apt['id'] not in swiped_ids]
        
        if not available_apartments:
            return jsonify({
                "success": True, 
                "apartments": [],
                "message": "No more apartments available",
                "data_source": data_source
            })
        
        # Apply your existing ML recommendations
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.apartment_recommendations(
            user_vector, 
            available_apartments, 
            [float(user.get('lat', 30.2672)), float(user.get('lng', -97.7431))]
        )
        
        # Return top apartments with scores
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
            "location_searched": f"{city}, {state}"
        })
        
    except Exception as e:
        print(f"❌ Apartment feed error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@apartments_bp.route('/swipe', methods=['POST'])
@jwt_required()
def record_apartment_swipe():
    """Record apartment swipe action"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        apartment_id = data.get('item_id')
        action = data.get('action')  # 'like' or 'pass'
        
        if not apartment_id or not action:
            return jsonify({'success': False, 'error': 'Missing apartment_id or action'}), 400
        
        # Record the swipe
        swipe_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'apartment_id': apartment_id,
            'action': action,
            'created_at': 'now()'
        }
        
        result = SupabaseService.insert_data('apartment_swipes', swipe_data)
        if not result['success']:
            return jsonify({'success': False, 'error': 'Failed to record swipe'}), 500
        
        # Check for match if liked
        if action == 'like':
            # For demo purposes, simulate a match
            is_match = True  # In real app, check if apartment owner also liked user
            
            if is_match:
                # Create match record
                match_data = {
                    'id': str(uuid.uuid4()),
                    'user_id': user_id,
                    'apartment_id': apartment_id,
                    'created_at': 'now()'
                }
                SupabaseService.insert_data('apartment_matches', match_data)
        
        return jsonify({'success': True, 'match': is_match}), 200
        
    except Exception as e:
        print(f"Apartment swipe error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

def generate_realistic_apartments_for_city(city, state, user):
    """Generate realistic apartment data based on city and user preferences"""
    import random
    
    # Real neighborhoods for different cities
    neighborhoods = {
        'austin': ['Downtown', 'South Austin', 'East Austin', 'West Campus', 'North Loop', 'Zilker', 'Mueller', 'The Domain'],
        'san francisco': ['Mission', 'SOMA', 'Castro', 'Richmond', 'Sunset', 'Mission Bay', 'Potrero Hill', 'Nob Hill'],
        'new york': ['Manhattan', 'Brooklyn', 'Queens', 'Upper East Side', 'Lower East Side', 'Williamsburg', 'Astoria'],
        'seattle': ['Capitol Hill', 'Belltown', 'Queen Anne', 'Fremont', 'Ballard', 'University District', 'South Lake Union'],
        'chicago': ['Lincoln Park', 'Wicker Park', 'River North', 'West Loop', 'Lakeview', 'Logan Square'],
        'los angeles': ['Hollywood', 'Santa Monica', 'Beverly Hills', 'Venice', 'West Hollywood', 'Downtown LA']
    }
    
    city_neighborhoods = neighborhoods.get(city.lower(), ['Downtown', 'Midtown', 'Uptown', 'East Side', 'West Side'])
    
    # Generate apartments based on user budget
    budget_min = user.get('budget_min', 1000) 
    budget_max = user.get('budget_max', 3000)
    
    apartments = []
    apartment_types = [
        'Modern Studio', 'Luxury 1BR', 'Spacious 2BR', 'Cozy 1BR', 'Designer Studio',
        'Renovated 2BR', 'Loft-Style 1BR', 'Contemporary 3BR', 'Urban 1BR', 'Historic 2BR'
    ]
    
    amenities_list = [
        ['Pool', 'Gym', 'Parking'], ['Rooftop Deck', 'Concierge', 'Pet Friendly'],
        ['In-Unit Laundry', 'Dishwasher', 'AC'], ['Balcony', 'Hardwood Floors', 'Updated Kitchen'],
        ['Courtyard', 'Storage', 'High Ceilings'], ['Elevator', 'Doorman', 'Bike Storage']
    ]
    
    # Working apartment photo URLs
    apartment_photos = [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&h=400&fit=crop'
    ]
    
    for i in range(25):  # Generate 25 apartments
        neighborhood = random.choice(city_neighborhoods)
        apt_type = random.choice(apartment_types)
        
        # Generate realistic price within user budget
        price = random.randint(
            max(budget_min - 200, 800),  # Slightly below budget min
            min(budget_max + 300, 5000)  # Slightly above budget max
        )
        
        bedrooms = random.choice([0, 1, 1, 2, 2, 3])  # Weighted toward 1-2BR
        bathrooms = max(1, bedrooms) if bedrooms > 0 else 1
        
        apartment = {
            'id': str(uuid.uuid4()),
            'title': f"{apt_type} in {neighborhood}",
            'address': f"{random.randint(100, 9999)} {random.choice(['Main St', 'Oak Ave', 'Park Blvd', 'Cedar Ln', 'Elm St'])}, {neighborhood}, {city}, {state}",
            'price': price,
            'bedrooms': bedrooms,
            'bathrooms': bathrooms,
            'square_feet': random.randint(400, 1200),
            'lat': float(user.get('lat', 30.2672)) + random.uniform(-0.1, 0.1),
            'lng': float(user.get('lng', -97.7431)) + random.uniform(-0.1, 0.1),
            'photos': random.sample(apartment_photos, random.randint(2, 4)),
            'description': f"Beautiful {apt_type.lower()} located in the heart of {neighborhood}. Perfect for young professionals!",
            'amenities': random.choice(amenities_list),
            'match_score': round(random.uniform(0.7, 0.95), 2)
        }
        apartments.append(apartment)
    
    return apartments