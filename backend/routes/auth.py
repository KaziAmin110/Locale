from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import uuid
from services.supabase_client import SupabaseService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    """Handle Google OAuth login"""
    try:
        data = request.get_json()
        google_token = data.get('token')
        user_info = data.get('user_info')  # From frontend Google auth
        
        if not user_info:
            return jsonify({"error": "User info required"}), 400
        
        # Check if user exists
        existing_user = SupabaseService.get_data('users', {'email': user_info['email']})
        
        if existing_user['success'] and existing_user['data']:
            # User exists, return token
            user = existing_user['data'][0]
            access_token = create_access_token(identity=user['id'])
            return jsonify({
                "success": True,
                "access_token": access_token,
                "user": user,
                "is_new_user": False
            })
        else:
            # Create new user
            new_user = {
                'id': str(uuid.uuid4()),
                'email': user_info['email'],
                'name': user_info['name'],
                'photos': [user_info.get('picture', '')],
                'age': None,
                'city': None,
                'lat': None,
                'lng': None,
                'budget_min': None,
                'budget_max': None,
                'interests': [],
                'created_at': 'now()',
                'updated_at': 'now()'
            }
            
            result = SupabaseService.insert_data('users', new_user)
            if result['success']:
                access_token = create_access_token(identity=new_user['id'])
                return jsonify({
                    "success": True,
                    "access_token": access_token,
                    "user": new_user,
                    "is_new_user": True
                })
            else:
                return jsonify({"error": "Failed to create user"}), 500
                
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user info"""
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

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client-side token removal)"""
    return jsonify({"success": True, "message": "Logged out successfully"})