import os

def create_env_template():
    env_content = """# Database Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here

# Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key-here-make-it-long-and-random
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Real Estate APIs (Optional - for production)
RENTSPREE_API_KEY=your-rentspree-key
RAPIDAPI_KEY=your-rapidapi-key

# Places APIs (Optional - for production)
GOOGLE_PLACES_API_KEY=your-google-places-key
YELP_API_KEY=your-yelp-key

# Image APIs (Optional - for production)
GENERATED_PHOTOS_API_KEY=your-generated-photos-key

# Feature Flags
ENABLE_REAL_APIS=false
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("Created .env template file")
    print("\nPlease edit .env file with your actual values:")
    print("   1. SUPABASE_URL: Get from your Supabase project settings")
    print("   2. SUPABASE_KEY: Get from your Supabase project settings")
    print("   3. JWT_SECRET_KEY: Make this a long random string")
    print("   4. Other keys are optional for now")

def check_current_env():
    if not os.path.exists('.env'):
        print("No .env file found")
        return False
    
    with open('.env', 'r') as f:
        content = f.read()
    
    if 'your-supabase-url' in content or 'your_supabase_url' in content:
        print(".env file still has placeholder values")
        return False
    
    print(".env file exists and appears to be configured")
    return True

def main():
    print("Environment Setup Helper")
    print("=" * 30)
    
    if check_current_env():
        print("\nYour environment looks good!")
        print("You can now run: python3 fix_database.py")
    else:
        print("\nSetting up environment...")
        create_env_template()
        print("\nPlease update .env file with real values before proceeding")

if __name__ == "__main__":
    main()
