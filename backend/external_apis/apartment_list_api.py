import requests
import uuid
from datetime import datetime
import json

class ApartmentListAPI:
    @staticmethod
    def search_apartments(city, state, budget_min=500, budget_max=5000):
        """Use ApartmentList.com API - has free tier"""
        try:
            # ApartmentList API (free tier available)
            url = "https://www.apartmentlist.com/api/v2/search"
            
            headers = {
                'User-Agent': 'CityMate/1.0',
                'Content-Type': 'application/json'
            }
            
            payload = {
                "location": f"{city}, {state}",
                "rent_min": budget_min,
                "rent_max": budget_max,
                "limit": 20
            }
            
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                apartments = []
                
                for listing in data.get('listings', []):
                    apartment = {
                        'id': str(uuid.uuid4()),
                        'external_id': listing.get('id', ''),
                        'title': listing.get('name', f"Apartment in {city}"),
                        'description': listing.get('description', 'Beautiful apartment available for rent'),
                        'price': int(listing.get('rent', {}).get('min', 1500)),
                        'bedrooms': int(listing.get('bedrooms', {}).get('min', 1)),
                        'bathrooms': int(listing.get('bathrooms', {}).get('min', 1)),
                        'square_feet': int(listing.get('square_feet', {}).get('min', 800)),
                        'address': listing.get('address', {}).get('display', f"{city}, {state}"),
                        'lat': float(listing.get('lat', 0)),
                        'lng': float(listing.get('lng', 0)),
                        'photos': listing.get('photos', [])[:5],  # First 5 photos
                        'amenities': listing.get('amenities', [])[:8],  # First 8 amenities
                        'contact_info': {
                            'phone': listing.get('phone', ''),
                            'website': listing.get('website', '')
                        },
                        'created_at': datetime.now().isoformat()
                    }
                    apartments.append(apartment)
                
                return {"success": True, "apartments": apartments, "source": "apartmentlist"}
            else:
                return {"success": False, "error": f"ApartmentList API error: {response.status_code}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}

class PadMapperAPI:
    @staticmethod
    def search_apartments(city, state):
        """Use PadMapper API - free public data"""
        try:
            # PadMapper search (uses public Craigslist data)
            city_code = {
                'austin': 'austin',
                'san francisco': 'sfbay',
                'new york': 'newyork',
                'seattle': 'seattle'
            }.get(city.lower(), city.lower())
            
            url = f"https://www.padmapper.com/api/search"
            
            params = {
                'location': city_code,
                'type': 'apartment',
                'price-min': 500,
                'price-max': 5000,
                'limit': 25
            }
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (compatible; CityMate/1.0)',
                'Accept': 'application/json'
            }
            
            response = requests.get(url, params=params, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                apartments = []
                
                for listing in data.get('listings', [])[:20]:
                    try:
                        apartment = {
                            'id': str(uuid.uuid4()),
                            'external_id': listing.get('id', ''),
                            'title': listing.get('title', f"Apartment in {city}"),
                            'description': listing.get('body', 'Nice apartment for rent'),
                            'price': int(listing.get('price', 1500)),
                            'bedrooms': int(listing.get('bedrooms', 1)),
                            'bathrooms': int(listing.get('bathrooms', 1)),
                            'square_feet': int(listing.get('sqft', 800)) if listing.get('sqft') else None,
                            'address': f"{city}, {state}",
                            'lat': float(listing.get('lat', 0)),
                            'lng': float(listing.get('lng', 0)),
                            'photos': listing.get('photos', [])[:3],
                            'amenities': [],
                            'contact_info': {'url': listing.get('url', '')},
                            'created_at': datetime.now().isoformat()
                        }
                        apartments.append(apartment)
                    except (ValueError, TypeError):
                        continue
                
                return {"success": True, "apartments": apartments, "source": "padmapper"}
            else:
                return {"success": False, "error": f"PadMapper error: {response.status_code}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}