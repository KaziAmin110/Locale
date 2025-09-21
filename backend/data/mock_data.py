import uuid
from datetime import datetime

def get_reliable_apartment_photos(index):
    """Get reliable apartment photos using photo service"""
    from services.photo_service import PhotoService
    
    # Get 3 random apartment photos
    return PhotoService.get_random_photos("apartment", 3)

def get_reliable_person_photos(index):
    """Get reliable person photos using photo service"""
    from services.photo_service import PhotoService
    
    # Get 2 random photos from the photo service
    return PhotoService.get_random_photos("people", 2)

def get_reliable_spot_photos(index):
    """Get reliable spot photos using photo service"""
    from services.photo_service import PhotoService
    
    # Get 2 random spot photos
    return PhotoService.get_random_photos("spot", 2)

def generate_mock_apartments():
    """Generate mock apartment data with reliable images"""
    apartments = []
    cities = {
        'Austin, TX': (30.2672, -97.7431),
        'San Francisco, CA': (37.7749, -122.4194),
        'New York, NY': (40.7128, -74.0060),
        'Seattle, WA': (47.6062, -122.3321)
    }
    
    apartment_types = [
        'Modern Studio', 'Luxury 1BR', 'Spacious 2BR', 'Cozy 1BR', 
        'Designer Studio', 'Renovated 2BR', 'Loft-Style 1BR', 'Contemporary 3BR'
    ]
    
    for i in range(50):
        city_name, (base_lat, base_lng) = list(cities.items())[i % len(cities)]
        apt_type = apartment_types[i % len(apartment_types)]
        
        apartment = {
            'id': str(uuid.uuid4()),
            'title': f'{apt_type} in {city_name.split(",")[0]}',
            'description': f'Beautiful {apt_type.lower()} with great amenities in downtown {city_name.split(",")[0]}. Modern finishes and great location.',
            'price': 1000 + (i * 50) % 3000,
            'bedrooms': (i % 3) + 1,
            'bathrooms': 1 + (i % 2) * 0.5,
            'square_feet': 600 + (i * 100) % 1000,
            'address': f'{100 + i} Main Street, {city_name}',
            'lat': base_lat + (i % 10 - 5) * 0.01,
            'lng': base_lng + (i % 10 - 5) * 0.01,
            'photos': get_reliable_apartment_photos(i),
            'amenities': ['Parking', 'Gym', 'Pool', 'Laundry', 'Balcony'][:(i % 4) + 2],
            'contact_info': {
                'phone': f'555-{1000 + i}',
                'email': f'landlord{i}@example.com'
            },
            'match_score': round(0.7 + (i % 25) * 0.01, 2),
            'created_at': datetime.now().isoformat()
        }
        apartments.append(apartment)
    
    return apartments

