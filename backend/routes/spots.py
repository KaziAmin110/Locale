from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
from config import Config
from external_apis.google_places_api import GooglePlacesAPI, YelpAPI
from data.mock_data import MOCK_SPOTS
import uuid

spots_bp = Blueprint('spots', __name__)
ml_engine = MLEngine()

@spots_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_spots_feed():
    """Get real local spots based on user location and interests"""
    try:
        user_id = get_jwt_identity()
        
        # Get user data
        user_data = SupabaseService.get_data('users', {'id': user_id})
        if not user_data['success'] or not user_data['data']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_data['data'][0]
        user_lat = user.get('lat', 30.2672)
        user_lng = user.get('lng', -97.7431)
        user_interests = user.get('interests', [])
        
        # Try multiple places APIs
        real_spots = None
        
        # 1. Try Google Places first
        if Config.GOOGLE_PLACES_API_KEY:
            real_spots = GooglePlacesAPI.get_places_by_interests(
                lat=user_lat,
                lng=user_lng,
                user_interests=user_interests,
                radius=8000  # 8km radius
            )
            if real_spots['success'] and real_spots['spots']:
                print(f"✅ Using Google Places data: {len(real_spots['spots'])} spots")
        
        # 2. Fallback to Yelp
        if not real_spots or not real_spots['success'] or len(real_spots.get('spots', [])) < 10:
            if Config.YELP_API_KEY:
                yelp_spots = YelpAPI.search_businesses(
                    lat=user_lat,
                    lng=user_lng,
                    user_interests=user_interests,
                    radius=8000
                )
                if yelp_spots['success'] and yelp_spots['spots']:
                    existing_spots = real_spots.get('spots', []) if real_spots else []
                    combined_spots = existing_spots + yelp_spots['spots']
                    real_spots = {"success": True, "spots": combined_spots, "source": "google+yelp"}
                    print(f"✅ Combined Google + Yelp data: {len(combined_spots)} spots")
        
        # 3. Final fallback to mock data
        if not real_spots or not real_spots['success'] or not real_spots['spots']:
            available_spots = [spot for spot in MOCK_SPOTS 
                              if user['city'].lower() in spot['address'].lower()]
            print(f"⚠️ Using MOCK spots data: {len(available_spots)} spots")
            data_source = "mock"
        else:
            available_spots = real_spots['spots']
            data_source = real_spots.get('source', 'real')
        
        # Get user's previous swipes
        swipes_data = SupabaseService.get_data('spot_swipes', {'user_id': user_id})
        swiped_ids = [swipe['spot_id'] for swipe in swipes_data['data']] if swipes_data['success'] else []
        
        # Filter out swiped spots
        unswiped_spots = [spot for spot in available_spots if spot['id'] not in swiped_ids]
        
        if not unswiped_spots:
            return jsonify({
                "success": True, 
                "spots": [], 
                "message": "No more spots available",
                "data_source": data_source
            })
        
        # Apply ML recommendations
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.spot_recommendations(
            user_vector, 
            unswiped_spots, 
            [user_lat, user_lng]
        )
        
        # Return top recommendations
        result_spots = []
        for rec in recommendations[:15]:  # Top 15 for variety
            spot = next((s for s in unswiped_spots if s['id'] == rec['spot_id']), None)
            if spot:
                spot['match_score'] = rec['score']
                spot['distance_km'] = rec.get('distance', 0)
                result_spots.append(spot)
        
        return jsonify({
            "success": True,
            "spots": result_spots,
            "total_available": len(unswiped_spots),
            "data_source": data_source,
            "user_interests": user_interests
        })
        
    except Exception as e:
        print(f"Spots feed error: {str(e)}")
        return jsonify({"error": str(e)}), 500