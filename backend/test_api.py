import requests
import json

BASE_URL = "http://localhost:5000"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "password123"

def test_auth():
    print("Testing Authentication...")
    
    register_data = {
        "name": "Test User",
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print(f"Register Response: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        token = data.get('token')
        print(f"Registration successful, token: {token[:20]}...")
        return token
    else:
        print(f"Registration failed: {response.text}")
        
        login_data = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print(f"Login successful, token: {token[:20]}...")
            return token
        else:
            print(f"Login failed: {response.text}")
            return None

def test_apartments_feed(token):
    print("\nTesting Apartments Feed...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/apartments/feed", headers=headers)
    
    print(f"Apartments Feed Response: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        apartments = data.get('apartments', [])
        print(f"Got {len(apartments)} apartments")
        
        if apartments:
            first_apt = apartments[0]
            print(f"   First apartment: {first_apt.get('title', 'No title')}")
            print(f"   Photos: {len(first_apt.get('photos', []))} photos")
            print(f"   First photo: {first_apt.get('photos', ['No photos'])[0]}")
            return apartments[0]['id']
    else:
        print(f"Apartments feed failed: {response.text}")
        return None

def test_matches(token):
    print("\nTesting Matches...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/matches", headers=headers)
    
    print(f"Matches Response: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        matches = data.get('matches', [])
        print(f"Got {len(matches)} matches")
        
        if matches:
            for i, match in enumerate(matches[:3]):
                print(f"   Match {i+1}: {match.get('name')} ({match.get('type')})")
                print(f"   Photo: {match.get('photo', 'No photo')}")
    else:
        print(f"Matches failed: {response.text}")

def test_swipe(token, apartment_id):
    if not apartment_id:
        print("\nSkipping swipe test - no apartment ID")
        return
        
    print(f"\nTesting Swipe on apartment {apartment_id}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    swipe_data = {
        "item_id": apartment_id,
        "action": "like"
    }
    
    response = requests.post(f"{BASE_URL}/apartments/swipe", json=swipe_data, headers=headers)
    
    print(f"Swipe Response: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        is_match = data.get('match', False)
        print(f"Swipe successful! Match: {is_match}")
        if is_match:
            print("It's a match! This should show up in matches now.")
    else:
        print(f"Swipe failed: {response.text}")

def test_people_feed(token):
    print("\nTesting People Feed...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/people/feed", headers=headers)
    
    print(f"People Feed Response: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        people = data.get('people', [])
        print(f"Got {len(people)} people")
        
        if people:
            first_person = people[0]
            print(f"   First person: {first_person.get('name', 'No name')}")
            print(f"   Photos: {len(first_person.get('photos', []))} photos")
    else:
        print(f"People feed failed: {response.text}")

def test_spots_feed(token):
    print("\nTesting Spots Feed...")
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/spots/feed", headers=headers)
    
    print(f"Spots Feed Response: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        spots = data.get('spots', [])
        print(f"Got {len(spots)} spots")
        
        if spots:
            first_spot = spots[0]
            print(f"   First spot: {first_spot.get('name', 'No name')}")
            print(f"   Category: {first_spot.get('category', 'No category')}")
    else:
        print(f"Spots feed failed: {response.text}")

def main():
    print("Starting API Tests...")
    print("=" * 50)
    
    token = test_auth()
    if not token:
        print("Authentication failed - cannot continue tests")
        return
    
    apartment_id = test_apartments_feed(token)
    test_people_feed(token)
    test_spots_feed(token)
    
    test_swipe(token, apartment_id)
    
    test_matches(token)
    
    print("\n" + "=" * 50)
    print("API Tests Complete!")
    print("\nIf all tests passed, your backend is working correctly.")
    print("You can now test the frontend with confidence.")

if __name__ == "__main__":
    main()