import { storage, account, config } from '../../config/appwrite';
import { ID, Permission, Role } from 'appwrite';
import * as FileSystem from 'expo-file-system';

const BUCKET_ID = config.profilePicturesBucketId;

export class ProfilePictureService {
    static async uploadProfilePicture(file, userId) {
        try {
            // Create a shorter fileId to avoid length issues
            const fileId = `img_${Date.now()}`;
            
            console.log('Uploading file to Appwrite:', file);
            console.log('Bucket ID:', BUCKET_ID);
            console.log('File ID:', fileId);
            console.log('User ID:', userId);
            
            // For React Native, try using the file URI directly in a FormData-like structure
            // that Appwrite's React Native SDK can understand
            const fileForUpload = {
                uri: file.uri,
                name: file.name,
                type: file.type,
            };
            
            console.log('File for upload:', fileForUpload);
            
            // Try uploading without permissions first (rely on bucket-level permissions)
            try {
                const response = await storage.createFile(
                    BUCKET_ID,
                    fileId,
                    fileForUpload
                );
                
                console.log('Upload response:', response);
                
                const fileUrl = this.getFilePreview(fileId);
                return { 
                    success: true, 
                    data: { 
                        fileId: response.$id, 
                        url: fileUrl 
                    } 
                };
            } catch (uploadError) {
                console.log('Direct upload failed, trying with manual fetch...');
                
                // If direct SDK fails, use manual fetch with proper FormData
                const formData = new FormData();
                formData.append('fileId', fileId);
                formData.append('file', {
                    uri: file.uri,
                    type: file.type,
                    name: file.name,
                });
                
                // Get current user session for auth
                const user = await account.get();
                console.log('Current user for upload:', user.$id);
                
                // Make direct API call
                const uploadUrl = `${config.endpoint}/storage/buckets/${BUCKET_ID}/files`;
                
                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: {
                        'X-Appwrite-Project': config.projectId,
                        // Don't set Content-Type for FormData - let browser set it
                    },
                    body: formData,
                });
                
                console.log('Manual upload response status:', response.status);
                const responseText = await response.text();
                console.log('Manual upload response:', responseText);
                
                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.status} - ${responseText}`);
                }
                
                const result = JSON.parse(responseText);
                const fileUrl = this.getFilePreview(result.$id);
                
                return { 
                    success: true, 
                    data: { 
                        fileId: result.$id, 
                        url: fileUrl 
                    } 
                };
            }
            
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            console.error('Error details:', error);
            console.error('Error code:', error.code);
            console.error('Error type:', error.type);
            console.error('File object:', file);
            console.error('Bucket ID:', BUCKET_ID);
            
            return { success: false, error: error.message };
        }
    }

    static async deleteProfilePicture(fileId) {
        try {
            await storage.deleteFile(BUCKET_ID, fileId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting profile picture:', error);
            return { success: false, error: error.message };
        }
    }

    static getFilePreview(fileId, width = 300, height = 300) {
        // Use getFileView URL instead of getFilePreview for better compatibility
        return `${config.endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${config.projectId}`;
    }

    static getFileView(fileId) {
        return `${config.endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${config.projectId}`;
    }

    static async updateProfilePicture(oldFileId, newFile, userId) {
        try {
            if (oldFileId) {
                await this.deleteProfilePicture(oldFileId);
            }
            
            return await this.uploadProfilePicture(newFile, userId);
        } catch (error) {
            console.error('Error updating profile picture:', error);
            return { success: false, error: error.message };
        }
    }
}