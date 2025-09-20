from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
import uuid

spots_bp = Blueprint('spots', __name__)
ml_engine = MLEngine()

@spots_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_spots_feed():
    """Get ML-ranked spots for swiping"""
    try:
        user_id = get_jwt_identity()
        
        # Get user data
        user_data = SupabaseService.get_data('users', {'id': user_id})
        if not user_data['success'] or not user_data['data']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_data['data'][0]
        user_location = [user.get('lat'), user.get('lng')]
        
        # Get user's previous swipes to exclude them
        swipes_data = SupabaseService.get_data('spot_swipes', {'user_id': user_id})
        swiped_ids = []
        if swipes_data['success']:
            swiped_ids = [swipe['spot_id'] for swipe in swipes_data['data']]
        
        # Get spots from Supabase, filtered by city and excluding swiped ones
        spots_data = SupabaseService.get_data('spots', {})
        if not spots_data['success']:
            return jsonify({"error": "Failed to fetch spots"}), 500
        
        all_spots = spots_data['data']
        
        # Filter spots by city and unswiped
        available_spots = [spot for spot in all_spots 
                          if user.get('city') and user['city'].lower() in spot['address'].lower() 
                          and spot['id'] not in swiped_ids]
        
        if not available_spots:
            return jsonify({"success": True, "spots": []})
        
        # Get ML recommendations
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.spot_recommendations(user_vector, available_spots, user_location)
        
        # Return top spots with scores
        result_spots = []
        for rec in recommendations[:10]:  # Top 10 for feed
            spot = next((s for s in available_spots if s['id'] == rec['spot_id']), None)
            if spot:
                spot['match_score'] = rec['score']
                spot['distance'] = rec['distance']
                result_spots.append(spot)
        
        return jsonify({
            "success": True,
            "spots": result_spots,
            "total_available": len(available_spots)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@spots_bp.route('/swipe', methods=['POST'])
@jwt_required()
def record_spot_swipe():
    """Record spot swipe"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        spot_id = data.get('spot_id')
        direction = data.get('direction')  # 'left' or 'right'
        
        if not spot_id or direction not in ['left', 'right']:
            return jsonify({"error": "Invalid swipe data"}), 400
        
        # Record swipe
        swipe_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'spot_id': spot_id,
            'direction': direction,
            'created_at': 'now()'
        }
        
        result = SupabaseService.insert_data('spot_swipes', swipe_data)
        
        if result['success']:
            # If right swipe, create match
            if direction == 'right':
                match_data = {
                    'id': str(uuid.uuid4()),
                    'user_id': user_id,
                    'spot_id': spot_id,
                    'match_score': 0.8,
                    'created_at': 'now()'
                }
                SupabaseService.insert_data('spot_matches', match_data)
                
                return jsonify({
                    "success": True,
                    "message": "Spot saved to your favorites!",
                    "is_match": True
                })
            else:
                return jsonify({
                    "success": True,
                    "message": "Spot passed",
                    "is_match": False
                })
        else:
            return jsonify({"error": "Failed to record swipe"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@spots_bp.route('/matches', methods=['GET'])
@jwt_required()
def get_spot_matches():
    """Get user's spot matches (favorites)"""
    try:
        user_id = get_jwt_identity()
        
        # Get user's matches
        matches_data = SupabaseService.get_data('spot_matches', {'user_id': user_id})
        
        if not matches_data['success']:
            return jsonify({"error": "Failed to get matches"}), 500
        
        # Get spot details for each match
        matched_spots = []
        for match in matches_data['data']:
            spot = next((s for s in MOCK_SPOTS if s['id'] == match['spot_id']), None)
            if spot:
                spot['match_score'] = match['match_score']
                spot['saved_at'] = match['created_at']
                matched_spots.append(spot)
        
        return jsonify({
            "success": True,
            "matches": matched_spots
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@spots_bp.route('/categories', methods=['GET'])
def get_spot_categories():
    """Get available spot categories"""
    return jsonify({
        "success": True,
        "categories": [
            {"id": "coffee_shop", "name": "Coffee Shops", "icon": "☕"},
            {"id": "restaurant", "name": "Restaurants", "icon": "🍽️"},
            {"id": "bar", "name": "Bars & Nightlife", "icon": "🍻"},
            {"id": "gym", "name": "Gyms & Fitness", "icon": "💪"},
            {"id": "park", "name": "Parks & Recreation", "icon": "🌳"},
            {"id": "museum", "name": "Museums & Culture", "icon": "🎨"},
            {"id": "shopping", "name": "Shopping", "icon": "🛍️"}
        ]
    })

@spots_bp.route('/categories', methods=['POST'])
@jwt_required()
def filter_by_categories():
    """Filter spots by categories"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        categories = data.get('categories', [])
        
        if not categories:
            return jsonify({"error": "No categories specified"}), 400
        
        # Filter spots by categories
        filtered_spots = [spot for spot in MOCK_SPOTS 
                         if spot['category'] in categories]
        
        return jsonify({
            "success": True,
            "spots": filtered_spots[:50],  # Return top 50
            "total_found": len(filtered_spots)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500