import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data.mock_data import MOCK_APARTMENTS, MOCK_PEOPLE, MOCK_SPOTS
from services.supabase_client import SupabaseService

def check_env_variables():
    load_dotenv()
    
    required_vars = ['SUPABASE_URL', 'SUPABASE_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"Missing environment variables: {', '.join(missing_vars)}")
        print("Please create a .env file with:")
        for var in missing_vars:
            print(f"  {var}=your_value_here")
        return False
    
    print("Environment variables found")
    return True

def test_supabase_connection():
    try:
        result = SupabaseService.get_data('users', {})
        if result['success']:
            print("Supabase connection successful")
            return True
        else:
            print(f"Supabase connection failed: {result['error']}")
            return False
    except Exception as e:
        print(f"Supabase connection error: {str(e)}")
        return False

def insert_apartments():
    print("\nInserting apartments...")
    
    batch_size = 10
    total_inserted = 0
    
    for i in range(0, len(MOCK_APARTMENTS), batch_size):
        batch = MOCK_APARTMENTS[i:i + batch_size]
        result = SupabaseService.insert_data('apartments', batch)
        
        if result['success']:
            total_inserted += len(batch)
            print(f"  Inserted batch {i//batch_size + 1}: {len(batch)} apartments")
        else:
            print(f"  Failed to insert batch {i//batch_size + 1}: {result['error']}")
            return False
    
    print(f"Successfully inserted {total_inserted} apartments")
    return True

def insert_people():
    print("\nInserting people...")
    
    batch_size = 20
    total_inserted = 0
    
    for i in range(0, len(MOCK_PEOPLE), batch_size):
        batch = MOCK_PEOPLE[i:i + batch_size]
        result = SupabaseService.insert_data('people', batch)
        
        if result['success']:
            total_inserted += len(batch)
            print(f"  Inserted batch {i//batch_size + 1}: {len(batch)} people")
        else:
            print(f"  Failed to insert batch {i//batch_size + 1}: {result['error']}")
            return False
    
    print(f"Successfully inserted {total_inserted} people")
    return True

def insert_spots():
    print("\nInserting spots...")
    
    batch_size = 25
    total_inserted = 0
    
    for i in range(0, len(MOCK_SPOTS), batch_size):
        batch = MOCK_SPOTS[i:i + batch_size]
        result = SupabaseService.insert_data('spots', batch)
        
        if result['success']:
            total_inserted += len(batch)
            print(f"  Inserted batch {i//batch_size + 1}: {len(batch)} spots")
        else:
            print(f"  Failed to insert batch {i//batch_size + 1}: {result['error']}")
            return False
    
    print(f"Successfully inserted {total_inserted} spots")
    return True

def check_existing_data():
    print("\nChecking existing data...")
    
    tables = ['apartments', 'people', 'spots']
    existing_data = {}
    
    for table in tables:
        result = SupabaseService.get_data(table, {})
        if result['success']:
            count = len(result['data'])
            existing_data[table] = count
            print(f"{table}: {count} records")
        else:
            print(f"  Error checking {table}: {result['error']}")
            existing_data[table] = 0
    
    return existing_data

def main():
    print("Starting mock data insertion process...")
    print("=" * 50)
    
    if not check_env_variables():
        return False
    
    if not test_supabase_connection():
        return False
    
    existing_data = check_existing_data()
    
    if any(count > 0 for count in existing_data.values()):
        print("\nSome tables already contain data.")
        response = input("Do you want to continue? This will add more data (y/N): ").strip().lower()
        if response != 'y':
            print("Operation cancelled")
            return False
    
    success = True
    
    if existing_data.get('apartments', 0) == 0:
        success &= insert_apartments()
    else:
        print(f"Skipping apartments (already has {existing_data['apartments']} records)")
    
    if existing_data.get('people', 0) == 0:
        success &= insert_people()
    else:
        print(f"Skipping people (already has {existing_data['people']} records)")
    
    if existing_data.get('spots', 0) == 0:
        success &= insert_spots()
    else:
        print(f"Skipping spots (already has {existing_data['spots']} records)")
    
    print("\n" + "=" * 50)
    if success:
        print("Mock data insertion completed successfully!")
        print("\nSummary:")
        print(f"  Apartments: {len(MOCK_APARTMENTS)} records")
        print(f"  People: {len(MOCK_PEOPLE)} records")
        print(f"  Spots: {len(MOCK_SPOTS)} records")
        print("\nYour Supabase database is now populated with mock data!")
    else:
        print("Some errors occurred during data insertion.")
        print("Please check the error messages above and try again.")
    
    return success

if __name__ == "__main__":
    main()
