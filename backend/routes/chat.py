from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
import uuid

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    try:
        user_id = get_jwt_identity()
        
        conversations1 = SupabaseService.get_data('conversations', {'user1_id': user_id})
        conversations2 = SupabaseService.get_data('conversations', {'user2_id': user_id})
        
        all_conversations = []
        if conversations1['success']:
            all_conversations.extend(conversations1['data'])
        if conversations2['success']:
            all_conversations.extend(conversations2['data'])
        
        conversation_list = []
        for conv in all_conversations:
            other_user_id = conv['user2_id'] if conv['user1_id'] == user_id else conv['user1_id']
            
            other_user_data = SupabaseService.get_data('users', {'id': other_user_id})
            other_user = None
            
            if other_user_data['success'] and other_user_data['data']:
                other_user = other_user_data['data'][0]
            else:
                from data.mock_data import MOCK_PEOPLE
                other_user = next((p for p in MOCK_PEOPLE if p['id'] == other_user_id), None)
            
            if not other_user:
                if other_user_id.startswith('landlord-'):
                    other_user = {
                        'id': other_user_id,
                        'name': 'Property Manager',
                        'photos': ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'],
                        'age': 35
                    }
                else:
                    other_user = {
                        'id': other_user_id,
                        'name': 'Unknown User',
                        'photos': [],
                        'age': 25
                    }
            
            last_message = "Start your conversation!"
            
            conversation_data = {
                'conversation_id': conv['id'],
                'other_user': {
                    'id': other_user['id'],
                    'name': other_user['name'],
                    'image': other_user.get('photos', [''])[0] if other_user.get('photos') else '',
                    'age': other_user.get('age', 25)
                },
                'last_message': last_message,
                'last_message_at': conv.get('last_message_at', conv['created_at']),
                'created_at': conv['created_at']
            }
            conversation_list.append(conversation_data)
        
        conversation_list.sort(key=lambda x: x['last_message_at'] or x['created_at'], reverse=True)
        
        return jsonify({
            "success": True,
            "conversations": conversation_list
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/<conversation_id>', methods=['GET'])
@jwt_required()
def get_messages(conversation_id):
    try:
        user_id = get_jwt_identity()
        
        conv_data = SupabaseService.get_data('conversations', {'id': conversation_id})
        if not conv_data['success'] or not conv_data['data']:
            return jsonify({"error": "Conversation not found"}), 404
        
        conversation = conv_data['data'][0]
        if user_id not in [conversation['user1_id'], conversation['user2_id']]:
            return jsonify({"error": "Unauthorized"}), 403
        
        messages_data = SupabaseService.get_data('messages', {'conversation_id': conversation_id})
        messages = []
        if messages_data['success']:
            messages = messages_data['data']
            messages.sort(key=lambda x: x['sent_at'])
        
        other_user_id = conversation['user2_id'] if conversation['user1_id'] == user_id else conversation['user1_id']
        
        other_user_data = SupabaseService.get_data('users', {'id': other_user_id})
        other_user = None
        
        if other_user_data['success'] and other_user_data['data']:
            other_user = other_user_data['data'][0]
            print(f"Found user in database: {other_user.get('name', 'No name')}")
        else:
            from data.mock_data import MOCK_PEOPLE
            other_user = next((p for p in MOCK_PEOPLE if p['id'] == other_user_id), None)
            if other_user:
                print(f"Found user in mock data: {other_user.get('name', 'No name')}")
        
        if not other_user:
            if other_user_id.startswith('landlord-'):
                other_user = {
                    'id': other_user_id,
                    'name': 'Property Manager',
                    'photos': ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'],
                    'age': 35
                }
            else:
                other_user = {
                    'id': other_user_id,
                    'name': 'Unknown User',
                    'photos': [],
                    'age': 25
                }
            print(f"Using fallback user: {other_user['name']}")
        
        conversation_data = {
            'conversation_id': conversation['id'],
            'other_user': {
                'id': other_user['id'],
                'name': other_user['name'],
                'image': other_user.get('photos', [''])[0] if other_user.get('photos') else '',
                'age': other_user.get('age', 25)
            },
            'last_message': "Start your conversation!",
            'last_message_at': conversation.get('last_message_at', conversation['created_at']),
            'created_at': conversation['created_at'],
            'messages': messages
        }
        
        return jsonify({
            "success": True,
            "messages": messages,
            "conversation": conversation_data
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/<conversation_id>', methods=['POST'])
@jwt_required()
def send_message(conversation_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        content = data.get('content', '').strip()
        
        if not content:
            return jsonify({"error": "Message content required"}), 400
        
        conv_data = SupabaseService.get_data('conversations', {'id': conversation_id})
        if not conv_data['success'] or not conv_data['data']:
            return jsonify({"error": "Conversation not found"}), 404
        
        conversation = conv_data['data'][0]
        if user_id not in [conversation['user1_id'], conversation['user2_id']]:
            return jsonify({"error": "Unauthorized"}), 403
        
        message_data = {
            'id': str(uuid.uuid4()),
            'conversation_id': conversation_id,
            'sender_id': user_id,
            'content': content,
            'sent_at': 'now()'
        }
        
        result = SupabaseService.insert_data('messages', message_data)
        
        if result['success']:
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
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        other_user_id = data.get('user_id')
        match_type = data.get('match_type', 'person')
        
        if not other_user_id:
            return jsonify({"error": "Other user ID required"}), 400
        
        if match_type == 'apartment':
            import hashlib
            landlord_hash = hashlib.md5(f"landlord-{other_user_id}".encode()).hexdigest()
            landlord_id = f"{landlord_hash[:8]}-{landlord_hash[8:12]}-{landlord_hash[12:16]}-{landlord_hash[16:20]}-{landlord_hash[20:32]}"
            
            landlord_data = SupabaseService.get_data('users', {'id': landlord_id})
            if not landlord_data['success'] or not landlord_data['data']:
                landlord_user = {
                    'id': landlord_id,
                    'name': 'Property Manager',
                    'email': f'landlord-{other_user_id}@locale.com',
                    'photos': ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'],
                    'age': 35,
                    'created_at': 'now()'
                }
                SupabaseService.insert_data('users', landlord_user)
            
            other_user_id = landlord_id
        
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
            print(f"Supabase insert error: {result.get('error')}")
            return jsonify({"error": f"Failed to start conversation: {result.get('error')}"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500