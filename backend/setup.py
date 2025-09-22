#!/usr/bin/env python3
"""
Complete Database Setup Script
This script will guide you through setting up Supabase and populating it with mock data
"""

import os
import sys
from dotenv import load_dotenv

def create_env_file():
    """Create .env file with template"""
    env_content = """# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_KEY=your_supabase_anon_key_here

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here
"""
    
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write(env_content)
        print("Created .env template file")
        print("📝 Please edit .env file with your Supabase credentials")
        return False
    else:
        print(".env file already exists")
        return True

def check_env_variables():
    """Check if environment variables are set"""
    load_dotenv()
    
    required_vars = ['SUPABASE_URL', 'SUPABASE_KEY']
    missing_vars = []
    
    for var in required_vars:
        value = os.getenv(var)
        if not value or value.startswith('your_'):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"Please set these variables in .env: {', '.join(missing_vars)}")
        return False
    
    print("Environment variables configured")
    return True

def run_sql_schema():
    """Display SQL schema for user to run in Supabase"""
    sql_schema = """
-- Run this SQL in your Supabase SQL Editor:

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    age INTEGER,
    bio TEXT,
    city TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    budget_min INTEGER,
    budget_max INTEGER,
    interests TEXT[],
    photos TEXT[],
    onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apartments table
CREATE TABLE apartments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    bedrooms INTEGER,
    bathrooms DECIMAL(3, 1),
    square_feet INTEGER,
    address TEXT NOT NULL,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    photos TEXT[],
    amenities TEXT[],
    contact_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- People table
CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER,
    bio TEXT,
    interests TEXT[],
    photos TEXT[],
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    is_synthetic BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spots table
CREATE TABLE spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    rating DECIMAL(2, 1),
    price_level INTEGER,
    address TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    photos TEXT[],
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swipe tables
CREATE TABLE apartment_swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    apartment_id UUID REFERENCES apartments(id),
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, apartment_id)
);

CREATE TABLE people_swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    swiper_id UUID REFERENCES users(id),
    swiped_id UUID REFERENCES people(id),
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(swiper_id, swiped_id)
);

CREATE TABLE spot_swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    spot_id UUID REFERENCES spots(id),
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, spot_id)
);

-- Match tables
CREATE TABLE apartment_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    apartment_id UUID REFERENCES apartments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, apartment_id)
);

CREATE TABLE people_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID REFERENCES users(id),
    user2_id UUID REFERENCES people(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user1_id, user2_id)
);

CREATE TABLE spot_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    spot_id UUID REFERENCES spots(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, spot_id)
);

-- Chat tables
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID REFERENCES users(id),
    user2_id UUID REFERENCES people(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    sender_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartment_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
"""
    
    print("📋 SQL Schema:")
    print(sql_schema)
    print("\nPlease copy and run this SQL in your Supabase SQL Editor")
    input("Press Enter when you've created the tables...")

def main():
    """Main setup function"""
    print("CityMate Database Setup")
    print("=" * 40)
    
    # Step 1: Create .env file
    print("\n1. Creating environment file...")
    env_ready = create_env_file()
    
    if not env_ready:
        print("\n📝 Next steps:")
        print("1. Go to supabase.com and create a new project")
        print("2. Get your project URL and anon key from Settings > API")
        print("3. Edit the .env file with your credentials")
        print("4. Run this script again")
        return
    
    # Step 2: Check environment variables
    print("\n2. Checking environment variables...")
    if not check_env_variables():
        print("\n📝 Please edit .env file with your Supabase credentials and run again")
        return
    
    # Step 3: Display SQL schema
    print("\n3. Database schema setup...")
    run_sql_schema()
    
    # Step 4: Populate database
    print("\n4. Populating database with mock data...")
    try:
        from populate_database import main as populate_main
        if populate_main():
            print("\nSetup complete!")
            print("\nYour database is ready with:")
            print("  • 20 realistic users")
            print("  • 50 apartments")
            print("  • 100 people profiles")
            print("  • 200 local spots")
            print("  • Realistic swipe patterns")
            print("  • Sample conversations")
            print("\nYou can now start your Flask app!")
            print("   python3 app.py")
        else:
            print("Database population failed")
    except ImportError:
        print("Could not import populate_database.py")
        print("Make sure the file exists and run: python3 populate_database.py")

if __name__ == "__main__":
    main()
