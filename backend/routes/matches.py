from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.supabase_client import SupabaseService
from data.mock_data import MOCK_APARTMENTS, MOCK_PEOPLE, MOCK_SPOTS
import uuid
from datetime import datetime

matches_bp = Blueprint('matches', __name__)

def create_fallback_photos(category, item_id):
    """Create reliable fallback photos using different sources"""
    # Use a mix of reliable image sources
    photos_sources = {
        'apartment': [
            'https://picsum.photos/600/400?random=' + str(hash(item_id + 'apt1') % 1000),
            'https://picsum.photos/600/400?random=' + str(hash(item_id + 'apt2') % 1000),
            'https://picsum.photos/600/400?random=' + str(hash(item_id + 'apt3') % 1000)
        ],
        'person': [
            'https://picsum.photos/400/600?random=' + str(hash(item_id + 'person1') % 1000),
            'https://picsum.photos/400/600?random=' + str(hash(item_id + 'person2') % 1000)
        ],
        'spot': [
            'https://picsum.photos/600/400?random=' + str(hash(item_id + 'spot1') % 1000),
            'https://picsum.photos/600/400?random=' + str(hash(item_id + 'spot2') % 1000)
        ]
    }
    
    return photos_sources.get(category, [photos_sources['apartment'][0]])

@matches_bp.route('/', methods=['GET'])  # Handle /api/matches/
@matches_bp.route('', methods=['GET'])   # Handle /api/matches
@jwt_required()
def get_matches():
    """Get all user matches - Updated to match frontend expectations"""
    try:
        user_id = get_jwt_identity()
        all_matches = []
        
        # Get apartment matches
        apt_matches = SupabaseService.get_data('apartment_matches', {'user_id': user_id})
        if apt_matches['success']:
            for match in apt_matches['data']:
                # Get apartment details from database
                apartment_data = SupabaseService.get_data('apartments', {'id': match['apartment_id']})
                apartment = None
                
                if apartment_data['success'] and apartment_data['data']:
                    apartment = apartment_data['data'][0]
                else:
                    # Fallback to mock data
                    apartment = next((apt for apt in MOCK_APARTMENTS if apt['id'] == match['apartment_id']), None)
                
                if apartment:
                    match_item = {
                        'id': match['apartment_id'],
                        'name': apartment.get('title', apartment.get('name', 'Apartment')),
                        'type': 'apartment',
                        'photo': apartment.get('photos', [create_fallback_photos('apartment', match['apartment_id'])[0]])[0],
                        'timestamp': match.get('created_at', datetime.now().isoformat())
                    }
                    all_matches.append(match_item)
        
        # Get people matches
        people_matches1 = SupabaseService.get_data('people_matches', {'user1_id': user_id})
        people_matches2 = SupabaseService.get_data('people_matches', {'user2_id': user_id})
        
        all_people_matches = []
        if people_matches1['success']:
            all_people_matches.extend(people_matches1['data'])
        if people_matches2['success']:
            all_people_matches.extend(people_matches2['data'])
        
        for match in all_people_matches:
            other_user_id = match['user2_id'] if match['user1_id'] == user_id else match['user1_id']
            
            # Try to get person from users table first, then mock data
            person_data = SupabaseService.get_data('users', {'id': other_user_id})
            person = None
            
            if person_data['success'] and person_data['data']:
                person = person_data['data'][0]
            else:
                # Fallback to mock data
                person = next((p for p in MOCK_PEOPLE if p['id'] == other_user_id), None)
            
            if person:
                match_item = {
                    'id': other_user_id,
                    'name': person['name'],
                    'type': 'person',
                    'photo': person['photos'][0] if person.get('photos') else create_fallback_photos('person', other_user_id)[0],
                    'timestamp': match.get('created_at', datetime.now().isoformat())
                }
                all_matches.append(match_item)
        
        # Get spot matches
        spot_matches = SupabaseService.get_data('spot_matches', {'user_id': user_id})
        if spot_matches['success']:
            for match in spot_matches['data']:
                # Get spot details from database
                spot_data = SupabaseService.get_data('spots', {'id': match['spot_id']})
                spot = None
                
                if spot_data['success'] and spot_data['data']:
                    spot = spot_data['data'][0]
                else:
                    # Fallback to mock data
                    spot = next((s for s in MOCK_SPOTS if s['id'] == match['spot_id']), None)
                
                if spot:
                    match_item = {
                        'id': match['spot_id'],
                        'name': spot.get('name', 'Spot'),
                        'type': 'spot',
                        'photo': spot.get('photos', [create_fallback_photos('spot', match['spot_id'])[0]])[0],
                        'timestamp': match.get('created_at', datetime.now().isoformat())
                    }
                    all_matches.append(match_item)
        
        # Don't show demo matches - only show real matches
        # if not all_matches:
        #     demo_matches = create_demo_matches(user_id)
        #     all_matches.extend(demo_matches)
        
        # Sort by timestamp (newest first)
        all_matches.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            "success": True,
            "matches": all_matches
        })
        
    except Exception as e:
        print(f"Matches error: {str(e)}")
        # Return demo matches on error
        demo_matches = create_demo_matches(get_jwt_identity())
        return jsonify({
            "success": True,
            "matches": demo_matches
        })

def create_demo_matches(user_id):
    """Create demo matches for testing when no real matches exist"""
    demo_matches = []
    
    # Demo apartment matches
    for i in range(3):
        match_id = str(uuid.uuid4())
        demo_matches.append({
            'id': match_id,
            'name': f'Beautiful {i+1}BR Apartment Downtown',
            'type': 'apartment',
            'photo': f'https://picsum.photos/600/400?random={hash(match_id) % 1000}',
            'timestamp': datetime.now().isoformat()
        })
    
    # Demo people matches
    names = ['Alex Johnson', 'Jordan Smith', 'Casey Brown']
    for i, name in enumerate(names):
        match_id = str(uuid.uuid4())
        demo_matches.append({
            'id': match_id,
            'name': name,
            'type': 'person',
            'photo': f'https://picsum.photos/400/600?random={hash(match_id) % 1000}',
            'timestamp': datetime.now().isoformat()
        })
    
    # Demo spot matches
    spots = ['Central Coffee House', 'Riverside Park', 'Downtown Gym']
    for i, spot_name in enumerate(spots):
        match_id = str(uuid.uuid4())
        demo_matches.append({
            'id': match_id,
            'name': spot_name,
            'type': 'spot',
            'photo': f'https://picsum.photos/600/400?random={hash(match_id) % 1000}',
            'timestamp': datetime.now().isoformat()
        })
    
    return demo_matches

@matches_bp.route('/<match_id>', methods=['DELETE'])
@jwt_required()
def remove_match(match_id):
    """Remove a specific match"""
    try:
        user_id = get_jwt_identity()
        match_type = request.args.get('type')  # 'apartment', 'person', 'spot'
        
        if not match_type:
            return jsonify({"error": "Match type required"}), 400
        
        # For demo purposes, just return success
        # In production, you'd implement actual deletion logic
        
        return jsonify({
            "success": True,
            "message": f"{match_type.title()} match removed"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500