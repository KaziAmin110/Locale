import requests
import uuid
from datetime import datetime
from config import Config

class RentSpreeAPI:
    BASE_URL = "https://api.rentspree.com/v1"
    
    @staticmethod
    def search_apartments(city, state, budget_min=500, budget_max=5000, radius=25):
        """Search apartments using RentSpree API"""
        try:
            url = f"{RentSpreeAPI.BASE_URL}/properties/search"
            
            headers = {
                'Authorization': f'Bearer {Config.RENTSPREE_API_KEY}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                "location": f"{city}, {state}",
                "property_type": "apartment",
                "min_rent": budget_min,
                "max_rent": budget_max,
                "radius_miles": radius,
                "limit": 50
            }
            
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                apartments = []
                
                for prop in data.get('properties', []):
                    apartment = {
                        'id': str(uuid.uuid4()),
                        'external_id': prop['id'],
                        'title': f"{prop.get('bedrooms', 1)}BR Apartment - {prop.get('neighborhood', city)}",
                        'description': prop.get('description', 'Beautiful apartment in great location'),
                        'price': int(prop.get('rent', 0)),
                        'bedrooms': int(prop.get('bedrooms', 1)),
                        'bathrooms': float(prop.get('bathrooms', 1)),
                        'square_feet': int(prop.get('sqft', 0)) if prop.get('sqft') else None,
                        'address': prop.get('address', ''),
                        'lat': float(prop.get('latitude', 0)),
                        'lng': float(prop.get('longitude', 0)),
                        'photos': prop.get('photos', []),  # Real apartment photos
                        'amenities': prop.get('amenities', []),
                        'contact_info': {
                            'phone': prop.get('contact_phone'),
                            'email': prop.get('contact_email'),
                            'website': prop.get('website')
                        },
                        'created_at': datetime.now().isoformat()
                    }
                    apartments.append(apartment)
                
                return {"success": True, "apartments": apartments, "source": "rentspree"}
            else:
                return {"success": False, "error": f"RentSpree API error: {response.status_code}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}

class ZillowAPI:
    @staticmethod
    def search_rentals(city, state):
        """Search rentals using Zillow via RapidAPI"""
        try:
            url = "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch"
            
            querystring = {
                "location": f"{city}, {state}",
                "home_type": "Apartments,Condos",
                "sort": "Newest",
                "list_price_min": "500",
                "list_price_max": "5000"
            }
            
            headers = {
                "X-RapidAPI-Key": Config.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
            }
            
            response = requests.get(url, headers=headers, params=querystring)
            
            if response.status_code == 200:
                data = response.json()
                apartments = []
                
                for prop in data.get('props', [])[:20]:  # Limit to 20
                    apartment = {
                        'id': str(uuid.uuid4()),
                        'external_id': prop.get('zpid'),
                        'title': prop.get('address', {}).get('streetAddress', 'Apartment'),
                        'description': f"Property in {city}",
                        'price': int(prop.get('price', 0)) if prop.get('price') else 1500,
                        'bedrooms': int(prop.get('bedrooms', 1)),
                        'bathrooms': int(prop.get('bathrooms', 1)),
                        'square_feet': int(prop.get('livingArea', 0)) if prop.get('livingArea') else None,
                        'address': f"{prop.get('address', {}).get('streetAddress', '')}, {city}",
                        'lat': float(prop.get('latitude', 0)),
                        'lng': float(prop.get('longitude', 0)),
                        'photos': [prop.get('imgSrc')] if prop.get('imgSrc') else [],
                        'amenities': [],
                        'contact_info': {'website': prop.get('detailUrl', '')},
                        'created_at': datetime.now().isoformat()
                    }
                    apartments.append(apartment)
                
                return {"success": True, "apartments": apartments, "source": "zillow"}
            else:
                return {"success": False, "error": f"Zillow API error: {response.status_code}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}