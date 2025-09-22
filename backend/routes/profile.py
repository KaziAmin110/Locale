from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        
        user_data = SupabaseService.get_data('users', {'id': user_id})
        
        if user_data['success'] and user_data['data']:
            return jsonify({
                "success": True,
                "user": user_data['data'][0]
            })
        else:
            return jsonify({"error": "User not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        allowed_fields = ['name', 'age', 'bio', 'interests', 'budget_min', 'budget_max', 'city']
        update_data = {key: value for key, value in data.items() if key in allowed_fields}
        update_data['updated_at'] = 'now()'
        
        result = SupabaseService.update_data('users', update_data, {'id': user_id})
        
        if result['success']:
            return jsonify({
                "success": True,"message": "Profile updated successfully"
            })
        else:
            return jsonify({"error": "Failed to update profile"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@profile_bp.route('/photos', methods=['POST'])
@jwt_required()
def add_profile_photos():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        photo_urls = data.get('photos', [])
        
        if not photo_urls:
            return jsonify({"error": "No photos provided"}), 400
        
        user_data = SupabaseService.get_data('users', {'id': user_id})
        if not user_data['success']:
            return jsonify({"error": "User not found"}), 404
        
        current_photos = user_data['data'][0].get('photos', [])
        updated_photos = current_photos + photo_urls
        
        updated_photos = updated_photos[:6]
        
        result = SupabaseService.update_data('users', 
                                           {'photos': updated_photos, 'updated_at': 'now()'}, 
                                           {'id': user_id})
        
        if result['success']:
            return jsonify({
                "success": True,
                "photos": updated_photos,
                "message": "Photos added successfully"
            })
        else:
            return jsonify({"error": "Failed to add photos"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@profile_bp.route('/photos/<photo_index>', methods=['DELETE'])
@jwt_required()
def delete_profile_photo(photo_index):
    try:
        user_id = get_jwt_identity()
        photo_idx = int(photo_index)
        
        user_data = SupabaseService.get_data('users', {'id': user_id})
        if not user_data['success']:
            return jsonify({"error": "User not found"}), 404
        
        current_photos = user_data['data'][0].get('photos', [])
        
        if photo_idx < 0 or photo_idx >= len(current_photos):
            return jsonify({"error": "Invalid photo index"}), 400
        
        updated_photos = current_photos[:photo_idx] + current_photos[photo_idx+1:]
        
        result = SupabaseService.update_data('users', 
                                           {'photos': updated_photos, 'updated_at': 'now()'}, 
                                           {'id': user_id})
        
        if result['success']:
            return jsonify({
                "success": True,
                "photos": updated_photos,
                "message": "Photo deleted successfully"
            })
        else:
            return jsonify({"error": "Failed to delete photo"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500