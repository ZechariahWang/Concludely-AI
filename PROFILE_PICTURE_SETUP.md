# Profile Picture Setup Guide

## 1. Install Dependencies

```bash
npm install expo-image-picker
```

## 2. Create Appwrite Storage Bucket

### In Appwrite Console:

1. **Navigate to Storage** in the left sidebar
2. **Click "Create Bucket"**
3. **Bucket Details:**
   - **Name**: `Profile Pictures`
   - **Bucket ID**: `profile-pictures` (must match BUCKET_ID in services/profilePicture.js)
   - **Maximum file size**: `5MB` (recommended)
   - **Allowed file extensions**: `jpg,jpeg,png,gif,webp`

### Set Bucket Permissions:

1. **Go to your bucket settings**
2. **In Permissions section**, add these roles:
   - **Role**: Select "All users"
   - **Permissions**:
     - ✅ **Create** - Allow users to upload profile pictures
     - ✅ **Read** - Allow users to view profile pictures  
     - ✅ **Update** - Allow users to update their pictures
     - ✅ **Delete** - Allow users to delete their pictures

3. **Enable "File security"** - This ensures users can only manage their own files

## 3. Update Database Schema

Add these fields to your **users** collection (if not already present):

| Field Name | Type | Required | Default |
|------------|------|----------|---------|
| profilePictureFileId | String | No | - |

The `profilePicture` field already exists in your schema.

## 4. Test the Feature

1. **Run your app**: `npm start`
2. **Go to Profile page**
3. **Click "Edit"**
4. **Tap "Change Photo"** and select:
   - Camera (take new photo)
   - Gallery (choose existing)  
   - Remove Photo (delete current)

## 5. Features Included

- **Image Upload**: Camera and gallery selection
- **Image Cropping**: 1:1 aspect ratio with editing
- **File Management**: Automatic cleanup of old images
- **Permissions**: User-specific file access
- **UI Integration**: Loading states and error handling
- **Storage Optimization**: Image compression (80% quality)

## 6. File Structure

```
services/
├── profilePicture.js    # Appwrite Storage operations
└── userProfile.js       # Enhanced with picture methods

components/
└── Profile.js          # Updated with image picker

contexts/
└── AuthContext.js      # Added picture context methods
```

## 7. Security Features

- **User-specific permissions**: Users can only access their own files
- **File type validation**: Only image files allowed
- **Size limits**: Configurable max file size
- **Automatic cleanup**: Old pictures deleted when new ones uploaded

## Troubleshooting

- **Permission denied**: Check bucket permissions are set correctly
- **File not found**: Verify BUCKET_ID matches between code and Appwrite
- **Upload fails**: Check file size and type restrictions
- **Camera not working**: Ensure device permissions granted