def generate_mock_people():
    """Generate mock people data with reliable images"""
    people = []
    first_names = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Taylor', 'Sam', 'Jamie', 'Avery', 'Blake']
    last_names = ['Johnson', 'Smith', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas']
    interests_pool = ['Coffee', 'Hiking', 'Technology', 'Food', 'Music', 'Sports', 'Art', 'Books', 'Travel', 'Fitness']
    cities = {
        'Austin, TX': (30.2672, -97.7431),
        'San Francisco, CA': (37.7749, -122.4194),
        'New York, NY': (40.7128, -74.0060),
        'Seattle, WA': (47.6062, -122.3321)
    }
    
    bios = [
        "Love exploring new places and meeting interesting people!",
        "Coffee enthusiast and weekend hiker. Always up for an adventure!",
        "New to the city and looking to make genuine connections.",
        "Passionate about good food and great conversations.",
        "Work in tech, play in nature. Best of both worlds!",
        "Music lover and art enthusiast. Let's explore the city together!",
        "Fitness enthusiast who also loves trying new restaurants.",
        "Bookworm by day, social butterfly by night.",
        "Travel addict planning my next adventure. Join me?",
        "Local foodie who knows all the best hidden gems!"
    ]
    
    for i in range(100):
        city_name, (base_lat, base_lng) = list(cities.items())[i % len(cities)]
        first_name = first_names[i % len(first_names)]
        last_name = last_names[(i // len(first_names)) % len(last_names)]
        
        person = {
            'id': str(uuid.uuid4()),
            'name': f'{first_name} {last_name}',
            'age': 22 + (i % 15),
            'bio': bios[i % len(bios)],
            'interests': interests_pool[(i % 3):(i % 3) + 3 + (i % 2)],
            'photos': get_reliable_person_photos(i),
            'lat': base_lat + (i % 20 - 10) * 0.005,
            'lng': base_lng + (i % 20 - 10) * 0.005,
            'city': city_name,
            'match_score': round(0.75 + (i % 20) * 0.01, 2),
            'created_at': datetime.now().isoformat()
        }
        people.append(person)
    
    return people

def generate_mock_spots():
    """Generate mock local spots data with reliable images"""
    spots = []
    
    spot_data = {
        'coffee': [
            'Central Perk Cafe', 'Bean There Coffee', 'Grind Coffee House', 'Roast & Toast',
            'Morning Brew', 'Espresso Corner', 'The Daily Grind', 'Coffee Culture'
        ],
        'restaurant': [
            'Urban Kitchen', 'Local Flavors', 'City Bistro', 'Fresh Table',
            'The Garden Restaurant', 'Fusion Eats', 'Corner Deli', 'Gourmet Corner'
        ],
        'bar': [
            'The Social Club', 'Night Owl Bar', 'Craft House', 'Local Pub',
            'Rooftop Lounge', 'Happy Hour Spot', 'The Watering Hole', 'Cocktail Corner'
        ],
        'fitness': [
            'FitLife Gym', 'Power Fitness', 'Flex Studio', 'Strong Body Gym',
            'Yoga Zen', 'CrossFit Central', 'The Gym', 'Fitness First'
        ],
        'park': [
            'Central Park', 'Green Spaces', 'Nature Walk Park', 'City Gardens',
            'Riverside Park', 'Oak Tree Park', 'Sunset Park', 'Community Garden'
        ],
        'entertainment': [
            'City Cinema', 'The Theater', 'Game Zone', 'Entertainment Plaza',
            'Comedy Club', 'Music Venue', 'Sports Bar', 'Arcade Fun'
        ]
    }
    
    cities = {
        'Austin, TX': (30.2672, -97.7431),
        'San Francisco, CA': (37.7749, -122.4194),
        'New York, NY': (40.7128, -74.0060),
        'Seattle, WA': (47.6062, -122.3321)
    }
    
    all_categories = list(spot_data.keys())
    
    for i in range(200):
        category = all_categories[i % len(all_categories)]
        city_name, (base_lat, base_lng) = list(cities.items())[i % len(cities)]
        spot_names = spot_data[category]
        spot_name = spot_names[i % len(spot_names)]
        
        spot = {
            'id': str(uuid.uuid4()),
            'external_id': f'spot_{i}',
            'name': f'{spot_name}',
            'category': category,
            'rating': round(3.0 + (i % 20) / 10.0, 1),  # 3.0 to 5.0
            'price_level': (i % 4) + 1,
            'address': f'{200 + i} {category.title()} Street, {city_name}',
            'lat': base_lat + (i % 30 - 15) * 0.003,
            'lng': base_lng + (i % 30 - 15) * 0.003,
            'photos': get_reliable_spot_photos(i),
            'description': f'Popular {category} spot in {city_name.split(",")[0]}. Great atmosphere and friendly staff!',
            'match_score': round(0.7 + (i % 25) * 0.01, 2),
            'created_at': datetime.now().isoformat()
        }
        spots.append(spot)
    
    return spots

# Initialize mock data
MOCK_APARTMENTS = generate_mock_apartments()
MOCK_PEOPLE = generate_mock_people()
MOCK_SPOTS = generate_mock_spots()

print(f"Generated {len(MOCK_APARTMENTS)} apartments, {len(MOCK_PEOPLE)} people, {len(MOCK_SPOTS)} spots")