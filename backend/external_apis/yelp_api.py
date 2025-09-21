
import requests
import uuid
from datetime import datetime
from config import Config

class YelpAPI:
    BASE_URL = "https://api.yelp.com/v3"
    
    @staticmethod
    def search_by_interest(location=None, lat=None, lng=None, user_interests=None, radius=8000):
        """Search businesses using Yelp API by address or coordinates."""
        if user_interests is None:
            user_interests = []
            
        try:
            interest_categories = {
                'coffee': ['coffee', 'cafes'], 'food': ['restaurants', 'food'],
                'fitness': ['fitness', 'gyms'], 'nightlife': ['bars', 'nightlife'],
                'shopping': ['shopping'], 'culture': ['arts', 'museums'],
                'outdoors': ['active'],
            }
            
            categories = {cat for interest in user_interests for cat in interest_categories.get(interest.lower(), [])}
            if not categories:
                categories = {'restaurants', 'bars', 'cafes'}
            
            url = f"{YelpAPI.BASE_URL}/businesses/search"
            headers = {'Authorization': f'Bearer {Config.YELP_API_KEY}'}
            
            params = {
                'categories': ','.join(list(categories)[:5]),
                'limit': 50,
                'radius': min(radius, 40000), # Yelp max radius is 40km
                'sort_by': 'best_match'
            }

            if lat and lng:
                params['latitude'] = lat
                params['longitude'] = lng
            elif location:
                params['location'] = location
            else:
                return {"success": False, "error": "No location provided for Yelp search."}
            
            response = requests.get(url, headers=headers, params=params)
            
            if response.status_code == 200:
                data = response.json()
                spots = []
                for business in data.get('businesses', []):
                    # --- FIX --- Made data access safer with .get() to prevent errors on missing data
                    location_info = business.get('location', {})
                    coordinates = business.get('coordinates', {})
                    
                    # Skip if essential information is missing
                    if not (business.get('id') and business.get('name') and coordinates.get('latitude')):
                        continue

                    spot = {
                        'id': str(uuid.uuid4()),
                        'external_id': business.get('id'),
                        'name': business.get('name'),
                        'category': business.get('categories', [{}])[0].get('alias', 'restaurant'),
                        'rating': business.get('rating', 3.5),
                        'address': ', '.join(location_info.get('display_address', [])),
                        'lat': coordinates.get('latitude'),
                        'lng': coordinates.get('longitude'),
                        'photos': [business['image_url']] if business.get('image_url') else [],
                        'description': f"{business.get('rating', 'N/A')} stars • {business.get('price', '$')} • {business.get('review_count', 0)} reviews"
                    }
                    spots.append(spot)
                
                return {"success": True, "spots": spots, "source": "yelp"}
            else:
                # --- FIX --- Improved error message for easier debugging
                error_details = response.json().get('error', {}).get('description', response.text)
                print(f"Yelp API Error: {response.status_code} - {error_details}")
                return {"success": False, "error": f"Yelp API error: {response.status_code} - {error_details}"}
                
        except Exception as e:
            print(f"An unexpected error occurred in YelpAPI: {e}")
            return {"success": False, "error": str(e)}