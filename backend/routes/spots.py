from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
from config import Config
from external_apis.google_places_api import GooglePlacesAPI 
from external_apis.yelp_api import YelpAPI
import uuid
import traceback

spots_bp = Blueprint('spots', __name__)
ml_engine = MLEngine()

@spots_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_spots_feed():
    """
    Generates a feed of local spots by fetching from APIs, inserting new ones 
    into the database, and ranking the fresh results for the user.
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

        # --- DATA SOURCING (From external APIs) ---
        if Config.GOOGLE_PLACES_API_KEY:
            print("Attempting to fetch data from Google Places API...")
            google_result = GooglePlacesAPI.search_nearby_by_interest(
                location=user_city, lat=user_lat, lng=user_lng, user_interests=user_interests
            )
            if google_result.get('success') and google_result.get('spots'):
                all_spots.extend(google_result['spots'])
                data_source = "google_places"
        
        if not all_spots and Config.YELP_API_KEY:
            print("Falling back to Yelp API...")
            yelp_result = YelpAPI.search_by_interest(
                location=user_city, lat=user_lat, lng=user_lng, user_interests=user_interests
            )
            if yelp_result.get('success') and yelp_result.get('spots'):
                all_spots.extend(yelp_result['spots'])
                data_source = "yelp"

        # --- DATABASE INSERTION LOGIC ---
        # Only try to insert if we got real data from an API
        if all_spots:
            new_spots_to_insert = []
            print("Checking for existing spots in the database...")
            existing_spots_result = SupabaseService.get_data('spots')
            existing_external_ids = {
                spot['external_id'] for spot in existing_spots_result['data']
                if 'external_id' in spot
            } if existing_spots_result.get('success') else set()
            print(f"Found {len(existing_external_ids)} existing spots.")

            for spot in all_spots:
                external_id = spot.get('external_id')
                if external_id and external_id not in existing_external_ids:
                    new_spots_to_insert.append(spot)
                    existing_external_ids.add(external_id)
            
            if new_spots_to_insert:
                print(f"Inserting {len(new_spots_to_insert)} new spots into the database...")
                insertion_result = SupabaseService.insert_data('spots', new_spots_to_insert)
                if not insertion_result.get('success'):
                    print(f"Database insertion for spots failed: {insertion_result.get('error')}")
            else:
                print("No new spots to insert.")
        else:
            print("APIs returned no data. No data to insert.")

        # --- FILTERING & RANKING ---
        db_spots = SupabaseService.get_data('spots')['data']
        swipes_data = SupabaseService.get_data('spot_swipes', {'user_id': user_id})
        swiped_ids = {swipe['spot_id'] for swipe in swipes_data['data']} if swipes_data.get('success') else set()
        
        # --- FIX --- Filter the 'all_spots' list that was just fetched from the APIs.
        available_spots = [spot for spot in db_spots if spot['id'] not in swiped_ids]
        
        if not available_spots:
            return jsonify({
                "success": True, "spots": [],
                "message": "No new spots to show right now!", "data_source": data_source
            })

        print(f"🧠 Ranking {len(available_spots)} spots with ML Engine...")
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.spot_recommendations(
            user_vector, 
            available_spots, 
            [user_lat, user_lng],
            user_interests
        )
        
        result_spots = []
        spot_lookup = {spot['id']: spot for spot in available_spots}

        for rec in recommendations:
            spot = spot_lookup.get(rec['spot_id'])
            if spot:
                spot['match_score'] = rec['score']
                result_spots.append(spot)
        
        return jsonify({
            "success": True,
            "spots": result_spots,
            "total_available": len(available_spots),
            "data_source": data_source
        })
        
    except Exception as e:
        print(f"An error occurred in the spots feed: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": "An internal server error occurred"}), 500

@spots_bp.route('/swipe', methods=['POST'])
@jwt_required()
def record_spot_swipe():
    """Records a user's swipe action (like/pass) for a specific spot."""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        spot_id = data.get('spot_id')
        direction = data.get('direction')
        is_like = direction == 'right'

        if not spot_id or not direction:
            return jsonify({'success': False, 'error': 'Missing spot_id or direction'}), 400
        
        # --- FIX --- Added a unique ID for the swipe record itself.
        swipe_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'spot_id': spot_id,
            'is_like': is_like
        }
        result = SupabaseService.insert_data('spot_swipes', swipe_data)

        if not result['success']:
            print(f"Failed to record spot swipe: {result.get('error')}")
            return jsonify({'success': False, 'error': 'Failed to record swipe'}), 500
        
        return jsonify({'success': True}), 200

    except Exception as e:
        print(f"Spot swipe error: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'An internal server error occurred'}), 500