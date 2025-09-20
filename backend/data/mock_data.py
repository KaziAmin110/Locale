import uuid
from datetime import datetime

def generate_mock_apartments():
    """Generate mock apartment data"""
    apartments = []
    cities = {
        'Austin': (30.2672, -97.7431),
        'San Francisco': (37.7749, -122.4194),
        'New York': (40.7128, -74.0060),
        'Seattle': (47.6062, -122.3321)
    }
    
    for i in range(50):
        city_name, (base_lat, base_lng) = list(cities.items())[i % len(cities)]
        apartment = {
            'id': str(uuid.uuid4()),
            'title': f'Modern {i%3+1}BR Apartment in {city_name}',
            'description': f'Beautiful apartment with great amenities in downtown {city_name}',
            'price': 1000 + (i * 50) % 3000,
            'bedrooms': (i % 3) + 1,
            'bathrooms': 1 + (i % 2) * 0.5,
            'square_feet': 600 + (i * 100) % 1000,
            'address': f'{100 + i} Main Street, {city_name}',
            'lat': base_lat + (i % 10 - 5) * 0.01,
            'lng': base_lng + (i % 10 - 5) * 0.01,
            'photos': [
                f'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1560448075-4b4b4b4b4b4b?w=800&h=600&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop&auto=format&q=80'
            ][i % 5:i % 5 + 2],
            'amenities': ['parking', 'gym', 'pool', 'laundry'][:(i % 4) + 1],
            'contact_info': {
                'phone': f'555-{1000 + i}',
                'email': f'landlord{i}@example.com'
            },
            'created_at': datetime.now().isoformat()
        }
        apartments.append(apartment)
    
    return apartments

def generate_mock_people():
    """Generate mock people data"""
    people = []
    names = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Taylor', 'Sam', 'Jamie']
    interests_pool = ['coffee', 'hiking', 'tech', 'food', 'music', 'sports', 'art', 'books']
    cities = {
        'Austin': (30.2672, -97.7431),
        'San Francisco': (37.7749, -122.4194),
        'New York': (40.7128, -74.0060),
        'Seattle': (47.6062, -122.3321)
    }
    
    for i in range(100):
        city_name, (base_lat, base_lng) = list(cities.items())[i % len(cities)]
        person = {
            'id': str(uuid.uuid4()),
            'name': f'{names[i % len(names)]} {chr(65 + i % 26)}',
            'age': 22 + (i % 15),
            'bio': f'New to {city_name} and looking to meet cool people! Love exploring the city.',
            'interests': interests_pool[(i % 3):(i % 3) + 3 + (i % 3)],
            'photos': [
                f'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1494790108755-2616b5c0804?w=400&h=400&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format&q=80'
            ][i % 5:i % 5 + 2],
            'lat': base_lat + (i % 20 - 10) * 0.005,
            'lng': base_lng + (i % 20 - 10) * 0.005,
            'is_synthetic': True,
            'created_at': datetime.now().isoformat()
        }
        people.append(person)
    
    return people

def generate_mock_spots():
    """Generate mock local spots data"""
    spots = []
    categories = ['coffee_shop', 'restaurant', 'bar', 'gym', 'park', 'museum', 'shopping']
    cities = {
        'Austin': (30.2672, -97.7431),
        'San Francisco': (37.7749, -122.4194),
        'New York': (40.7128, -74.0060),
        'Seattle': (47.6062, -122.3321)
    }
    
    spot_names = {
        'coffee_shop': ['Central Perk', 'Bean There', 'Grind Coffee', 'Roast House'],
        'restaurant': ['Tasty Bites', 'Local Eats', 'City Kitchen', 'Fresh Table'],
        'bar': ['The Social', 'Night Owl', 'Cheers Bar', 'Craft House'],
        'gym': ['FitLife', 'Power Gym', 'Flex Fitness', 'Strong Body'],
        'park': ['Central Park', 'Green Space', 'Nature Walk', 'City Gardens'],
        'museum': ['Art Gallery', 'History Museum', 'Science Center', 'Culture House'],
        'shopping': ['City Mall', 'Local Market', 'Shopping Center', 'Boutique Row']
    }
    
    for i in range(200):
        category = categories[i % len(categories)]
        city_name, (base_lat, base_lng) = list(cities.items())[i % len(cities)]
        
        spot = {
            'id': str(uuid.uuid4()),
            'external_id': f'google_place_{i}',
            'name': f'{spot_names[category][i % len(spot_names[category])]} - {city_name}',
            'category': category,
            'rating': 3.0 + (i % 20) / 10.0,  # 3.0 to 5.0
            'price_level': (i % 4) + 1,
            'address': f'{200 + i} {category.title()} Street, {city_name}',
            'lat': base_lat + (i % 30 - 15) * 0.003,
            'lng': base_lng + (i % 30 - 15) * 0.003,
            'photos': [
                f'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&auto=format&q=80',
                f'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format&q=80'
            ][i % 5:i % 5 + 1],
            'description': f'Great {category.replace("_", " ")} in {city_name}. Popular with locals!',
            'created_at': datetime.now().isoformat()
        }
        spots.append(spot)
    
    return spots

# Initialize mock data
MOCK_APARTMENTS = generate_mock_apartments()
MOCK_PEOPLE = generate_mock_people()
MOCK_SPOTS = generate_mock_spots()