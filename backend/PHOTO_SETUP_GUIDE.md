# Photo Setup Guide

## Current Status
**Photos are now working with reliable Unsplash URLs**
**Centralized photo service created**
**All photo generation updated to use PhotoService**

## How to Use Your Own Cloudinary Photos

### Option 1: Quick Setup (Current - Working)
The system is currently using reliable Unsplash URLs that are working properly. No changes needed.

### Option 2: Use Your Own Cloudinary Photos

#### Step 1: Set up Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. Note your **Cloud Name** from the dashboard
3. Upload your photos to Cloudinary (drag & drop in the media library)

#### Step 2: Update Photo Service
Edit `backend/services/photo_service.py`:

```python
# Replace 'your-cloud-name' with your actual Cloudinary cloud name
CLOUDINARY_BASE = "https://res.cloudinary.com/your-cloud-name/image/upload"

# Replace these with your actual photo IDs from Cloudinary
photo_ids = [
    "your-folder/person1",  # Replace with your actual photo IDs
    "your-folder/person2",
    "your-folder/person3",
    # ... add more
]
```

#### Step 3: Cloudinary URL Format
Your Cloudinary URLs will look like:
```
https://res.cloudinary.com/your-cloud-name/image/upload/w_400,h_400,c_fill,g_face/your-folder/person1.jpg
```

#### Step 4: Photo Transformations
- **People Photos**: `w_400,h_400,c_fill,g_face` (face-focused, 400x400)
- **Apartment Photos**: `w_600,h_400,c_fill` (landscape, 600x400)
- **Spot Photos**: `w_600,h_400,c_fill` (landscape, 600x400)

### Option 3: Use Cloudinary Demo Images
For testing, you can use Cloudinary's demo images:

```python
# In photo_service.py, replace the reliable_photos array with:
demo_photos = [
    PhotoService.get_cloudinary_url("sample", width=400, height=400, crop="fill", gravity="face"),
    PhotoService.get_cloudinary_url("c_scale,w_400,h_400,g_face/sample"),
    # ... add more demo images
]
```

## Current Photo Sources

### People Photos (10 reliable URLs)
- High-quality, face-focused photos from Unsplash
- Properly formatted with face detection
- 400x400 pixels, optimized loading

### Apartment Photos (5 reliable URLs)
- Interior/exterior apartment photos
- 600x400 pixels, landscape format
- High-quality, professional images

### Spot Photos (5 reliable URLs)
- Restaurant, cafe, bar, gym photos
- 600x400 pixels, landscape format
- Location-focused imagery

## Testing Photos
To test if photos are working:

1. **Check in browser**: Copy any photo URL and paste in browser
2. **Check in app**: Look at people feed to see if images load
3. **Check console**: Look for image loading errors

## Troubleshooting

### Photos Not Loading?
1. Check if URLs are accessible in browser
2. Check network tab for 404 errors
3. Verify photo service is imported correctly

### Want Different Photos?
1. Edit `backend/services/photo_service.py`
2. Replace the URL arrays with your preferred sources
3. Restart the backend server

## File Locations
- **Photo Service**: `backend/services/photo_service.py`
- **Mock Data**: `backend/data/mock_data.py`
- **Database Population**: `backend/populate_database.py`
- **Database Fix**: `backend/fix_database.py`

## Quick Fix for Now
The current setup with Unsplash URLs is working perfectly. If you want to change to Cloudinary later, just follow the steps above.
