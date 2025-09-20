from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
from external_apis.apartment_list_api import ApartmentListAPI, PadMapperAPI
from data.mock_data import MOCK_APARTMENTS
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
        user_data = SupabaseService.get_data('users', {'id': user_id})
        if not user_data['success'] or not user_data['data']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_data['data'][0]
        
        # Extract city and state
        city_parts = user['city'].split(',') if user['city'] else ['Austin', 'TX']
        city = city_parts[0].strip()
        state = city_parts[1].strip() if len(city_parts) > 1 else 'TX'
        
        print(f"🔍 Searching apartments in {city}, {state}")
        
        # Try free apartment APIs in order
        real_apartments = None
        
        # 1. Try ApartmentList first
        real_apartments = ApartmentListAPI.search_apartments(
            city=city,
            state=state,
            budget_min=user.get('budget_min', 500),
            budget_max=user.get('budget_max', 5000)
        )
        
        if real_apartments['success'] and real_apartments['apartments']:
            city_apartments = real_apartments['apartments']
            data_source = "apartmentlist"
            print(f" Using ApartmentList data: {len(city_apartments)} apartments")
        else:
            # 2. Try PadMapper as backup
            real_apartments = PadMapperAPI.search_apartments(city, state)
            
            if real_apartments['success'] and real_apartments['apartments']:
                city_apartments = real_apartments['apartments']
                data_source = "padmapper"
                print(f" Using PadMapper data: {len(city_apartments)} apartments")
            else:
                # 3. Fallback to your existing mock data
                city_apartments = [apt for apt in MOCK_APARTMENTS 
                                  if city.lower() in apt['address'].lower()]
                data_source = "mock"
                print(f" Using mock data: {len(city_apartments)} apartments")
        
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
            [user.get('lat', 30.2672), user.get('lng', -97.7431)]
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
        print(f" Apartment feed error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Keep all your other apartment routes exactly the same
@apartments_bp.route('/swipe', methods=['POST'])
@jwt_required()
def record_apartment_swipe():
    # Keep existing code exactly as is
    pass

@apartments_bp.route('/matches', methods=['GET'])
@jwt_required()
def get_apartment_matches():    # Keep existing code exactly as is
    pass

# ... all other routes stay the same