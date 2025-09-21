"""
Photo Service - Centralized photo URL management
Uses Cloudinary for reliable, high-quality photos
"""

class PhotoService:
    # Cloudinary base URL - replace 'your-cloud-name' with your actual Cloudinary cloud name
    CLOUDINARY_BASE = "https://res.cloudinary.com/your-cloud-name/image/upload"
    
    @staticmethod
    def get_cloudinary_url(image_id, width=400, height=400, crop="fill", gravity="face"):
        """
        Generate Cloudinary URL with transformations
        """
        return f"{PhotoService.CLOUDINARY_BASE}/w_{width},h_{height},c_{crop},g_{gravity}/{image_id}"
    
    @staticmethod
    def get_people_photos():
        """
        Get array of reliable people photos from Cloudinary
        Using your own Cloudinary photos as primary fallback
        """
        # Your actual Cloudinary photos as primary fallback
        your_photos = [
            "https://res.cloudinary.com/dya4qw9dt/image/upload/v1758482549/IMG_0195_hlfrsh.jpg",  # Madhav Khanal
            "https://res.cloudinary.com/dya4qw9dt/image/upload/v1758482696/1688351991635_ctkd7n.jpg",  # Kazi Amin
            "https://res.cloudinary.com/dya4qw9dt/image/upload/v1758482798/1675407865113_lzvg8f.jpg",  # Mei Bao He
        ]
        
        # Additional reliable Unsplash photos as secondary fallback
        additional_photos = [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
            "https://images.unsplash.com/photo-1494790108755-2616b5c0804d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
        ]
        
        # Combine your photos first, then additional photos
        return your_photos + additional_photos
    
    @staticmethod
    def get_apartment_photos():
        """
        Get array of reliable apartment photos
        """
        return [
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&auto=format&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format&q=80",
            "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&h=400&fit=crop&auto=format&q=80",
            "https://images.unsplash.com/photo-1560448204-f65d4d8b4f07?w=600&h=400&fit=crop&auto=format&q=80",
            "https://images.unsplash.com/photo-1560448204-17b6d79364e9?w=600&h=400&fit=crop&auto=format&q=80",
        ]
    
    @staticmethod
    def get_spot_photos():
        """
        Get array of reliable spot photos
        """
        return [
            "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop&auto=format&q=80",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format&q=80",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format&q=80",
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop&auto=format&q=80",
            "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop&auto=format&q=80",
        ]
    
    @staticmethod
    def get_random_photos(photo_type="people", count=2):
        """
        Get random photos from a specific category
        """
        import random
        
        if photo_type == "people":
            photos = PhotoService.get_people_photos()
        elif photo_type == "apartment":
            photos = PhotoService.get_apartment_photos()
        elif photo_type == "spot":
            photos = PhotoService.get_spot_photos()
        else:
            photos = PhotoService.get_people_photos()
        
        return random.sample(photos, min(count, len(photos)))
    
    @staticmethod
    def get_cloudinary_photos(cloud_name, folder="sample_people", count=2):
        """
        Get photos from your Cloudinary account
        Replace 'your-cloud-name' with your actual cloud name
        """
        import random
        
        # Example Cloudinary URLs - replace with your actual setup
        base_url = f"https://res.cloudinary.com/{cloud_name}/image/upload"
        
        # You can upload your photos to Cloudinary and use these patterns:
        # - w_400,h_400,c_fill,g_face for people photos (face-focused)
        # - w_600,h_400,c_fill for apartments/spots
        
        sample_photos = [
            f"{base_url}/w_400,h_400,c_fill,g_face/{folder}/photo1.jpg",
            f"{base_url}/w_400,h_400,c_fill,g_face/{folder}/photo2.jpg",
            f"{base_url}/w_400,h_400,c_fill,g_face/{folder}/photo3.jpg",
            f"{base_url}/w_400,h_400,c_fill,g_face/{folder}/photo4.jpg",
            f"{base_url}/w_400,h_400,c_fill,g_face/{folder}/photo5.jpg",
        ]
        
        return random.sample(sample_photos, min(count, len(sample_photos)))
