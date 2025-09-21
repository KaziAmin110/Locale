import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
import pandas as pd

class MLEngine:
    def __init__(self):
        self.interest_categories = [
            'coffee', 'hiking', 'tech', 'food', 'music', 'sports', 
            'art', 'books', 'travel', 'fitness', 'nightlife', 'shopping'
        ]
    
    def encode_interests(self, interests):
        vector = [1 if interest in interests else 0 for interest in self.interest_categories]
        return vector
    
    def create_user_vector(self, user_data):
        age = user_data.get('age', 25)
        if age is None: age = 25
        age_norm = (age - 18) / (65 - 18)
        
        budget_max = user_data.get('budget_max', 2000)
        if budget_max is None: budget_max = 2000
        budget_norm = (budget_max - 500) / (5000 - 500)
        
        interests_vector = self.encode_interests(user_data.get('interests', []))
        
        feature_vector = [age_norm, budget_norm] + interests_vector
        return feature_vector
    
    def apartment_recommendations(self, user_vector, apartments_data, user_location):
        # ... (no changes needed here)
        recommendations = []
        
        for apt in apartments_data:
            distance = self.calculate_distance(user_location, [apt['lat'], apt['lng']])
            user_budget = user_vector[1] * (5000 - 500) + 500
            price_score = max(0, 1 - abs(apt['price'] - user_budget) / user_budget)
            distance_score = max(0, 1 - distance / 20)
            amenities_score = len(apt.get('amenities', [])) / 10
            total_score = (price_score * 0.4 + distance_score * 0.4 + amenities_score * 0.2)
            
            recommendations.append({'apartment_id': apt['id'], 'score': total_score, 'distance': distance})
        
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:20]

    def people_recommendations(self, user_vector, people_data, user_location):
        # ... (no changes needed here)
        recommendations = []
        
        for person in people_data:
            person_vector = self.create_user_vector(person)
            user_interests = user_vector[2:]
            person_interests = person_vector[2:]
            interest_similarity = cosine_similarity([user_interests], [person_interests])[0][0]
            age_diff = abs(user_vector[0] - person_vector[0])
            age_score = max(0, 1 - age_diff * 2)
            distance = self.calculate_distance(user_location, [person.get('lat'), person.get('lng')])
            distance_score = max(0, 1 - distance / 10)
            total_score = (interest_similarity * 0.5 + age_score * 0.3 + distance_score * 0.2)
            
            recommendations.append({'person_id': person['id'], 'score': total_score, 'interest_similarity': interest_similarity})
        
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:20]

    # --- MODIFIED --- Fixed bug and added user_interests parameter
    def spot_recommendations(self, user_vector, spots_data, user_location, user_interests):
        """Get spot recommendations using the actual user's interests."""
        recommendations = []
        
        # --- FIX --- user_interests is now passed in, not using the default list
        
        for spot in spots_data:
            category_score = 0
            spot_category = spot.get('category', '').lower()
            # Check if any of the user's actual interests are in the spot's category string
            if any(interest in spot_category for interest in user_interests):
                category_score = 0.8
            
            rating_score = spot.get('rating', 3.0) / 5.0
            
            distance = self.calculate_distance(user_location, [spot.get('lat'), spot.get('lng')])
            distance_score = max(0, 1 - distance / 15)
            
            total_score = (category_score * 0.4 + rating_score * 0.3 + distance_score * 0.3)
            
            recommendations.append({'spot_id': spot['id'], 'score': total_score, 'distance': distance})
        
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:20]
    
    def calculate_distance(self, coord1, coord2):
        if any(c is None for c in coord1) or any(c is None for c in coord2):
            return 20.0 # Return a large default distance if coordinates are missing
        
        lat_diff = coord1[0] - coord2[0]
        lng_diff = coord1[1] - coord2[1]
        return np.sqrt(lat_diff**2 + lng_diff**2) * 111