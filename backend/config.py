import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    RENTSPREE_API_KEY = os.getenv('RENTSPREE_API_KEY')
    RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
    GOOGLE_PLACES_API_KEY = os.getenv('GOOGLE_PLACES_API_KEY')
    YELP_API_KEY = os.getenv('YELP_API_KEY')
    GENERATED_PHOTOS_API_KEY = os.getenv('GENERATED_PHOTOS_API_KEY')
    ENABLE_REAL_APIS = os.getenv('ENABLE_REAL_APIS', 'false').lower() == 'true'
