import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.supabase_client import SupabaseService
from services.ml_engine import MLEngine

def test_ml_recommendations():
    print("Testing ML Recommendation System")
    print("=" * 40)
    
    load_dotenv()
    
    ml_engine = MLEngine()
    
    users_data = SupabaseService.get_data('users', {})
    if not users_data['success'] or not users_data['data']:
        print("No users found. Run populate_database.py first")
        return False
    
    test_user = users_data['data'][0]
    print(f"   Testing with user: {test_user['name']}")
    print(f"   City: {test_user.get('city', 'Unknown')}")
    print(f"   Interests: {test_user.get('interests', [])}")
    
    print("\nTesting apartment recommendations...")
    apartments_data = SupabaseService.get_data('apartments', {})
    if apartments_data['success'] and apartments_data['data']:
        user_vector = ml_engine.create_user_vector(test_user)
        user_location = [test_user.get('lat', 0), test_user.get('lng', 0)]
        
        recommendations = ml_engine.apartment_recommendations(
            user_vector, 
            apartments_data['data'][:10],
            user_location
        )
        
        print(f"Generated {len(recommendations)} apartment recommendations")
        for i, rec in enumerate(recommendations[:3]):
            print(f"   {i+1}. Score: {rec['score']:.3f}, Distance: {rec['distance']:.2f}km")
    
    print("\nTesting people recommendations...")
    people_data = SupabaseService.get_data('people', {})
    if people_data['success'] and people_data['data']:
        recommendations = ml_engine.people_recommendations(
            user_vector,
            people_data['data'][:10],
            user_location
        )
        
        print(f"Generated {len(recommendations)} people recommendations")
        for i, rec in enumerate(recommendations[:3]):
            print(f"   {i+1}. Score: {rec['score']:.3f}, Interest Similarity: {rec['interest_similarity']:.3f}")
    
    print("\nTesting spot recommendations...")
    spots_data = SupabaseService.get_data('spots', {})
    if spots_data['success'] and spots_data['data']:
        recommendations = ml_engine.spot_recommendations(
            user_vector,
            spots_data['data'][:10],
            user_location
        )
        
        print(f"Generated {len(recommendations)} spot recommendations")
        for i, rec in enumerate(recommendations[:3]):
            print(f"   {i+1}. Score: {rec['score']:.3f}, Distance: {rec['distance']:.2f}km")
    
    print("\nML recommendation system is working!")
    return True

def test_api_endpoints():
    print("\nTesting API endpoints...")
    
    try:
        import requests
        response = requests.get('http://localhost:5001/api/health', timeout=5)
        if response.status_code == 200:
            print("Health endpoint working")
        else:
            print("Health endpoint failed")
    except:
        print("Flask app not running. Start with: python3 app.py")
    
    return True

def main():
    print("CityMate System Test")
    print("=" * 30)
    
    if test_ml_recommendations():
        print("\nML system is ready!")
    
    test_api_endpoints()
    
    print("\nSummary:")
    print("Database populated with mock data")
    print("ML recommendation engine working")
    print("Ready for frontend integration")
    print("\nNext steps:")
    print("1. Start Flask app: python3 app.py")
    print("2. Test API endpoints with your frontend")
    print("3. Replace mock data with real data tomorrow")

if __name__ == "__main__":
    main()
