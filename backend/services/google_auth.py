import requests
from config import Config

class GoogleAuthService:
    @staticmethod
    def verify_google_token(id_token):
        """Verify Google ID token"""
        try:
            # For development, we'll skip verification
            # In production, verify with Google's tokeninfo endpoint
            return {
                "success": True,
                "user_info": {
                    "email": "test@example.com",
                    "name": "Test User",
                    "picture": "https://via.placeholder.com/150"
                }
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def get_user_info_from_access_token(access_token):
        """Get user info from Google access token"""
        try:
            # For development, return mock data
            return {
                "success": True,
                "user_info": {
                    "email": "test@example.com",
                    "name": "Test User",
                    "picture": "https://via.placeholder.com/150"
                }
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
