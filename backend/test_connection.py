from services.supabase_client import SupabaseService
from config import Config

def test_supabase_connection():
    print("Testing Supabase connection...")
    print(f"URL: {Config.SUPABASE_URL}")
    print(f"Key: {Config.SUPABASE_KEY[:20]}...")
    
    try:
        client = SupabaseService.get_client()
        print(" Supabase client created successfully")
        
        test_user = {
            'email': 'test@example.com',
            'name': 'Test User',
            'age': 25,
            'city': 'Austin',
            'interests': ['coffee', 'hiking']
        }
        
        result = SupabaseService.insert_data('users', test_user)
        if result['success']:
            print(" Successfully inserted test user")
            print(f"User ID: {result['data'][0]['id']}")
        else:
            print(f" Failed to insert user: {result['error']}")
            
        users = SupabaseService.get_data('users')
        if users['success']:
            print(f" Successfully retrieved {len(users['data'])} users")
        else:
            print(f" Failed to retrieve users: {users['error']}")
            
    except Exception as e:
        print(f" Connection failed: {str(e)}")

if __name__ == "__main__":
    test_supabase_connection()