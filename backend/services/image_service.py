import requests
import uuid
from supabase import create_client
from config import Config

class ImageService:
    def __init__(self):
        self.supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
    
    @staticmethod
    def generate_synthetic_people_photos():
        """Generate realistic photos for synthetic users"""
        # AI-generated faces (ethical, royalty-free)
        photo_sources = [
            # ThisPersonDoesNotExist API
            "https://thispersondoesnotexist.com/image",
            # Generated Photos API (requires key)
            f"https://api.generated.photos/api/v1/faces?api_key={Config.GENERATED_PHOTOS_API_KEY}&age=young-adult&gender=male",
            f"https://api.generated.photos/api/v1/faces?api_key={Config.GENERATED_PHOTOS_API_KEY}&age=young-adult&gender=female",
            
            # Curated stock photos (diverse, professional)
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1494790108755-2616b5c0804d?w=400&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face"
        ]
        
        import random
        return random.sample(photo_sources, k=min(3, len(photo_sources)))
    
    def upload_user_photo(self, user_id, image_data, filename):
        """Upload user photo to Supabase Storage"""
        try:
            # Generate unique filename
            file_extension = filename.split('.')[-1] if '.' in filename else 'jpg'
            unique_filename = f"{user_id}/photo_{str(uuid.uuid4())[:8]}.{file_extension}"
            
            # Upload to Supabase Storage
            result = self.supabase.storage.from_('user-photos').upload(
                unique_filename,
                image_data,
                file_options={"content-type": f"image/{file_extension}"}
            )
            
            if result:
                # Get public URL
                public_url = self.supabase.storage.from_('user-photos').get_public_url(unique_filename)
                return {"success": True, "url": public_url}
            else:
                return {"success": False, "error": "Upload failed"}
                
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def validate_image_url(url):
        """Validate that an image URL is accessible"""
        try:
            response = requests.head(url, timeout=5)
            return response.status_code == 200
        except:
            return False