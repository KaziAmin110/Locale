from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine
import uuid

people_bp = Blueprint('people', __name__)
ml_engine = MLEngine()

@people_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_people_feed():
    """Get ML-ranked people for swiping"""
    try:
        user_id = get_jwt_identity()
        
        user_data = SupabaseService.get_data('users', {'id': user_id})
        if not user_data['success'] or not user_data['data']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_data['data'][0]
        
        user_lat = user.get('lat', 30.2672)
        user_lng = user.get('lng', -97.7431)
        user_location = [user_lat, user_lng]
        
        swipes_data = SupabaseService.get_data('people_swipes', {'swiper_id': user_id})
        swiped_ids = []
        if swipes_data['success']:
            swiped_ids = [swipe['swiped_id'] for swipe in swipes_data['data']]
        
        people_data = SupabaseService.get_data('users', {})
        if not people_data['success']:
            return jsonify({"error": "Failed to fetch people"}), 500
        
        all_people = people_data['data']
        
        available_people = [person for person in all_people 
                           if person['id'] not in swiped_ids 
                           and person['id'] != user_id]
        
        if not available_people:
            return jsonify({"success": True, "people": []})
        
        user_vector = ml_engine.create_user_vector(user)
        recommendations = ml_engine.people_recommendations(user_vector, available_people, user_location)
        
        result_people = []
        for rec in recommendations[:10]:
            person = next((p for p in available_people if p['id'] == rec['person_id']), None)
            if person:
                person['match_score'] = rec['score']
                person['interest_similarity'] = rec['interest_similarity']
                result_people.append(person)
        
        return jsonify({
            "success": True,
            "people": result_people,
            "total_available": len(available_people)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@people_bp.route('/swipe', methods=['POST'])
@jwt_required()
def record_people_swipe():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        swiped_id = data.get('person_id') or data.get('item_id')
        direction = data.get('direction', 'right')
        is_like = direction == 'right'
        
        if not swiped_id or direction not in ['left', 'right']:
            return jsonify({"error": "Invalid swipe data"}), 400
        
        swipe_data = {
            'id': str(uuid.uuid4()),
            'swiper_id': user_id,
            'swiped_id': swiped_id,
            'direction': direction,
            'created_at': 'now()'
        }
        
        result = SupabaseService.insert_data('people_swipes', swipe_data)
        
        if result['success'] and is_like:
            mutual_swipe = SupabaseService.get_data('people_swipes', {
                'swiper_id': swiped_id,
                'swiped_id': user_id,
                'direction': 'right'
            })
            
            is_mutual = mutual_swipe['success'] and len(mutual_swipe['data']) > 0
            
            match_data = {
                'id': str(uuid.uuid4()),
                'user1_id': user_id,
                'user2_id': swiped_id,
                'created_at': 'now()'
            }
            SupabaseService.insert_data('people_matches', match_data)
            
            if is_mutual:
                conversation_data = {
                    'id': str(uuid.uuid4()),
                    'user1_id': user_id,
                    'user2_id': swiped_id,
                    'created_at': 'now()',
                    'last_message_at': 'now()'
                }
                SupabaseService.insert_data('conversations', conversation_data)
            
            return jsonify({
                "success": True,
                "match": True,
                "message": "Person liked!" + (" It's a mutual match!" if is_mutual else ""),
                "is_mutual": is_mutual
            })
        else:
            return jsonify({
                "success": True,
                "match": False,
                "message": "Person passed"
            })
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@people_bp.route('/matches', methods=['GET'])
@jwt_required()
def get_people_matches():
    try:
        user_id = get_jwt_identity()
        
        matches_data1 = SupabaseService.get_data('people_matches', {'user1_id': user_id})
        matches_data2 = SupabaseService.get_data('people_matches', {'user2_id': user_id})
        
        all_matches = []
        if matches_data1['success']:
            all_matches.extend(matches_data1['data'])
        if matches_data2['success']:
            all_matches.extend(matches_data2['data'])
        
        matched_people = []
        for match in all_matches:
            other_user_id = match['user2_id'] if match['user1_id'] == user_id else match['user1_id']
            person = next((p for p in MOCK_PEOPLE if p['id'] == other_user_id), None)
            if person:
                person['match_score'] = match['match_score']
                person['is_mutual'] = match['is_mutual']
                person['matched_at'] = match['created_at']
                matched_people.append(person)
        
        return jsonify({
            "success": True,
            "matches": matched_people
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@people_bp.route('/filters', methods=['POST'])
@jwt_required()
def apply_people_filters():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        user_data = SupabaseService.get_data('users', {'id': user_id})
        if not user_data['success']:
            return jsonify({"error": "User not found"}), 404
        
        user = user_data['data'][0]
        
        people_data = SupabaseService.get_data('people', {})
        if not people_data['success']:
            return jsonify({"error": "Failed to fetch people"}), 500
        
        filtered_people = people_data['data']
        
        if 'age_min' in data and 'age_max' in data:
            filtered_people = [person for person in filtered_people 
                             if data['age_min'] <= person['age'] <= data['age_max']]
        
        if 'interests' in data and data['interests']:
            filtered_people = [person for person in filtered_people 
                             if any(interest in person.get('interests', []) 
                                   for interest in data['interests'])]
        
        if 'max_distance' in data:
            pass
        
        return jsonify({
            "success": True,
            "people": filtered_people[:20],
            "total_found": len(filtered_people)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500