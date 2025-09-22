from flask import Blueprint, request, jsonify, redirect
from flask_jwt_extended import create_access_token
from services.supabase_client import SupabaseService
from services.google_auth import GoogleAuthService
from config import Config
import uuid
import hashlib
import requests

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing field: {field}'}), 400
        
        existing_result = SupabaseService.get_data('users', {'email': data['email']})
        if not existing_result['success']:
            return jsonify({'success': False, 'error': 'Database error'}), 500
        
        if existing_result['data']:
            return jsonify({'success': False, 'error': 'User with this email already exists'}), 400
        
        user_id = str(uuid.uuid4())
        user_data = {
            'id': user_id,
            'name': data['name'],
            'email': data['email'],
        }
        
        result = SupabaseService.insert_data('users', user_data)

        if not result['success']:
            return jsonify({'success': False, 'error': 'Failed to create user'}), 500
        
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
    try:
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password required'}), 400
        
        user_result = SupabaseService.get_data('users', {'email': email})

        if not user_result['success']:
            return jsonify({'success': False, 'error': 'Database error'}), 500
        
        if not user_result['data']:
            return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
        
        user = user_result['data'][0]
        
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
    try:
        redirect_uri = request.args.get('redirect_uri', 'http://localhost:3000/auth/callback')
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
    try:
        data = request.get_json()
        code = data.get('code')
        redirect_uri = data.get('redirect_uri', 'http://localhost:3000/auth/callback')
        
        if not code:
            return jsonify({'success': False, 'error': 'Authorization code required'}), 400
        
        token_result = GoogleAuthService.exchange_code_for_token(code, redirect_uri)
        
        if not token_result['success']:
            return jsonify({'success': False, 'error': token_result['error']}), 400
        
        access_token = token_result['access_token']
        
        user_info_result = GoogleAuthService.get_user_info_from_access_token(access_token)
        
        if not user_info_result['success']:
            return jsonify({'success': False, 'error': user_info_result['error']}), 400
        
        user_info = user_info_result['user_info']
        
        existing_result = SupabaseService.get_data('users', {'email': user_info['email']})
        
        if existing_result['success'] and existing_result['data']:
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
            user_id = str(uuid.uuid4())
            user_data = {
                'id': user_id,
                'name': user_info['name'],
                'email': user_info['email'],
                'age': 25,
                'city': 'San Francisco, CA',
                'budget_min': 1000,
                'budget_max': 3000,
                'interests': ['Technology', 'Music', 'Travel'],
                'bio': f"Hi! I'm {user_info['name']}",
                'photos': [user_info['picture']] if user_info.get('picture') else []
            }
            
            result = SupabaseService.insert_data('users', user_data)
            if not result['success']:
                print(f"User creation failed: {result['error']}")
                print(f"User data: {user_data}")
                return jsonify({'success': False, 'error': f"Failed to create user: {result['error']}"}), 500
            
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