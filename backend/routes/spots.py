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
    try:
        user_id = get_jwt_identity()

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

        swipes_data = SupabaseService.get_data('spot_swipes', {'user_id': user_id})
        swiped_addresses = {swipe['address'] for swipe in swipes_data['data']} if swipes_data.get('success') else set()

        available_spots = [spot for spot in all_spots if spot['address'] not in swiped_addresses]

        if not available_spots:
            return jsonify({
                "success": True, "spots": [],
                "message": "No new spots to show right now!", "data_source": data_source
            })

        # user_vector = ml_engine.create_user_vector(user)
        # recommendations = ml_engine.spot_recommendations(
        #     user_vector, 
        #     available_spots, 
        #     [user_lat, user_lng],
        #     user_interests
        # )
        
        # result_spots = []
        # spot_lookup = {spot['id']: spot for spot in available_spots}

        # for rec in recommendations:
        #     spot = spot_lookup.get(rec['spot_id'])
        #     if spot:
        #         spot['match_score'] = rec['score']
        #         result_spots.append(spot)
        
        return jsonify({
            "success": True,
            "spots": available_spots,
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
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        direction = data.get('direction')
        is_like = direction == 'right'
        address = data.get('address', 'Invalid Address')
        spot_id = data.get('spot_id')

        if not spot_id or not direction or not address:
            return jsonify({'success': False, 'error': 'Missing spot_id, direction, or address'}), 400

        swipe_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'is_like': is_like,
            'address': address
        }
        result = SupabaseService.insert_data('spot_swipes', swipe_data)

        if not result['success']:
            print(f"Failed to record spot swipe: {result.get('error')}")
            return jsonify({'success': False, 'error': 'Failed to record swipe'}), 500
        
        if is_like:
            match_data = {
                'id': str(uuid.uuid4()), 'user_id': user_id, 'spot_id': spot_id, 'address': address
            }
            SupabaseService.insert_data('spot_matches', match_data)
            return jsonify({
                'success': True, 'match': True,
                'message': 'Spot liked! Added to your matches.'
            }), 200
        
        return jsonify({'success': True, 'match': False, 'message': 'Swipe recorded'}), 200

    except Exception as e:
        print(f"Spot swipe error: {str(e)}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': 'An internal server error occurred'}), 500