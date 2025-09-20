import asyncio
import requests
from config import Config
from external_apis.rentspree_api import RentSpreeAPI, ZillowAPI
from external_apis.google_places_api import GooglePlacesAPI, YelpAPI

def test_all_apis():
    """Test all real APIs with sample data"""
    print(" Testing Real APIs...")
    
    # Test coordinates (Austin, TX)
    test_lat, test_lng = 30.2672, -97.7431
    test_city, test_state = "Austin", "TX"
    test_interests = ["coffee", "food", "tech", "fitness"]
    
    # Test 1: RentSpree API
    print("\n1. Testing RentSpree API...")
    if Config.RENTSPREE_API_KEY:
        result = RentSpreeAPI.search_apartments(test_city, test_state)
        if result['success']:
            print(f" RentSpree: {len(result['apartments'])} apartments found")
            if result['apartments']:
                sample_apt = result['apartments'][0]
                print(f"   Sample: {sample_apt['title']} - ${sample_apt['price']}")
                print(f"   Photos: {len(sample_apt['photos'])} images")
        else:
            print(f" RentSpree failed: {result['error']}")
    else:
        print(" RentSpree API key not configured")
    
    # Test 2: Zillow API
    print("\n2. Testing Zillow API...")
    if Config.RAPIDAPI_KEY:
        result = ZillowAPI.search_rentals(test_city, test_state)
        if result['success']:
            print(f" Zillow: {len(result['apartments'])} apartments found")
            if result['apartments']:
                sample_apt = result['apartments'][0]
                print(f"   Sample: {sample_apt['title']} - ${sample_apt['price']}")
        else:
            print(f" Zillow failed: {result['error']}")
    else:
        print(" Zillow API key not configured")
    
    # Test 3: Google Places API
    print("\n3. Testing Google Places API...")
    if Config.GOOGLE_PLACES_API_KEY:
        result = GooglePlacesAPI.get_places_by_interests(test_lat, test_lng, test_interests)
        if result['success']:
            print(f" Google Places: {len(result['spots'])} spots found")
            if result['spots']:
                sample_spot = result['spots'][0]
                print(f"   Sample: {sample_spot['name']} - {sample_spot['category']}")
                print(f"   Photos: {len(sample_spot['photos'])} images")
        else:
            print(f" Google Places failed: {result['error']}")
    else:
        print(" Google Places API key not configured")
    
    # Test 4: Yelp API
    print("\n4. Testing Yelp API...")
    if Config.YELP_API_KEY:
        result = YelpAPI.search_businesses(test_lat, test_lng, test_interests)
        if result['success']:
            print(f" Yelp: {len(result['spots'])} businesses found")
            if result['spots']:
                sample_spot = result['spots'][0]
                print(f"   Sample: {sample_spot['name']} - {sample_spot['rating']} stars")
        else:
            print(f" Yelp failed: {result['error']}")
    else:
        print(" Yelp API key not configured")
    
    print("\n🎉 API testing complete!")

def test_backend_endpoints():
    """Test backend endpoints with real data"""
    print("\n Testing Backend Endpoints...")
    
    # You'll need a valid JWT token for this
    # Get it by logging in through the frontend first
    token = input("Enter your JWT token (or press Enter to skip): ").strip()
    
    if not token:
        print(" Skipping endpoint tests (no token provided)")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    base_url = "http://localhost:5000/api"
    
    # Test apartments endpoint
    print("\n1. Testing /apartments/feed...")
    try:
        response = requests.get(f"{base_url}/apartments/feed", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f" Apartments: {len(data.get('apartments', []))} items")
            print(f"   Data source: {data.get('data_source', 'unknown')}")
        else:
            print(f" Apartments endpoint failed: {response.status_code}")
    except Exception as e:
        print(f" Apartments endpoint error: {e}")
    
    # Test spots endpoint
    print("\n2. Testing /spots/feed...")
    try:
        response = requests.get(f"{base_url}/spots/feed", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"Spots: {len(data.get('spots', []))} items")
            print(f"   Data source: {data.get('data_source', 'unknown')}")
        else:
            print(f" Spots endpoint failed: {response.status_code}")
    except Exception as e:
        print(f" Spots endpoint error: {e}")
    
    # Test people endpoint
    print("\n3. Testing /people/feed...")
    try:
        response = requests.get(f"{base_url}/people/feed", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f" People: {len(data.get('people', []))} items")
        else:
            print(f" People endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"People endpoint error: {e}")

if __name__ == "__main__":
    test_all_apis()
    test_backend_endpoints()