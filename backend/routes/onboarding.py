from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService

onboarding_bp = Blueprint('onboarding', __name__)

@onboarding_bp.route('/basic-info', methods=['POST'])
@jwt_required()
def save_basic_info():
    """Save user's basic information"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        update_data = {
            'name': data.get('name'),
            'age': data.get('age'),
            'bio': data.get('bio', ''),
            'updated_at': 'now()'
        }
        
        result = SupabaseService.update_data('users', update_data, {'id': user_id})
        
        if result['success']:
            return jsonify({"success": True, "message": "Basic info saved"})
        else:
            return jsonify({"error": "Failed to save basic info"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@onboarding_bp.route('/location', methods=['POST'])
@jwt_required()
def save_location():
    """Save user's location information"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        update_data = {
            'city': data.get('city'),
            'lat': data.get('latitude'),
            'lng': data.get('longitude'),
            'updated_at': 'now()'
        }
        
        result = SupabaseService.update_data('users', update_data, {'id': user_id})
        
        if result['success']:
            return jsonify({"success": True, "message": "Location saved"})
        else:
            return jsonify({"error": "Failed to save location"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@onboarding_bp.route('/interests', methods=['POST'])
@jwt_required()
def save_interests():
    """Save user's interests"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        update_data = {
            'interests': data.get('interests', []),
            'updated_at': 'now()'
        }
        
        result = SupabaseService.update_data('users', update_data, {'id': user_id})
        
        if result['success']:
            return jsonify({"success": True, "message": "Interests saved"})
        else:
            return jsonify({"error": "Failed to save interests"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@onboarding_bp.route('/preferences', methods=['POST'])
@jwt_required()
def save_preferences():
    """Save user's preferences (budget, demographics)"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        update_data = {
            'budget_min': data.get('budget_min'),
            'budget_max': data.get('budget_max'),
            'updated_at': 'now()'
        }
        
        result = SupabaseService.update_data('users', update_data, {'id': user_id})
        
        if result['success']:
            return jsonify({"success": True, "message": "Preferences saved"})
        else:
            return jsonify({"error": "Failed to save preferences"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@onboarding_bp.route('/complete', methods=['PUT'])
@jwt_required()
def complete_onboarding():
    """Mark onboarding as complete"""
    try:
        user_id = get_jwt_identity()
        
        update_data = {
            'onboarding_complete': True,
            'updated_at': 'now()'
        }
        
        result = SupabaseService.update_data('users', update_data, {'id': user_id})
        
        if result['success']:
            return jsonify({"success": True, "message": "Onboarding completed"})
        else:
            return jsonify({"error": "Failed to complete onboarding"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500