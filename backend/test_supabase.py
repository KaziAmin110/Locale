import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.supabase_client import SupabaseService

def test_connection():
    print("Testing Supabase connection...")
    
    try:
        result = SupabaseService.get_data('users', {})
        if result['success']:
            print("Supabase connection successful")
            return True
        else:
            print(f"Connection failed: {result['error']}")
            return False
    except Exception as e:
        print(f"Connection error: {str(e)}")
        return False

def check_data_counts():
    print("\nChecking data counts...")
    
    tables = ['users', 'apartments', 'people', 'spots']
    total_records = 0
    
    for table in tables:
        try:
            result = SupabaseService.get_data(table, {})
            if result['success']:
                count = len(result['data'])
                total_records += count
                print(f"  {table}: {count} records")
            else:
                print(f"  Error checking {table}: {result['error']}")
        except Exception as e:
            print(f"  Error checking {table}: {str(e)}")
    
    print(f"\nTotal records: {total_records}")
    return total_records > 0

def main():
    print("Supabase Data Test")
    print("=" * 30)
    
    load_dotenv()
    
    if not test_connection():
        print("\nSetup incomplete. Please check your .env file and Supabase configuration.")
        return False
    
    if not check_data_counts():
        print("\nNo data found. Run 'python3 insert_mock_data.py' to populate the database.")
        return False
    
    print("\nAll tests passed! Your Supabase setup is working correctly.")
    return True

if __name__ == "__main__":
    main()
