#!/usr/bin/env python3
"""
Test ML Recommendations through Flask API Endpoints
This script tests the actual API endpoints to verify ML recommendations work
"""

import requests
import json
import time
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
BASE_URL = "http://localhost:5001"
TEST_USER_EMAIL = "user1@example.com"

def wait_for_server():
    """Wait for Flask server to start"""
    print("⏳ Waiting for Flask server to start...")
    for i in range(30):  # Wait up to 30 seconds
        try:
            response = requests.get(f"{BASE_URL}/api/health", timeout=2)
            if response.status_code == 200:
                print("✅ Flask server is running!")
                return True
        except:
            pass
        time.sleep(1)
        print(f"   Attempt {i+1}/30...")
    
    print("❌ Flask server not responding")
    return False

def get_auth_token():
    """Get authentication token for testing"""
    print("\n🔐 Getting authentication token...")
    
    # Use the development flow with mock user info
    auth_data = {
        "user_info": {
            "email": TEST_USER_EMAIL,
            "name": "Test User",
            "picture": "https://via.placeholder.com/150"
        }
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/google-login", json=auth_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                token = data.get('access_token')
                print("✅ Authentication successful")
                return token
            else:
                print(f"❌ Auth failed: {data.get('error')}")
        else:
            print(f"❌ Auth request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Auth error: {str(e)}")
    
    return None

def test_apartment_recommendations(token):
    """Test apartment ML recommendations"""
    print("\n🏠 Testing Apartment Recommendations...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/apartments/feed", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                apartments = data.get('apartments', [])
                print(f"✅ Got {len(apartments)} apartment recommendations")
                
                # Show top 3 recommendations with ML scores
                for i, apt in enumerate(apartments[:3]):
                    score = apt.get('match_score', 0)
                    title = apt.get('title', 'Unknown')
                    price = apt.get('price', 0)
                    print(f"   {i+1}. {title} - ${price} (Score: {score:.3f})")
                
                return True
            else:
                print(f"❌ API error: {data.get('error')}")
        else:
            print(f"❌ Request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    return False

def test_people_recommendations(token):
    """Test people ML recommendations"""
    print("\n👥 Testing People Recommendations...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/people/feed", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                people = data.get('people', [])
                print(f"✅ Got {len(people)} people recommendations")
                
                # Show top 3 recommendations with ML scores
                for i, person in enumerate(people[:3]):
                    score = person.get('match_score', 0)
                    name = person.get('name', 'Unknown')
                    age = person.get('age', 0)
                    interests = person.get('interests', [])
                    print(f"   {i+1}. {name}, {age} - {', '.join(interests[:3])} (Score: {score:.3f})")
                
                return True
            else:
                print(f"❌ API error: {data.get('error')}")
        else:
            print(f"❌ Request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    return False

def test_spot_recommendations(token):
    """Test spot ML recommendations"""
    print("\n📍 Testing Spot Recommendations...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/spots/feed", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                spots = data.get('spots', [])
                print(f"✅ Got {len(spots)} spot recommendations")
                
                # Show top 3 recommendations with ML scores
                for i, spot in enumerate(spots[:3]):
                    score = spot.get('match_score', 0)
                    name = spot.get('name', 'Unknown')
                    category = spot.get('category', 'Unknown')
                    rating = spot.get('rating', 0)
                    print(f"   {i+1}. {name} ({category}) - ⭐{rating} (Score: {score:.3f})")
                
                return True
            else:
                print(f"❌ API error: {data.get('error')}")
        else:
            print(f"❌ Request failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    return False

def test_swipe_functionality(token):
    """Test swipe functionality"""
    print("\n👆 Testing Swipe Functionality...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test apartment swipe
    try:
        swipe_data = {
            "apartment_id": "test-id",  # This will fail but test the endpoint
            "direction": "right"
        }
        response = requests.post(f"{BASE_URL}/api/apartments/swipe", json=swipe_data, headers=headers)
        print(f"✅ Apartment swipe endpoint responding (status: {response.status_code})")
    except Exception as e:
        print(f"❌ Apartment swipe error: {str(e)}")
    
    # Test people swipe
    try:
        swipe_data = {
            "person_id": "test-id",
            "direction": "right"
        }
        response = requests.post(f"{BASE_URL}/api/people/swipe", json=swipe_data, headers=headers)
        print(f"✅ People swipe endpoint responding (status: {response.status_code})")
    except Exception as e:
        print(f"❌ People swipe error: {str(e)}")
    
    # Test spot swipe
    try:
        swipe_data = {
            "spot_id": "test-id",
            "direction": "right"
        }
        response = requests.post(f"{BASE_URL}/api/spots/swipe", json=swipe_data, headers=headers)
        print(f"✅ Spot swipe endpoint responding (status: {response.status_code})")
    except Exception as e:
        print(f"❌ Spot swipe error: {str(e)}")

def main():
    """Main test function"""
    print("🧪 Testing ML Recommendations via Flask API")
    print("=" * 50)
    
    # Wait for server
    if not wait_for_server():
        print("\n❌ Please start Flask server first:")
        print("   python3 app.py")
        return
    
    # Get auth token
    token = get_auth_token()
    if not token:
        print("\n❌ Could not get authentication token")
        return
    
    # Test ML recommendations
    print("\n🤖 Testing ML Recommendation Endpoints...")
    
    success_count = 0
    
    if test_apartment_recommendations(token):
        success_count += 1
    
    if test_people_recommendations(token):
        success_count += 1
    
    if test_spot_recommendations(token):
        success_count += 1
    
    # Test swipe functionality
    test_swipe_functionality(token)
    
    # Summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {success_count}/3 ML endpoints working")
    
    if success_count == 3:
        print("🎉 All ML recommendations are working perfectly!")
        print("\n✅ Your system is ready for:")
        print("   • Frontend integration")
        print("   • Demo presentation")
        print("   • Real data integration tomorrow")
    else:
        print("⚠️  Some endpoints need attention")
    
    print(f"\n🌐 API Base URL: {BASE_URL}")
    print("📋 Available endpoints:")
    print("   GET  /api/apartments/feed")
    print("   GET  /api/people/feed") 
    print("   GET  /api/spots/feed")
    print("   POST /api/apartments/swipe")
    print("   POST /api/people/swipe")
    print("   POST /api/spots/swipe")

if __name__ == "__main__":
    main()
