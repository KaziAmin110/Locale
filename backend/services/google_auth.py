import requests
import json
from config import Config

class GoogleAuthService:
    @staticmethod
    def verify_google_token(id_token):
        """Verify Google ID token"""
        try:
            # Verify with Google's tokeninfo endpoint
            response = requests.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
            )
            
            if response.status_code == 200:
                token_info = response.json()
                
                # Verify the token is for our app
                if token_info.get('aud') != Config.GOOGLE_CLIENT_ID:
                    return {"success": False, "error": "Invalid token audience"}
                
                return {
                    "success": True,
                    "user_info": {
                        "email": token_info.get('email'),
                        "name": token_info.get('name'),
                        "picture": token_info.get('picture'),
                        "google_id": token_info.get('sub')
                    }
                }
            else:
                return {"success": False, "error": "Token verification failed"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def get_user_info_from_access_token(access_token):
        """Get user info from Google access token"""
        try:
            # Get user info from Google API
            response = requests.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code == 200:
                user_info = response.json()
                return {
                    "success": True,
                    "user_info": {
                        "email": user_info.get('email'),
                        "name": user_info.get('name'),
                        "picture": user_info.get('picture'),
                        "google_id": user_info.get('id')
                    }
                }
            else:
                return {"success": False, "error": "Failed to get user info"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def exchange_code_for_token(code, redirect_uri):
        """Exchange authorization code for access token"""
        try:
            token_url = 'https://oauth2.googleapis.com/token'
            token_data = {
                'client_id': Config.GOOGLE_CLIENT_ID,
                'client_secret': Config.GOOGLE_CLIENT_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': redirect_uri
            }
            
            response = requests.post(token_url, data=token_data)
            
            if response.status_code == 200:
                token_response = response.json()
                return {
                    "success": True,
                    "access_token": token_response.get('access_token'),
                    "id_token": token_response.get('id_token')
                }
            else:
                return {"success": False, "error": f"Failed to get access token: {response.text}"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def get_google_auth_url(redirect_uri):
        """Generate Google OAuth URL"""
        base_url = "https://accounts.google.com/o/oauth2/v2/auth"
        params = {
            "client_id": Config.GOOGLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "consent"
        }
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{base_url}?{query_string}"
