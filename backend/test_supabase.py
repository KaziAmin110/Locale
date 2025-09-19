#!/usr/bin/env python3
"""
Test script to verify Supabase connection and data.
"""

import os
import sys
from dotenv import load_dotenv

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.supabase_client import SupabaseService

def test_connection():
    """Test Supabase connection"""
    print("🔍 Testing Supabase connection...")
    
    try:
        # Test basic connection
        result = SupabaseService.get_data('users', {})
        if result['success']:
            print("✅ Supabase connection successful")
            return True
        else:
            print(f"❌ Connection failed: {result['error']}")
            return False
    except Exception as e:
        print(f"❌ Connection error: {str(e)}")
        return False

def check_data_counts():
    """Check data counts in all tables"""
    print("\n📊 Checking data counts...")
    
    tables = ['users', 'apartments', 'people', 'spots']
    total_records = 0
    
    for table in tables:
        try:
            result = SupabaseService.get_data(table, {})
            if result['success']:
                count = len(result['data'])
                total_records += count
                print(f"  📋 {table}: {count} records")
            else:
                print(f"  ❌ Error checking {table}: {result['error']}")
        except Exception as e:
            print(f"  ❌ Error checking {table}: {str(e)}")
    
    print(f"\n📈 Total records: {total_records}")
    return total_records > 0

def main():
    """Main test function"""
    print("🧪 Supabase Data Test")
    print("=" * 30)
    
    # Load environment variables
    load_dotenv()
    
    # Test connection
    if not test_connection():
        print("\n❌ Setup incomplete. Please check your .env file and Supabase configuration.")
        return False
    
    # Check data
    if not check_data_counts():
        print("\n⚠️  No data found. Run 'python3 insert_mock_data.py' to populate the database.")
        return False
    
    print("\n✅ All tests passed! Your Supabase setup is working correctly.")
    return True

if __name__ == "__main__":
    main()
