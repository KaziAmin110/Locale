from flask import Blueprint, request, jsonify, redirect
from flask_jwt_extended import create_access_token
from services.supabase_client import SupabaseService
from services.google_auth import GoogleAuthService
import uuid
import hashlib
import requests

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'age', 'location', 'budget_min', 'budget_max', 'interests', 'looking_for']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400
        
        # Check if user already exists
        existing_result = SupabaseService.get_data('users', {'email': data['email']})
        if not existing_result['success']:
            return jsonify({'success': False, 'error': 'Database error'}), 500
        
        if existing_result['data']:
            return jsonify({'success': False, 'error': 'User with this email already exists'}), 400
        
        # Create user data for database
        user_id = str(uuid.uuid4())
        user_data = {
            'id': user_id,
            'name': data['name'],
            'email': data['email'],
            'age': data['age'],
            'city': data['location'],
            'budget_min': data['budget_min'],
            'budget_max': data['budget_max'],
            'interests': data['interests'],
            'bio': data.get('bio', ''),
            'onboarding_complete': True,
            'created_at': 'now()'
        }
        
        # Save user to database
        result = SupabaseService.insert_data('users', user_data)
        if not result['success']:
            return jsonify({'success': False, 'error': 'Failed to create user'}), 500
        
        # Create JWT token
        access_token = create_access_token(identity=user_id)
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'token': access_token,
            'user_id': user_id
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password required'}), 400
        
        # Find user in database
        user_result = SupabaseService.get_data('users', {'email': email})
        if not user_result['success']:
            return jsonify({'success': False, 'error': 'Database error'}), 500
        
        if not user_result['data']:
            return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
        
        user = user_result['data'][0]
        
        # For demo purposes, accept any password (in real app, verify password hash)
        # Create JWT token
        access_token = create_access_token(identity=user['id'])
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': access_token,
            'user_id': user['id']
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/test-db', methods=['GET'])
def test_db():
    """Test database connection"""
    try:
        result = SupabaseService.get_data('users', {})
        return jsonify({
            'success': True,
            'message': 'Database connection working',
            'result': result
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@auth_bp.route('/google-auth-url', methods=['GET'])
def get_google_auth_url():
    """Get Google OAuth URL"""
    try:
        redirect_uri = request.args.get('redirect_uri', 'http://localhost:3000/auth/google/callback')
        auth_url = GoogleAuthService.get_google_auth_url(redirect_uri)
        return jsonify({
            'success': True,
            'auth_url': auth_url
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@auth_bp.route('/google-callback', methods=['POST'])
def google_callback():
    """Handle Google OAuth callback"""
    try:
        data = request.get_json()
        code = data.get('code')
        redirect_uri = data.get('redirect_uri', 'http://localhost:3000/auth/google/callback')
        
        if not code:
            return jsonify({'success': False, 'error': 'Authorization code required'}), 400
        
        # Exchange code for tokens
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'client_id': '681585656744-i630vm4s4kpf36n4ml88j54vgpqapnu0.apps.googleusercontent.com',
            'client_secret': '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',
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': redirect_uri
        }
        
        token_response = requests.post(token_url, data=token_data)
        token_info = token_response.json()
        
        if 'access_token' not in token_info:
            return jsonify({'success': False, 'error': 'Failed to get access token'}), 400
        
        # Get user info
        user_info_result = GoogleAuthService.get_user_info_from_access_token(token_info['access_token'])
        
        if not user_info_result['success']:
            return jsonify({'success': False, 'error': user_info_result['error']}), 400
        
        user_info = user_info_result['user_info']
        
        # Check if user exists
        existing_result = SupabaseService.get_data('users', {'email': user_info['email']})
        
        if existing_result['success'] and existing_result['data']:
            # User exists, create JWT token
            user = existing_result['data'][0]
            access_token = create_access_token(identity=user['id'])
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'token': access_token,
                'user_id': user['id'],
                'user': user
            }), 200
        else:
            # Create new user
            user_id = str(uuid.uuid4())
            user_data = {
                'id': user_id,
                'name': user_info['name'],
                'email': user_info['email'],
                'age': 25,  # Default age
                'city': 'San Francisco, CA',  # Default location
                'budget_min': 1000,
                'budget_max': 3000,
                'interests': ['Technology', 'Music', 'Travel'],
                'bio': f"Hi! I'm {user_info['name']}",
                'onboarding_complete': False,  # Needs onboarding
                'google_id': user_info['google_id'],
                'profile_picture': user_info['picture'],
                'created_at': 'now()'
            }
            
            # Save user to database
            result = SupabaseService.insert_data('users', user_data)
            if not result['success']:
                return jsonify({'success': False, 'error': 'Failed to create user'}), 500
            
            # Create JWT token
            access_token = create_access_token(identity=user_id)
            
            return jsonify({
                'success': True,
                'message': 'User created successfully',
                'token': access_token,
                'user_id': user_id,
                'user': user_data,
                'needs_onboarding': True
            }), 200
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500