from services.supabase_client import SupabaseService
from data.mock_data import MOCK_APARTMENTS, MOCK_PEOPLE, MOCK_SPOTS
import uuid

def create_sample_user():
    """Create a sample user for testing"""
    sample_user = {
        'id': str(uuid.uuid4()),
        'email': 'rachel@example.com',
        'name': 'Rachel Martinez',
        'age': 26,
        'bio': 'Just moved to Austin! Love coffee and hiking.',
        'city': 'Austin',
        'lat': 30.2672,
        'lng': -97.7431,
        'budget_min': 1200,
        'budget_max': 2500,
        'interests': ['coffee', 'hiking', 'tech', 'food'],
        'photos': [
            'https://images.unsplash.com/photo-1494790108755-2616b5c0804?w=400',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
        ]
    }
    
    result = SupabaseService.insert_data('users', sample_user)
    if result['success']:
        print(f" Created sample user: {sample_user['name']}")
        return sample_user['id']
    else:
        print(f" Failed to create user: {result['error']}")
        return None

def populate_apartments():
    """Populate apartments table with mock data"""
    print("Populating apartments...")
    
    # Insert first 10 apartments for testing
    for i, apartment in enumerate(MOCK_APARTMENTS[:10]):
        result = SupabaseService.insert_data('apartments', apartment)
        if result['success']:
            print(f" Inserted apartment {i+1}: {apartment['title']}")
        else:
            print(f" Failed to insert apartment {i+1}: {result['error']}")

def populate_people():
    """Populate people table with mock data"""
    print("Populating people...")
    
    # Insert first 20 people for testing
    for i, person in enumerate(MOCK_PEOPLE[:20]):
        result = SupabaseService.insert_data('people', person)
        if result['success']:
            print(f" Inserted person {i+1}: {person['name']}")
        else:
            print(f" Failed to insert person {i+1}: {result['error']}")

def populate_spots():
    """Populate spots table with mock data"""
    print("Populating spots...")
    
    # Insert first 30 spots for testing
    for i, spot in enumerate(MOCK_SPOTS[:30]):
        result = SupabaseService.insert_data('spots', spot)
        if result['success']:
            print(f" Inserted spot {i+1}: {spot['name']}")
        else:
            print(f" Failed to insert spot {i+1}: {result['error']}")

def setup_complete_database():
    """Set up the complete database with sample data"""
    print(" Setting up CityMate database...")
    
    # Create sample user
    user_id = create_sample_user()
    
    # Populate all tables
    populate_apartments()
    populate_people()
    populate_spots()
    
    print("\n🎉 Database setup complete!")
    print(f"Sample user ID: {user_id}")
    print("You can now test the API endpoints.")

if __name__ == "__main__":
    setup_complete_database()