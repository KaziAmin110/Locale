from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService

onboarding_bp = Blueprint('onboarding', __name__)

@onboarding_bp.route('', methods=['POST'])
@jwt_required()
def save_onboarding_data():
    """Save all onboarding data at once"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'age', 'location', 'budgetMin', 'budgetMax', 'bedrooms', 'interests', 'lookingFor']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Validate interests array has at least 3 items
        if len(data.get('interests', [])) < 3:
            return jsonify({"error": "Please select at least 3 interests"}), 400
        
        # Prepare update data matching your database schema
        update_data = {
            'name': data.get('name'),
            'age': int(data.get('age')),
            'city': data.get('location'),  # Assuming 'city' field in DB
            'budget_min': int(data.get('budgetMin')),
            'budget_max': int(data.get('budgetMax')),
            'bedrooms': data.get('bedrooms'),
            'interests': data.get('interests'),
            'looking_for': data.get('lookingFor'),
            'onboarding_complete': True,
            'updated_at': 'now()'
        }
        
        # Update user record in database
        result = SupabaseService.update_data('users', update_data, {'id': user_id})

        print(result)
        
        if result['success']:
            return jsonify({
                "success": True, 
                "message": "Onboarding completed successfully",
                "data": update_data
            })
        else:
            return jsonify({"error": "Failed to save onboarding data"}), 500
    
    except ValueError as e:
        return jsonify({"error": "Invalid data format. Please check your input."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

