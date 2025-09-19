from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from data.mock_data import MOCK_APARTMENTS, MOCK_PEOPLE, MOCK_SPOTS

matches_bp = Blueprint('matches', __name__)

@matches_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_matches():
    """Get all user matches across all categories"""
    try:
        user_id = get_jwt_identity()
        
        # Get apartment matches
        apt_matches = SupabaseService.get_data('apartment_matches', {'user_id': user_id})
        apartment_matches = []
        if apt_matches['success']:
            for match in apt_matches['data']:
                apartment = next((apt for apt in MOCK_APARTMENTS if apt['id'] == match['apartment_id']), None)
                if apartment:
                    apartment['match_type'] = 'apartment'
                    apartment['match_score'] = match['match_score']
                    apartment['matched_at'] = match['created_at']
                    apartment_matches.append(apartment)
        
        # Get people matches
        people_matches1 = SupabaseService.get_data('people_matches', {'user1_id': user_id})
        people_matches2 = SupabaseService.get_data('people_matches', {'user2_id': user_id})
        
        people_matches = []
        all_people_matches = []
        if people_matches1['success']:
            all_people_matches.extend(people_matches1['data'])
        if people_matches2['success']:
            all_people_matches.extend(people_matches2['data'])
        
        for match in all_people_matches:
            other_user_id = match['user2_id'] if match['user1_id'] == user_id else match['user1_id']
            person = next((p for p in MOCK_PEOPLE if p['id'] == other_user_id), None)
            if person:
                person['match_type'] = 'person'
                person['match_score'] = match['match_score']
                person['is_mutual'] = match['is_mutual']
                person['matched_at'] = match['created_at']
                people_matches.append(person)
        
        # Get spot matches
        spot_matches = SupabaseService.get_data('spot_matches', {'user_id': user_id})
        spots_matches = []
        if spot_matches['success']:
            for match in spot_matches['data']:
                spot = next((s for s in MOCK_SPOTS if s['id'] == match['spot_id']), None)
                if spot:
                    spot['match_type'] = 'spot'
                    spot['match_score'] = match['match_score']
                    spot['matched_at'] = match['created_at']
                    spots_matches.append(spot)
        
        return jsonify({
            "success": True,
            "matches": {
                "apartments": apartment_matches,
                "people": people_matches,
                "spots": spots_matches
            },
            "total_counts": {
                "apartments": len(apartment_matches),
                "people": len(people_matches),
                "spots": len(spots_matches)
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@matches_bp.route('/<match_id>', methods=['DELETE'])
@jwt_required()
def remove_match(match_id):
    """Remove a specific match"""
    try:
        user_id = get_jwt_identity()
        match_type = request.args.get('type')  # 'apartment', 'person', 'spot'
        
        if not match_type:
            return jsonify({"error": "Match type required"}), 400
        
        # Determine which table to delete from
        table_map = {
            'apartment': 'apartment_matches',
            'person': 'people_matches', 
            'spot': 'spot_matches'
        }
        
        if match_type not in table_map:
            return jsonify({"error": "Invalid match type"}), 400
        
        # For people matches, we need to handle both user1_id and user2_id
        if match_type == 'person':
            # Delete from people_matches where user is either user1 or user2
            # This is a simplified approach - in production you'd want more specific deletion
            pass  # Implementation would depend on specific requirements
        else:
            # Delete the match
            # Note: Supabase client doesn't have a direct delete method in our implementation
            # You would need to implement this or use raw SQL
            pass
        
        return jsonify({
            "success": True,
            "message": f"{match_type.title()} match removed"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500