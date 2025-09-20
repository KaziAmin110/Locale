from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
import uuid

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    """Get user's conversations"""
    try:
        user_id = get_jwt_identity()
        
        # Get conversations where user is participant
        conversations1 = SupabaseService.get_data('conversations', {'user1_id': user_id})
        conversations2 = SupabaseService.get_data('conversations', {'user2_id': user_id})
        
        all_conversations = []
        if conversations1['success']:
            all_conversations.extend(conversations1['data'])
        if conversations2['success']:
            all_conversations.extend(conversations2['data'])
        
        # Get other participant details for each conversation
        conversation_list = []
        for conv in all_conversations:
            other_user_id = conv['user2_id'] if conv['user1_id'] == user_id else conv['user1_id']
            other_user = next((p for p in MOCK_PEOPLE if p['id'] == other_user_id), None)
            
            if other_user:
                # Get last message (simplified - would use actual query in production)
                last_message = "Start your conversation!"  # Default
                
                conversation_data = {
                    'conversation_id': conv['id'],
                    'other_user': {
                        'id': other_user['id'],
                        'name': other_user['name'],
                        'photos': other_user['photos'],
                        'age': other_user['age']
                    },
                    'last_message': last_message,
                    'last_message_at': conv['last_message_at'],
                    'created_at': conv['created_at']
                }
                conversation_list.append(conversation_data)
        
        # Sort by last message time
        conversation_list.sort(key=lambda x: x['last_message_at'], reverse=True)
        
        return jsonify({
            "success": True,
            "conversations": conversation_list
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/<conversation_id>', methods=['GET'])
@jwt_required()
def get_messages(conversation_id):
    """Get messages in a conversation"""
    try:
        user_id = get_jwt_identity()
        
        # Verify user is part of this conversation
        conv_data = SupabaseService.get_data('conversations', {'id': conversation_id})
        if not conv_data['success'] or not conv_data['data']:
            return jsonify({"error": "Conversation not found"}), 404
        
        conversation = conv_data['data'][0]
        if user_id not in [conversation['user1_id'], conversation['user2_id']]:
            return jsonify({"error": "Unauthorized"}), 403
        
        # Get messages
        messages_data = SupabaseService.get_data('messages', {'conversation_id': conversation_id})
        messages = []
        if messages_data['success']:
            messages = messages_data['data']
            # Sort by sent_at
            messages.sort(key=lambda x: x['sent_at'])
        
        return jsonify({
            "success": True,
            "messages": messages,
            "conversation": conversation
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/<conversation_id>', methods=['POST'])
@jwt_required()
def send_message(conversation_id):
    """Send a message in a conversation"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        content = data.get('content', '').strip()
        
        if not content:
            return jsonify({"error": "Message content required"}), 400
        
        # Verify user is part of this conversation
        conv_data = SupabaseService.get_data('conversations', {'id': conversation_id})
        if not conv_data['success'] or not conv_data['data']:
            return jsonify({"error": "Conversation not found"}), 404
        
        conversation = conv_data['data'][0]
        if user_id not in [conversation['user1_id'], conversation['user2_id']]:
            return jsonify({"error": "Unauthorized"}), 403
        
        # Create message
        message_data = {
            'id': str(uuid.uuid4()),
            'conversation_id': conversation_id,
            'sender_id': user_id,
            'content': content,
            'sent_at': 'now()'
        }
        
        result = SupabaseService.insert_data('messages', message_data)
        
        if result['success']:
            # Update conversation last_message_at
            SupabaseService.update_data('conversations', 
                                      {'last_message_at': 'now()'}, 
                                      {'id': conversation_id})
            
            return jsonify({
                "success": True,
                "message": message_data
            })
        else:
            return jsonify({"error": "Failed to send message"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/start', methods=['POST'])
@jwt_required()
def start_conversation():
    """Start a new conversation"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        other_user_id = data.get('user_id')
        
        if not other_user_id:
            return jsonify({"error": "Other user ID required"}), 400
        
        # Check if conversation already exists
        existing_conv1 = SupabaseService.get_data('conversations', {
            'user1_id': user_id,
            'user2_id': other_user_id
        })
        existing_conv2 = SupabaseService.get_data('conversations', {
            'user1_id': other_user_id,
            'user2_id': user_id
        })
        
        if (existing_conv1['success'] and existing_conv1['data']) or \
           (existing_conv2['success'] and existing_conv2['data']):
            existing_conv = existing_conv1['data'][0] if existing_conv1['data'] else existing_conv2['data'][0]
            return jsonify({
                "success": True,
                "conversation_id": existing_conv['id'],
                "message": "Conversation already exists"
            })
        
        # Create new conversation
        conversation_data = {
            'id': str(uuid.uuid4()),
            'user1_id': user_id,
            'user2_id': other_user_id,
            'created_at': 'now()',
            'last_message_at': 'now()'
        }
        
        result = SupabaseService.insert_data('conversations', conversation_data)
        
        if result['success']:
            return jsonify({
                "success": True,
                "conversation_id": conversation_data['id'],
                "message": "Conversation started"
            })
        else:
            return jsonify({"error": "Failed to start conversation"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500