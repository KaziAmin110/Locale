from flask import Blueprint, request, jsonify, redirect, url_for, session
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import uuid
from datetime import datetime
from services.supabase_client import SupabaseService
from services.google_auth import GoogleAuthService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    """Handle Google OAuth login with ID token"""
    try:
        data = request.get_json()
        
        # Two possible flows:
        # 1. Frontend sends Google ID token
        # 2. Frontend sends user info directly (for development)
        
        if 'id_token' in data:
            # Production flow - verify Google ID token
            id_token = data.get('id_token')
            verification_result = GoogleAuthService.verify_google_token(id_token)
            
            if not verification_result['success']:
                return jsonify({"error": verification_result['error']}), 400
            
            user_info = verification_result['user_info']
            
        elif 'access_token' in data:
            # Alternative flow - use access token
            access_token = data.get('access_token')
            verification_result = GoogleAuthService.get_user_info_from_access_token(access_token)
            
            if not verification_result['success']:
                return jsonify({"error": verification_result['error']}), 400
            
            user_info = verification_result['user_info']
            
        elif 'user_info' in data:
            # Development flow - frontend sends user info directly
            user_info = data.get('user_info')
            
        else:
            return jsonify({"error": "No valid authentication data provided"}), 400
        
        # Check if user exists in our database
        existing_user = SupabaseService.get_data('users', {'email': user_info['email']})
        
        if existing_user['success'] and existing_user['data']:
            # Existing user - log them in
            user = existing_user['data'][0]
            
            # Update last login and any new info from Google
            update_data = {
                'name': user_info['name'],  # Update name in case it changed
                'updated_at': datetime.now().isoformat()
            }
            
            # Update photos if we have a new picture
            if user_info.get('picture'):
                current_photos = user.get('photos', [])
                if not current_photos or user_info['picture'] not in current_photos:
                    updated_photos = [user_info['picture']] + current_photos[:5]  # Keep max 6
                    update_data['photos'] = updated_photos
            
            SupabaseService.update_data('users', update_data, {'id': user['id']})
            
            # Create JWT token
            access_token = create_access_token(identity=user['id'])
            
            return jsonify({
                "success": True,
                "access_token": access_token,
                "user": {**user, **update_data},
                "is_new_user": False,
                "needs_onboarding": not user.get('city') or not user.get('interests')
            })
        
        else:
            # New user - create account
            new_user = {
                'id': str(uuid.uuid4()),
                'email': user_info['email'],
                'name': user_info['name'],
                'photos': [user_info['picture']] if user_info.get('picture') else [],
                'age': None,
                'bio': None,
                'city': None,
                'lat': None,
                'lng': None,
                'budget_min': None,
                'budget_max': None,
                'interests': [],
                'onboarding_complete': False,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            result = SupabaseService.insert_data('users', new_user)
            
            if result['success']:
                # Create JWT token
                access_token = create_access_token(identity=new_user['id'])
                
                return jsonify({
                    "success": True,
                    "access_token": access_token,
                    "user": new_user,
                    "is_new_user": True,
                    "needs_onboarding": True
                })
            else:
                return jsonify({"error": "Failed to create user account"}), 500
                
    except Exception as e:
        print(f"Auth error: {str(e)}")  # For debugging
        return jsonify({"error": f"Authentication failed: {str(e)}"}), 500

@auth_bp.route('/google/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback (for server-side flow if needed)"""
    # This is for server-side OAuth flow
    # For hackathon, we'll use client-side flow instead
    return jsonify({"message": "Use client-side Google OAuth flow"})

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    try:
        user_id = get_jwt_identity()
        user_data = SupabaseService.get_data('users', {'id': user_id})
        
        if user_data['success'] and user_data['data']:
            user = user_data['data'][0]
            return jsonify({
                "success": True,
                "user": user,
                "needs_onboarding": not user.get('city') or not user.get('interests')
            })
        else:
            return jsonify({"error": "User not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client handles token removal)"""
    return jsonify({
        "success": True, 
        "message": "Logged out successfully. Please remove token from client."
    })

@auth_bp.route('/validate-token', methods=['POST'])
@jwt_required()
def validate_token():
    """Validate if JWT token is still valid"""
    try:
        user_id = get_jwt_identity()
        return jsonify({
            "success": True,
            "valid": True,
            "user_id": user_id
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "valid": False,
            "error": str(e)
        }), 401