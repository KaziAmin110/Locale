from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
from config import Config
from external_apis.google_places_api import GooglePlacesAPI 
from external_apis.yelp_api import YelpAPI
from data.mock_data import MOCK_SPOTS
import uuid
import traceback

spots_bp = Blueprint('spots', __name__)
ml_engine = MLEngine()

@spots_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_spots_feed():
    """
    Generates a feed of local spots based on the user's city and interests,
    ranked by the ML engine.
    """
    try:
        user_id = get_jwt_identity()

        # 1. Get user data
        user_result = SupabaseService.get_data('users', {'id': user_id})
        if not user_result['success'] or not user_result['data']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_result['data'][0]
        user_city = user.get('city', 'University Park, FL') 
        user_lat = user.get('lat')
        user_lng = user.get('lng')
        user_interests = user.get('interests', ['cafe', 'park', 'restaurants', 'museum'])
        
        all_spots = []
        data_source = "unknown"

        # --- DATA SOURCING ---
        if Config.GOOGLE_PLACES_API_KEY:
            print("➡️ Attempting to fetch data from Google Places API...")
            google_result = GooglePlacesAPI.search_nearby_by_interest(
                location=user_city, lat=user_lat, lng=user_lng, user_interests=user_interests
            )
            if google_result.get('success') and google_result.get('spots'):
                all_spots.extend(google_result['spots'])
                data_source = "google_places"
                print(f"✅ Fetched {len(google_result['spots'])} spots from Google Places.")
        
        if not all_spots and Config.YELP_API_KEY:
            print("⚠️ Falling back to Yelp API...")
            yelp_result = YelpAPI.search_by_interest(
                location=user_city, lat=user_lat, lng=user_lng, user_interests=user_interests
            )
            if yelp_result.get('success') and yelp_result.get('spots'):
                all_spots.extend(yelp_result['spots'])
                data_source = "yelp"
                print(f"✅ Fetched {len(yelp_result['spots'])} spots from Yelp.")

        if not all_spots:
            print("❌ Falling back to mock data.")
            all_spots = MOCK_SPOTS 
            data_source = "mock"

        # --- FILTERING & RANKING ---
        swipes_data = SupabaseService.get_data('spot_swipes', {'user_id': user_id})
        swiped_ids = {swipe['spot_id'] for swipe in swipes_data['data']} if swipes_data.get('success') else set()
        
        available_spots = [spot for spot in all_spots if spot.get('id') not in swiped_ids]
        
        if not available_spots:
            return jsonify({
                "success": True, "spots": [],
                "message": "No new spots to show right now!", "data_source": data_source
            })

        # --- FIX --- Uncommented and corrected ML Engine integration
        # 6. Use ML Engine to rank the available spots
        print(f"🧠 Ranking {len(available_spots)} spots with ML Engine...")
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.spot_recommendations(
            user_vector, 
            available_spots, 
            [user_lat, user_lng],
            user_interests # Pass the user's actual interests to the engine
        )
        
        # 7. Prepare the final list of spots to return
        result_spots = []
        spot_lookup = {spot['id']: spot for spot in available_spots}

        for rec in recommendations:
            # --- FIX --- Use 'spot_id' which is returned by the ML engine
            spot = spot_lookup.get(rec['spot_id'])
            if spot:
                spot['match_score'] = rec['score']
                result_spots.append(spot)
        
        print(result_spots);
        
        return jsonify({
            "success": True,
            "spots": result_spots,
            "total_available": len(available_spots),
            "data_source": data_source
        })
        
    except Exception as e:
        print(f"❌ An error occurred in the spots feed: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": "An internal error occurred"}), 500

@spots_bp.route('/swipe', methods=['POST'])
@jwt_required()
def record_spot_swipe():
    """Record spot swipe"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Handle both frontend formats
        spot_id = data.get('spot_id') or data.get('item_id')
        direction = data.get('direction', 'right')
        is_like = direction == 'right'
        
        if not spot_id or direction not in ['left', 'right']:
            return jsonify({"error": "Invalid swipe data"}), 400
        
        # Record swipe
        swipe_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'spot_id': spot_id,
            'is_like': is_like,
            'created_at': 'now()'
        }
        
        result = SupabaseService.insert_data('spot_swipes', swipe_data)
        
        if result['success'] and is_like:
            # Create match entry for spots
            match_data = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'spot_id': spot_id,
                'created_at': 'now()'
            }
            match_result = SupabaseService.insert_data('spot_matches', match_data)
            
            if match_result['success']:
                return jsonify({
                    "success": True,
                    "match": True,
                    "message": "Spot liked! Added to your matches."
                })
        
        return jsonify({
            "success": True,
            "match": False,
            "message": "Spot swipe recorded"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500