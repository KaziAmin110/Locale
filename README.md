# 🏙️ CityMate

Discover your next home, friend, and neighborhood spot—all in one swipe.

CityMate is an intelligent web application designed to reinvent the urban living experience. It combines a familiar Tinder-style swiping interface with a powerful, multi-faceted discovery engine, helping users find not just a place to live, but a community to be a part of.

Discover exclusive properties, connect with potential roommates, and find the perfect place to call home with our intelligent, personalized platform.

-----

## ✨ Key Features

CityMate goes beyond a simple apartment finder. It's a 360-degree tool for your new life.

  * **Tinder-style Tri-Discovery:** Swipe through three distinct categories, all from one clean interface:
      * 🏠 **Apartments:** Browse real-time property listings.
      * 🧑‍🤝‍🧑 **People:** Discover potential roommates and new friends who share your interests.
      * ☕ **Spots:** Find popular local coffee shops, parks, gyms, and nightlife in your area.
  * **Intelligent Matching:** Our backend **Machine Learning** engine (using **Scikit-learn**) analyzes your profile, interests, and budget to create a personalized vector, delivering highly relevant recommendations via `cosine_similarity`.
  * **Dynamic Data Ingestion:**
      * **Web Scraping:** Apartment listings are dynamically scraped from real-estate sites like Redfin using **Selenium** and **BeautifulSoup**.
      * **External APIs:** Local spot discovery is powered by the **Google Places API** and **Yelp API**.
  * **Seamless Onboarding:** A smooth, multi-step onboarding process captures user preferences for location, budget, lifestyle interests, and more.
  * **Integrated Chat:** Once you match with a person or property manager, you can start a conversation immediately within the app.
  * **Secure Authentication:** Features secure and simple login/registration using email/password or **Google OAuth**, managed with **Flask-JWT-Extended**.
  * **Interactive Maps:** Visualize apartment and spot locations with an integrated **Google Maps API** component, allowing you to check the map view directly from the swipe card.

-----

## 🚀 Tech Stack

This project is a full-stack application built with a modern, high-performance tech stack.

| Frontend | Backend |
| :--- | :--- |
| **Next.js 15 (Turbopack)** | **Python 3.11** |
| **React 18** | **Flask** |
| **TypeScript** | **Supabase (PostgreSQL)** |
| **Tailwind CSS** | **Scikit-learn (ML)** |
| **Framer Motion** | **Pandas & NumPy** |
| **Google Maps API** | **Selenium & BeautifulSoup4** |
| | **Flask-JWT-Extended** |
| | **Google Auth & Places API** |
| | **Yelp API** |

-----

## 🔧 Architecture

CityMate uses a monorepo structure with a **Next.js (React) frontend** and a **Flask (Python) backend**.

  * **Frontend (`/frontend`):** A fully-responsive SPA built with Next.js 15 (using Turbopack) and styled with Tailwind CSS. It communicates with the backend via a REST API.
  * **Backend (`/backend`):** A robust REST API built with Flask. It handles all business logic, serves ML recommendations, and securely interacts with the database.
  * **Database:** A **Supabase** (PostgreSQL) instance stores all user data, listings, swipe history, and matches. The full schema is available in `backend/SUPABASE_SETUP.md`.
  * **ML Engine (`backend/services/ml_engine.py`):** A `scikit-learn` model generates feature vectors for users, apartments, and spots and calculates similarity scores to create personalized feeds.
  * **Data Ingestion:** The app uses a hybrid approach:
      * Real-time API calls to Google Places and Yelp for local spots.
      * Scheduled (or on-demand) web scraping with Selenium for apartment listings to ensure fresh data.

-----

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js (v18+)
  * Python (v3.11+) and `pip`
  * A [Supabase](https://supabase.com/) account (for the PostgreSQL database)
  * A [Google Cloud Platform](https://console.cloud.google.com/) account (for Google Auth & Maps/Places APIs)

### 1\. Backend Setup

The backend server runs on `http://localhost:5003`.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Set up your environment variables
# This will create a .env template.
python3 setup_env.py

# 4. Edit the new .env file with your credentials:
#    - SUPABASE_URL (from your Supabase project)
#    - SUPABASE_KEY (from your Supabase project)
#    - GOOGLE_CLIENT_ID (from GCP)
#    - GOOGLE_CLIENT_SECRET (from GCP)
#    - JWT_SECRET_KEY (a long, random string you create)
#    - GOOGLE_PLACES_API_KEY (from GCP)

# 5. Set up the database schema
#    - Go to your Supabase project's SQL Editor.
#    - Copy and run the SQL commands from: backend/SUPABASE_SETUP.md

# 6. (Optional) Populate the database with mock data
python3 insert_mock_data.py

# 7. Run the Flask server
python3 app.py
```

### 2\. Frontend Setup

The frontend server runs on `http://localhost:3000`.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install NPM packages
npm install

# 3. Create a local environment file
cp backend/.env.local frontend/.env.local

# 4. Edit frontend/.env.local with your Google Maps API key:
#    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# 5. Run the Next.js development server (with Turbopack)
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the application live\!
