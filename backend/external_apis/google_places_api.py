import requests
import uuid
from datetime import datetime
from config import Config

class GooglePlacesAPI:
    BASE_URL = "https://maps.googleapis.com/maps/api"
    
    @staticmethod
    def get_places_by_interests(lat, lng, user_interests, radius=5000):
        """Get places based on user interests"""
        try:
            # Map interests to Google place types
            interest_mapping = {
                'coffee': ['cafe', 'bakery'],
                'food': ['restaurant', 'meal_takeaway', 'meal_delivery'],
                'fitness': ['gym', 'spa', 'physiotherapist'],
                'nightlife': ['bar', 'night_club'],
                'shopping': ['shopping_mall', 'clothing_store', 'electronics_store'],
                'culture': ['museum', 'art_gallery', 'library'],
                'outdoors': ['park', 'tourist_attraction', 'amusement_park'],
                'tech': ['electronics_store', 'store'],
                'music': ['store'],  # Music stores
                'books': ['book_store', 'library'],
                'travel': ['travel_agency', 'tourist_attraction']
            }
            
            # Get place types based on interests
            place_types = set()
            for interest in user_interests:
                if interest.lower() in interest_mapping:
                    place_types.update(interest_mapping[interest.lower()])
            
            # Default types if no matching interests
            if not place_types:
                place_types = {'restaurant', 'cafe', 'gym', 'bar', 'park'}
            
            all_places = []
            
            # Search for each place type
            for place_type in list(place_types)[:6]:  # Limit to 6 types for API quota
                places = GooglePlacesAPI._search_by_type(lat, lng, place_type, radius)
                if places:
                    all_places.extend(places[:8])  # Max 8 per type
            
            return {"success": True, "spots": all_places, "source": "google_places"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def _search_by_type(lat, lng, place_type, radius):
        """Search for specific place type"""
        try:
            url = f"{GooglePlacesAPI.BASE_URL}/place/nearbysearch/json"
            
            params = {
                'location': f'{lat},{lng}',
                'radius': radius,
                'type': place_type,
                'key': Config.GOOGLE_PLACES_API_KEY
            }
            
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                places = []
                
                for place in data.get('results', [])[:10]:
                    # Get place photos
                    photos = GooglePlacesAPI._get_place_photos(place.get('photos', []))
                    
                    spot = {
                        'id': str(uuid.uuid4()),
                        'external_id': place['place_id'],
                        'name': place['name'],
                        'category': place_type,
                        'rating': place.get('rating', 3.5),
                        'price_level': place.get('price_level', 2),
                        'address': place.get('vicinity', ''),
                        'lat': place['geometry']['location']['lat'],
                        'lng': place['geometry']['location']['lng'],
                        'photos': photos,  # Real photos from Google Places
                        'description': f"Popular {place_type.replace('_', ' ')} • {place.get('rating', 'N/A')} stars",
                        'created_at': datetime.now().isoformat()
                    }
                    places.append(spot)
                
                return places
            else:
                return []
                
        except Exception as e:
            print(f"Error searching {place_type}: {e}")
            return []
    
    @staticmethod
    def _get_place_photos(photo_refs):
        """Convert Google photo references to URLs"""
        photos = []
        for photo_ref in photo_refs[:3]:  # Max 3 photos
            photo_url = f"{GooglePlacesAPI.BASE_URL}/place/photo"
            photo_url += f"?maxwidth=600&photoreference={photo_ref['photo_reference']}&key={Config.GOOGLE_PLACES_API_KEY}"
            photos.append(photo_url)
        return photos

class YelpAPI:
    BASE_URL = "https://api.yelp.com/v3"
    
    @staticmethod
    def search_businesses(lat, lng, user_interests, radius=5000):
        """Search businesses using Yelp API"""
        try:
            # Map interests to Yelp categories
            interest_categories = {
                'coffee': ['coffee', 'cafes'],
                'food': ['restaurants', 'food'],
                'fitness': ['fitness', 'gyms'],
                'nightlife': ['bars', 'nightlife'],
                'shopping': ['shopping'],
                'culture': ['arts', 'museums'],
                'outdoors': ['active']
            }
            
            categories = []
            for interest in user_interests:
                if interest.lower() in interest_categories:
                    categories.extend(interest_categories[interest.lower()])
            
            if not categories:
                categories = ['restaurants', 'bars', 'cafes']
            
            url = f"{YelpAPI.BASE_URL}/businesses/search"
            
            headers = {
                'Authorization': f'Bearer {Config.YELP_API_KEY}'
            }
            
            params = {
                'latitude': lat,
                'longitude': lng,
                'categories': ','.join(categories[:5]),  # Limit categories
                'limit': 50,
                'radius': min(radius, 40000),  # Yelp max radius is 40km
                'sort_by': 'rating'
            }
            
            response = requests.get(url, headers=headers, params=params)
            
            if response.status_code == 200:
                data = response.json()
                spots = []
                
                for business in data.get('businesses', []):
                    spot = {
                        'id': str(uuid.uuid4()),
                        'external_id': business['id'],
                        'name': business['name'],
                        'category': business['categories'][0]['alias'] if business['categories'] else 'restaurant',
                        'rating': business['rating'],
                        'price_level': len(business.get('price', '$')),
                        'address': ', '.join(business['location']['display_address']),
                        'lat': business['coordinates']['latitude'],
                        'lng': business['coordinates']['longitude'],
                        'photos': [business['image_url']] if business.get('image_url') else [],
                        'description': f"{business['rating']} stars • {business.get('price', '$')} • {business.get('review_count', 0)} reviews",
                        'created_at': datetime.now().isoformat()
                    }
                    spots.append(spot)
                
                return {"success": True, "spots": spots, "source": "yelp"}
            else:
                return {"success": False, "error": f"Yelp API error: {response.status_code}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}