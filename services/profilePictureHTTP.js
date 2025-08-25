import { account } from '../appwrite';

const BUCKET_ID = 'profile-pictures';
const PROJECT_ID = '68aa6487001bd857be83';
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';

export class ProfilePictureHTTPService {
    static async uploadProfilePicture(file, userId) {
        try {
            // Generate a unique file ID
            const fileId = `profile_${userId}_${Date.now()}`;
            
            console.log('HTTP Upload - File:', file);
            console.log('HTTP Upload - File ID:', fileId);
            
            // Get current session for authentication
            const session = await account.getSession('current');
            console.log('Session:', session);
            
            // Create FormData
            const formData = new FormData();
            formData.append('fileId', fileId);
            formData.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.name,
            });
            
            // Make direct HTTP request to Appwrite
            const response = await fetch(`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files`, {
                method: 'POST',
                headers: {
                    'X-Appwrite-Project': PROJECT_ID,
                    'X-Appwrite-JWT': session.providerAccessToken || session.$id,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
            
            console.log('HTTP Response status:', response.status);
            const responseText = await response.text();
            console.log('HTTP Response:', responseText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${responseText}`);
            }
            
            const result = JSON.parse(responseText);
            const fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
            
            return { 
                success: true, 
                data: { 
                    fileId: result.$id || fileId, 
                    url: fileUrl 
                } 
            };
        } catch (error) {
            console.error('HTTP Upload error:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async deleteProfilePicture(fileId) {
        try {
            const session = await account.getSession('current');
            
            const response = await fetch(`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'X-Appwrite-Project': PROJECT_ID,
                    'X-Appwrite-JWT': session.providerAccessToken || session.$id,
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }
            
            return { success: true };
        } catch (error) {
            console.error('HTTP Delete error:', error);
            return { success: false, error: error.message };
        }
    }
    
    static getFilePreview(fileId, width = 300, height = 300) {
        return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${PROJECT_ID}&width=${width}&height=${height}`;
    }
}