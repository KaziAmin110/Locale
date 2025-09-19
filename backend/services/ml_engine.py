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
        """Convert interest list to binary vector"""
        vector = [1 if interest in interests else 0 for interest in self.interest_categories]
        return vector
    
    def create_user_vector(self, user_data):
        """Create user feature vector for ML"""
        age_norm = (user_data.get('age', 25) - 18) / (65 - 18)  # Normalize age 18-65
        budget_norm = (user_data.get('budget_max', 2000) - 500) / (5000 - 500)  # Normalize budget
        interests_vector = self.encode_interests(user_data.get('interests', []))
        
        # Combine features: [age, budget, interests...]
        feature_vector = [age_norm, budget_norm] + interests_vector
        return feature_vector
    
    def apartment_recommendations(self, user_vector, apartments_data, user_location):
        """Get apartment recommendations using content-based filtering"""
        recommendations = []
        
        for apt in apartments_data:
            # Calculate distance (simplified)
            distance = self.calculate_distance(user_location, [apt['lat'], apt['lng']])
            
            # Price compatibility (closer to budget = higher score)
            user_budget = user_vector[1] * (5000 - 500) + 500  # Denormalize
            price_score = max(0, 1 - abs(apt['price'] - user_budget) / user_budget)
            
            # Distance score (closer = better)
            distance_score = max(0, 1 - distance / 20)  # 20km max
            
            # Amenities score (basic implementation)
            amenities_score = len(apt.get('amenities', [])) / 10  # Normalize by max amenities
            
            # Combined score
            total_score = (price_score * 0.4 + distance_score * 0.4 + amenities_score * 0.2)
            
            recommendations.append({
                'apartment_id': apt['id'],
                'score': total_score,
                'distance': distance
            })
        
        # Sort by score and return top recommendations
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:20]
    
    def people_recommendations(self, user_vector, people_data, user_location):
        """Get people recommendations using collaborative filtering"""
        recommendations = []
        
        for person in people_data:
            person_vector = self.create_user_vector(person)
            
            # Interest similarity
            user_interests = user_vector[2:]  # Skip age and budget
            person_interests = person_vector[2:]
            interest_similarity = cosine_similarity([user_interests], [person_interests])[0][0]
            
            # Age compatibility
            age_diff = abs(user_vector[0] - person_vector[0])
            age_score = max(0, 1 - age_diff * 2)  # Penalty for large age gaps
            
            # Distance score
            distance = self.calculate_distance(user_location, [person['lat'], person['lng']])
            distance_score = max(0, 1 - distance / 10)  # 10km max for people
            
            # Combined score
            total_score = (interest_similarity * 0.5 + age_score * 0.3 + distance_score * 0.2)
            
            recommendations.append({
                'person_id': person['id'],
                'score': total_score,
                'interest_similarity': interest_similarity
            })
        
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:20]
    
    def spot_recommendations(self, user_vector, spots_data, user_location):
        """Get spot recommendations using content-based filtering"""
        recommendations = []
        user_interests = self.interest_categories
        
        for spot in spots_data:
            # Category matching
            category_score = 0
            spot_category = spot.get('category', '').lower()
            if any(interest in spot_category for interest in user_interests):
                category_score = 0.8
            
            # Rating score
            rating_score = spot.get('rating', 3.0) / 5.0
            
            # Distance score
            distance = self.calculate_distance(user_location, [spot['lat'], spot['lng']])
            distance_score = max(0, 1 - distance / 15)  # 15km max for spots
            
            # Combined score
            total_score = (category_score * 0.4 + rating_score * 0.3 + distance_score * 0.3)
            
            recommendations.append({
                'spot_id': spot['id'],
                'score': total_score,
                'distance': distance
            })
        
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:20]
    
    def calculate_distance(self, coord1, coord2):
        """Calculate distance between two coordinates (simplified)"""
        lat_diff = coord1[0] - coord2[0]
        lng_diff = coord1[1] - coord2[1]
        return np.sqrt(lat_diff**2 + lng_diff**2) * 111  # Rough km conversion