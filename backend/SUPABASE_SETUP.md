# Supabase Setup Guide

## Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings

## Step 2: Create Database Tables
Run these SQL commands in your Supabase SQL editor:

```sql
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
```

## Step 3: Create Environment File
Create a `.env` file in the backend directory with:

```
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_KEY=your_supabase_anon_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
JWT_SECRET_KEY=your_jwt_secret_key_here
```

## Step 4: Run the Mock Data Insertion Script
```bash
cd /Users/madhav/Documents/projects/SASE_Hack/Locale/backend
python3 insert_mock_data.py
```

This will populate your Supabase database with:
- 50 apartments across 4 cities (Austin, San Francisco, New York, Seattle)
- 100 people profiles
- 200 local spots (coffee shops, restaurants, bars, etc.)
