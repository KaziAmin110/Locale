from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from services.supabase_client import SupabaseService
import uuid
import hashlib

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