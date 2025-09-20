from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
import uuid

apartments_bp = Blueprint('apartments', __name__)
ml_engine = MLEngine()

@apartments_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_apartment_feed():
    """Get ML-ranked apartments for swiping"""
    try:
        user_id = get_jwt_identity()
        
        # Get user data
        user_data = SupabaseService.get_data('users', {'id': user_id})
        if not user_data['success'] or not user_data['data']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_data['data'][0]
        user_location = [user.get('lat'), user.get('lng')]
        
        # Get user's previous swipes to exclude them
        swipes_data = SupabaseService.get_data('apartment_swipes', {'user_id': user_id})
        swiped_ids = []
        if swipes_data['success']:
            swiped_ids = [swipe['apartment_id'] for swipe in swipes_data['data']]
        
        # Get apartments from Supabase, filtered by city and excluding swiped ones
        apartments_data = SupabaseService.get_data('apartments', {})
        if not apartments_data['success']:
            return jsonify({"error": "Failed to fetch apartments"}), 500
        
        all_apartments = apartments_data['data']
        
        # Filter apartments by city and unswiped
        city_apartments = [apt for apt in all_apartments 
                          if user.get('city') and user['city'].lower() in apt['address'].lower() 
                          and apt['id'] not in swiped_ids]
        
        if not city_apartments:
            return jsonify({"success": True, "apartments": []})
        
        # Get ML recommendations
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.apartment_recommendations(user_vector, city_apartments, user_location)
        
        # Return top apartments with scores
        result_apartments = []
        for rec in recommendations[:10]:  # Top 10 for feed
            apartment = next((apt for apt in city_apartments if apt['id'] == rec['apartment_id']), None)
            if apartment:
                apartment['match_score'] = rec['score']
                result_apartments.append(apartment)
        
        return jsonify({
            "success": True,
            "apartments": result_apartments,
            "total_available": len(city_apartments)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@apartments_bp.route('/swipe', methods=['POST'])
@jwt_required()
def record_apartment_swipe():
    """Record apartment swipe"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        apartment_id = data.get('apartment_id')
        direction = data.get('direction')  # 'left' or 'right'
        
        if not apartment_id or direction not in ['left', 'right']:
            return jsonify({"error": "Invalid swipe data"}), 400
        
        # Record swipe
        swipe_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'apartment_id': apartment_id,
            'direction': direction,
            'created_at': 'now()'
        }
        
        result = SupabaseService.insert_data('apartment_swipes', swipe_data)
        
        if result['success']:
            # If right swipe, create match
            if direction == 'right':
                match_data = {
                    'id': str(uuid.uuid4()),
                    'user_id': user_id,
                    'apartment_id': apartment_id,
                    'match_score': 0.8,  # Default score, can be improved
                    'created_at': 'now()'
                }
                SupabaseService.insert_data('apartment_matches', match_data)
                
                return jsonify({
                    "success": True,
                    "message": "Apartment liked and matched!",
                    "is_match": True
                })
            else:
                return jsonify({
                    "success": True,
                    "message": "Apartment passed",
                    "is_match": False
                })
        else:
            return jsonify({"error": "Failed to record swipe"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@apartments_bp.route('/matches', methods=['GET'])
@jwt_required()
def get_apartment_matches():
    """Get user's apartment matches"""
    try:
        user_id = get_jwt_identity()
        
        # Get user's matches
        matches_data = SupabaseService.get_data('apartment_matches', {'user_id': user_id})
        
        if not matches_data['success']:
            return jsonify({"error": "Failed to get matches"}), 500
        
        # Get apartment details for each match
        matched_apartments = []
        for match in matches_data['data']:
            apartment_data = SupabaseService.get_data('apartments', {'id': match['apartment_id']})
            if apartment_data['success'] and apartment_data['data']:
                apartment = apartment_data['data'][0]
                apartment['match_score'] = match['match_score']
                apartment['matched_at'] = match['created_at']
                matched_apartments.append(apartment)
        
        return jsonify({
            "success": True,
            "matches": matched_apartments
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@apartments_bp.route('/filter', methods=['POST'])
@jwt_required()
def apply_apartment_filters():
    """Apply filters to apartment feed"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get user data for location
        user_data = SupabaseService.get_data('users', {'id': user_id})
        if not user_data['success']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_data['data'][0]
        
        # Get apartments from Supabase
        apartments_data = SupabaseService.get_data('apartments', {})
        if not apartments_data['success']:
            return jsonify({"error": "Failed to fetch apartments"}), 500
        
        filtered_apartments = apartments_data['data']
        
        # Price filter
        if 'price_min' in data and 'price_max' in data:
            filtered_apartments = [apt for apt in filtered_apartments 
                                 if data['price_min'] <= apt['price'] <= data['price_max']]
        
        # Bedrooms filter
        if 'bedrooms' in data:
            filtered_apartments = [apt for apt in filtered_apartments 
                                 if apt['bedrooms'] == data['bedrooms']]
        
        # Amenities filter
        if 'amenities' in data and data['amenities']:
            filtered_apartments = [apt for apt in filtered_apartments 
                                 if any(amenity in apt.get('amenities', []) 
                                       for amenity in data['amenities'])]
        
        return jsonify({
            "success": True,
            "apartments": filtered_apartments[:20],  # Return top 20
            "total_found": len(filtered_apartments)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500