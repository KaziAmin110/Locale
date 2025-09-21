#!/usr/bin/env python3
"""
Comprehensive Mock Data Insertion Script for Supabase
Populates all tables with realistic mock data and simulates ML recommendations
"""

import os
import sys
import uuid
import random
from services.photo_service import PhotoService
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data.mock_data import MOCK_APARTMENTS, MOCK_PEOPLE, MOCK_SPOTS
from services.supabase_client import SupabaseService

def generate_mock_users():
    """Generate realistic mock users with complete profiles"""
    users = []
    names = ['Alex Johnson', 'Jordan Smith', 'Casey Brown', 'Morgan Davis', 'Riley Wilson', 
             'Taylor Miller', 'Sam Garcia', 'Jamie Rodriguez', 'Blake Martinez', 'Quinn Anderson']
    
    cities = {
        'Austin': (30.2672, -97.7431),
        'San Francisco': (37.7749, -122.4194),
        'New York': (40.7128, -74.0060),
        'Seattle': (47.6062, -122.3321)
    }
    
    interests_pool = ['coffee', 'hiking', 'tech', 'food', 'music', 'sports', 'art', 'books', 'travel', 'fitness', 'nightlife', 'shopping']
    
    for i in range(20):  # Generate 20 users
        city_name, (base_lat, base_lng) = list(cities.items())[i % len(cities)]
        
        # Generate realistic user data
        age = random.randint(22, 35)
        budget_min = random.randint(800, 1500)
        budget_max = budget_min + random.randint(500, 1500)
        
        user_interests = random.sample(interests_pool, random.randint(3, 6))
        
        user = {
            'id': str(uuid.uuid4()),
            'email': f'user{i+1}@example.com',
            'name': names[i % len(names)],
            'age': age,
            'bio': f'Hey! I\'m new to {city_name} and looking for cool people to hang out with. Love {", ".join(user_interests[:3])}!',
            'city': city_name,
            'lat': base_lat + random.uniform(-0.01, 0.01),
            'lng': base_lng + random.uniform(-0.01, 0.01),
            'budget_min': budget_min,
            'budget_max': budget_max,
            'interests': user_interests,
            'photos': PhotoService.get_random_photos("people", 2),
            'onboarding_complete': True,
            'created_at': (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        users.append(user)
    
    return users

def generate_mock_swipes_and_matches():
    """Generate realistic swipe patterns and matches"""
    # Get all users, apartments, people, and spots
    users_data = SupabaseService.get_data('users', {})
    apartments_data = SupabaseService.get_data('apartments', {})
    people_data = SupabaseService.get_data('people', {})
    spots_data = SupabaseService.get_data('spots', {})
    
    if not all([users_data['success'], apartments_data['success'], people_data['success'], spots_data['success']]):
        print(" Failed to fetch data for swipe generation")
        return False
    
    users = users_data['data']
    apartments = apartments_data['data']
    people = people_data['data']
    spots = spots_data['data']
    
    print(f"📊 Generating swipes for {len(users)} users...")
    
    # Generate apartment swipes
    apartment_swipes = []
    apartment_matches = []
    
    for user in users:
        user_city = user.get('city', '')
        user_apartments = [apt for apt in apartments if user_city.lower() in apt['address'].lower()]
        
        # Each user swipes on 10-20 apartments
        num_swipes = random.randint(10, min(20, len(user_apartments)))
        swiped_apartments = random.sample(user_apartments, num_swipes)
        
        for apt in swiped_apartments:
            is_like = random.random() < 0.3  # 30% like rate
            
            swipe = {
                'id': str(uuid.uuid4()),
                'user_id': user['id'],
                'apartment_id': apt['id'],
                'is_like': is_like,
                'created_at': (datetime.now() - timedelta(days=random.randint(1, 7))).isoformat()
            }
            apartment_swipes.append(swipe)
            
            if is_like:
                match = {
                    'id': str(uuid.uuid4()),
                    'user_id': user['id'],
                    'apartment_id': apt['id'],
                    'created_at': swipe['created_at']
                }
                apartment_matches.append(match)
    
    # Generate people swipes
    people_swipes = []
    people_matches = []
    
    for user in users:
        # Each user swipes on 15-30 people
        num_swipes = random.randint(15, min(30, len(people)))
        swiped_people = random.sample(people, num_swipes)
        
        for person in swiped_people:
            is_like = random.random() < 0.25  # 25% like rate
            
            swipe = {
                'id': str(uuid.uuid4()),
                'swiper_id': user['id'],
                'swiped_id': person['id'],
                'is_like': is_like,
                'created_at': (datetime.now() - timedelta(days=random.randint(1, 7))).isoformat()
            }
            people_swipes.append(swipe)
            
            if is_like:
                match = {
                    'id': str(uuid.uuid4()),
                    'user1_id': user['id'],
                    'user2_id': person['id'],
                    'created_at': swipe['created_at']
                }
                people_matches.append(match)
    
    # Generate spot swipes
    spot_swipes = []
    spot_matches = []
    
    for user in users:
        user_city = user.get('city', '')
        user_spots = [spot for spot in spots if user_city.lower() in spot['address'].lower()]
        
        # Each user swipes on 20-40 spots
        num_swipes = random.randint(20, min(40, len(user_spots)))
        swiped_spots = random.sample(user_spots, num_swipes)
        
        for spot in swiped_spots:
            is_like = random.random() < 0.4  # 40% like rate for spots
            
            swipe = {
                'id': str(uuid.uuid4()),
                'user_id': user['id'],
                'spot_id': spot['id'],
                'is_like': is_like,
                'created_at': (datetime.now() - timedelta(days=random.randint(1, 7))).isoformat()
            }
            spot_swipes.append(swipe)
            
            if is_like:
                match = {
                    'id': str(uuid.uuid4()),
                    'user_id': user['id'],
                    'spot_id': spot['id'],
                    'created_at': swipe['created_at']
                }
                spot_matches.append(match)
    
    # Insert all swipes and matches
    print("💾 Inserting apartment swipes and matches...")
    insert_batch_data('apartment_swipes', apartment_swipes)
    insert_batch_data('apartment_matches', apartment_matches)
    
    print("💾 Inserting people swipes and matches...")
    insert_batch_data('people_swipes', people_swipes)
    insert_batch_data('people_matches', people_matches)
    
    print("💾 Inserting spot swipes and matches...")
    insert_batch_data('spot_swipes', spot_swipes)
    insert_batch_data('spot_matches', spot_matches)
    
    return True

def generate_mock_conversations():
    """Generate realistic conversations between users and matched people"""
    # Get people matches
    matches_data = SupabaseService.get_data('people_matches', {})
    if not matches_data['success']:
        print(" Failed to fetch people matches")
        return False
    
    matches = matches_data['data']
    conversations = []
    messages = []
    
    print(f" Generating conversations for {len(matches)} matches...")
    
    for match in matches:
        # Create conversation
        conversation = {
            'id': str(uuid.uuid4()),
            'user1_id': match['user1_id'],
            'user2_id': match['user2_id'],
            'created_at': match['created_at'],
            'updated_at': (datetime.now() - timedelta(days=random.randint(1, 3))).isoformat()
        }
        conversations.append(conversation)
        
        # Generate 2-8 messages per conversation
        num_messages = random.randint(2, 8)
        message_templates = [
            "Hey! How's it going?",
            "Nice to meet you! What brings you to the city?",
            "I love your profile! Want to grab coffee sometime?",
            "That's awesome! I'm into that too",
            "Definitely! When are you free?",
            "Sounds great! How about this weekend?",
            "Perfect! I'll send you the details",
            "Looking forward to it! "
        ]
        
        for i in range(num_messages):
            sender_id = match['user1_id'] if i % 2 == 0 else match['user2_id']
            message = {
                'id': str(uuid.uuid4()),
                'conversation_id': conversation['id'],
                'sender_id': sender_id,
                'content': message_templates[i % len(message_templates)],
                'created_at': (datetime.fromisoformat(conversation['created_at'].replace('Z', '+00:00')) + 
                              timedelta(minutes=i*30)).isoformat()
            }
            messages.append(message)
    
    # Insert conversations and messages
    print("💾 Inserting conversations...")
    insert_batch_data('conversations', conversations)
    
    print("💾 Inserting messages...")
    insert_batch_data('messages', messages)
    
    return True

def insert_batch_data(table, data, batch_size=50):
    """Insert data in batches to avoid timeout"""
    total_inserted = 0
    
    for i in range(0, len(data), batch_size):
        batch = data[i:i + batch_size]
        result = SupabaseService.insert_data(table, batch)
        
        if result['success']:
            total_inserted += len(batch)
        else:
            print(f"   Failed to insert batch {i//batch_size + 1}: {result['error']}")
            return False
    
    print(f"   Inserted {total_inserted} records into {table}")
    return True

def insert_core_data():
    """Insert core data (apartments, people, spots, users)"""
    print("🏠 Inserting apartments...")
    if not insert_batch_data('apartments', MOCK_APARTMENTS):
        return False
    
    print("👥 Inserting people...")
    if not insert_batch_data('people', MOCK_PEOPLE):
        return False
    
    print(" Inserting spots...")
    if not insert_batch_data('spots', MOCK_SPOTS):
        return False
    
    print("👤 Inserting users...")
    users = generate_mock_users()
    if not insert_batch_data('users', users):
        return False
    
    return True

def check_existing_data():
    """Check existing data counts"""
    tables = ['users', 'apartments', 'people', 'spots', 'apartment_swipes', 'people_swipes', 'spot_swipes']
    existing_data = {}
    
    for table in tables:
        result = SupabaseService.get_data(table, {})
        if result['success']:
            count = len(result['data'])
            existing_data[table] = count
            print(f"   {table}: {count} records")
        else:
            existing_data[table] = 0
    
    return existing_data

def main():
    """Main function to populate database with comprehensive mock data"""
    print(" Starting comprehensive mock data insertion...")
    print("=" * 60)
    
    # Load environment variables
    load_dotenv()
    
    # Check environment variables
    required_vars = ['SUPABASE_URL', 'SUPABASE_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f" Missing environment variables: {', '.join(missing_vars)}")
        print("Please create a .env file with your Supabase credentials")
        return False
    
    # Test connection
    print(" Testing Supabase connection...")
    result = SupabaseService.get_data('users', {})
    if not result['success']:
        print(f" Supabase connection failed: {result['error']}")
        return False
    print(" Supabase connection successful")
    
    # Check existing data
    print("\n Checking existing data...")
    existing_data = check_existing_data()
    
    # Ask user if they want to proceed
    if any(count > 0 for count in existing_data.values()):
        print("\n  Some tables already contain data.")
        response = input("Do you want to continue? This will add more data (y/N): ").strip().lower()
        if response != 'y':
            print(" Operation cancelled")
            return False
    
    # Insert core data
    print("\n Inserting core data...")
    if not insert_core_data():
        print(" Failed to insert core data")
        return False
    
    # Generate and insert interaction data
    print("\n🔄 Generating interaction data...")
    if not generate_mock_swipes_and_matches():
        print(" Failed to generate interaction data")
        return False
    
    # Generate conversations
    print("\n Generating conversations...")
    if not generate_mock_conversations():
        print(" Failed to generate conversations")
        return False
    
    # Final summary
    print("\n" + "=" * 60)
    print(" Comprehensive mock data insertion completed!")
    print("\n Data Summary:")
    print(f"   Users: 20 realistic profiles")
    print(f"   Apartments: {len(MOCK_APARTMENTS)} listings")
    print(f"   People: {len(MOCK_PEOPLE)} profiles")
    print(f"   Spots: {len(MOCK_SPOTS)} local venues")
    print("  Swipes: Realistic interaction patterns")
    print("   Conversations: Sample chat data")
    print("\n Your database is now ready for ML recommendations!")
    print("\n Next steps:")
    print("  1. Test the API endpoints")
    print("  2. Verify ML recommendations are working")
    print("  3. Ready for frontend integration!")
    
    return True

if __name__ == "__main__":
    main()
