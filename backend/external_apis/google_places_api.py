import requests
import uuid
from datetime import datetime
from config import Config

class GooglePlacesAPI:
    BASE_URL = "https://maps.googleapis.com/maps/api"

    # --- NEW --- Helper method to convert an address to lat/lng
    @staticmethod
    def _geocode_address(address):
        """Converts a string address into latitude and longitude."""
        try:
            url = f"{GooglePlacesAPI.BASE_URL}/geocode/json"
            params = {
                'address': address,
                'key': Config.GOOGLE_PLACES_API_KEY
            }
            response = requests.get(url, params=params)
            response.raise_for_status()  # Raise an exception for bad status codes
            data = response.json()

            if data['status'] == 'OK' and data['results']:
                location = data['results'][0]['geometry']['location']
                return {'lat': location['lat'], 'lng': location['lng']}
            else:
                print(f"Geocoding failed for '{address}': {data.get('status')}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"Error during geocoding request: {e}")
            return None

    # --- MODIFIED --- Main method now handles address or lat/lng
    @staticmethod
    def search_nearby_by_interest(location=None, lat=None, lng=None, user_interests=None, radius=8000):
        """Get places by address (geocoding) or direct lat/lng."""
        if user_interests is None:
            user_interests = []
            
        try:
            # Step 1: Get coordinates
            coords = None
            if lat and lng:
                coords = {'lat': lat, 'lng': lng}
            elif location:
                coords = GooglePlacesAPI._geocode_address(location)

            if not coords:
                return {"success": False, "error": "Could not determine location from provided address."}

            # Step 2: Map interests to Google place types
            interest_mapping = {
                'coffee': ['cafe', 'bakery'], 'food': ['restaurant', 'meal_takeaway'],
                'fitness': ['gym', 'spa'], 'nightlife': ['bar', 'night_club'],
                'shopping': ['shopping_mall', 'clothing_store'], 'culture': ['museum', 'art_gallery'],
                'outdoors': ['park', 'tourist_attraction'], 'books': ['book_store', 'library'],
            }
            
            place_types = {t for interest in user_interests for t in interest_mapping.get(interest.lower(), [])}
            if not place_types:
                place_types = {'restaurant', 'cafe', 'park'} # Default search

            # Step 3: Search for each place type
            all_places = set()
            unique_place_ids = set()

            for place_type in list(place_types)[:5]:  # Limit API calls
                places = GooglePlacesAPI._search_by_type(coords['lat'], coords['lng'], place_type, radius)
                for place in places:
                    if place['external_id'] not in unique_place_ids:
                        all_places.add(tuple(place.items())) # Use tuple of items to make it hashable
                        unique_place_ids.add(place['external_id'])
            
            # Convert set of tuples back to list of dicts
            spots = [dict(p) for p in all_places]

            return {"success": True, "spots": spots, "source": "google_places"}
            
        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    def _search_by_type(lat, lng, place_type, radius):
        """(Unchanged) Search for a specific place type using coordinates."""
        try:
            url = f"{GooglePlacesAPI.BASE_URL}/place/nearbysearch/json"
            params = {
                'location': f'{lat},{lng}', 'radius': radius,
                'type': place_type, 'key': Config.GOOGLE_PLACES_API_KEY
            }
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                places = []
                for place in data.get('results', []):
                    photos = GooglePlacesAPI._get_place_photos(place.get('photos', []))
                    spot = {
                        'id': str(uuid.uuid4()), 'external_id': place['place_id'],
                        'name': place['name'], 'category': place_type,
                        'rating': place.get('rating', 3.5), 'address': place.get('vicinity', ''),
                        'lat': place['geometry']['location']['lat'], 'lng': place['geometry']['location']['lng'],
                        'photos': photos,
                        'description': f"A popular {place_type.replace('_', ' ')} with a rating of {place.get('rating', 'N/A')} stars."
                    }
                    places.append(spot)
                return places
            return []
        except Exception as e:
            print(f"Error searching {place_type}: {e}")
            return []
    
    @staticmethod
    def _get_place_photos(photo_refs):
        """(Unchanged) Convert Google photo references to URLs."""
        photos = []
        if not photo_refs: return photos
        for photo_ref in photo_refs[:2]: # Max 2 photos
            photo_url = (f"{GooglePlacesAPI.BASE_URL}/place/photo"
                         f"?maxwidth=800&photoreference={photo_ref['photo_reference']}"
                         f"&key={Config.GOOGLE_PLACES_API_KEY}")
            photos.append(photo_url)
        return photos