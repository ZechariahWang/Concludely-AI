import { databases, account, config } from '../../config/appwrite';
import { ID, Query, Permission, Role } from 'appwrite';
import { ProfilePictureService } from '../storage/profilePicture';

// Use configuration from environment variables
const { databaseId: DATABASE_ID, usersCollectionId: USERS_COLLECTION_ID, journalsCollectionId: JOURNALS_COLLECTION_ID } = config;

export class UserProfileService {
    // Get user profile data
    static async getUserProfile(userId) {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId
            );
            
            // Reconstruct preferences object from individual fields
            const profileData = {
                ...response,
                preferences: {
                    theme: response.theme || 'light',
                    notifications: response.notifications || true,
                    privacy: response.privacy || 'private'
                }
            };
            
            return { success: true, data: profileData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create or update user profile
    static async createUserProfile(userId, userData) {
        try {
            console.log('Creating user profile for userId:', userId);
            const preferences = userData.preferences || {
                theme: 'light',
                notifications: true,
                privacy: 'private'
            };

            const profileData = {
                userId: userId,
                name: userData.name,
                email: userData.email,
                profilePicture: userData.profilePicture || '',
                profilePictureFileId: userData.profilePictureFileId || '',
                bio: userData.bio || '',
                dateOfBirth: userData.dateOfBirth || '',
                theme: preferences.theme || 'light',
                notifications: preferences.notifications || true,
                privacy: preferences.privacy || 'private',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            console.log('Profile data:', profileData);

            const response = await databases.createDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId,
                profileData
            );
            console.log('Profile created successfully:', response);
            return { success: true, data: response };
        } catch (error) {
            console.error('Error creating user profile:', error);
            console.error('Error code:', error.code);
            console.error('Error type:', error.type);
            return { success: false, error: error.message };
        }
    }

    // Update user profile
    static async updateUserProfile(userId, updates) {
        try {
            // Convert preferences object to individual fields if it exists
            const updateData = { ...updates };
            if (updates.preferences) {
                updateData.theme = updates.preferences.theme;
                updateData.notifications = updates.preferences.notifications;
                updateData.privacy = updates.preferences.privacy;
                delete updateData.preferences; // Remove the preferences object
            }
            
            const response = await databases.updateDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                userId,
                {
                    ...updateData,
                    updatedAt: new Date().toISOString()
                }
            );
            
            // Reconstruct preferences object for return data
            const profileData = {
                ...response,
                preferences: {
                    theme: response.theme || 'light',
                    notifications: response.notifications || true,
                    privacy: response.privacy || 'private'
                }
            };
            
            return { success: true, data: profileData };
        } catch (error) {
            // If document doesn't exist, try to create it first
            if (error.code === 404 || error.message.includes('document with the requested ID could not be found')) {
                console.log('Profile document not found, attempting to create it...');
                const createResult = await this.createUserProfile(userId, {
                    name: updates.name || '',
                    email: '',
                    ...updates
                });
                return createResult;
            }
            return { success: false, error: error.message };
        }
    }

    // Update profile picture
    static async updateProfilePicture(userId, profilePictureFile, oldProfilePictureFileId = null) {
        try {
            console.log('Uploading profile picture for user:', userId);
            
            // Upload new profile picture using SDK
            const uploadResult = await ProfilePictureService.uploadProfilePicture(profilePictureFile, userId);
            
            if (!uploadResult.success) {
                console.error('Upload failed:', uploadResult.error);
                return uploadResult;
            }

            console.log('Upload successful:', uploadResult);

            // Update user profile with new picture URL and file ID
            const profileUpdateData = {
                profilePicture: uploadResult.data.url,
                profilePictureFileId: uploadResult.data.fileId
            };
            
            console.log('Updating profile with:', profileUpdateData);
            
            const updateResult = await this.updateUserProfile(userId, profileUpdateData);

            if (!updateResult.success) {
                // If profile update fails, clean up the uploaded file
                await ProfilePictureService.deleteProfilePicture(uploadResult.data.fileId);
                return updateResult;
            }

            // Delete old profile picture if it exists
            if (oldProfilePictureFileId) {
                await ProfilePictureService.deleteProfilePicture(oldProfilePictureFileId);
            }

            return updateResult;
        } catch (error) {
            console.error('Error updating profile picture:', error);
            return { success: false, error: error.message };
        }
    }

    // Remove profile picture
    static async removeProfilePicture(userId, profilePictureFileId) {
        try {
            // Delete the file from storage
            if (profilePictureFileId) {
                await ProfilePictureService.deleteProfilePicture(profilePictureFileId);
            }

            // Update user profile to remove picture URL and file ID
            const updateResult = await this.updateUserProfile(userId, {
                profilePicture: '',
                profilePictureFileId: ''
            });

            return updateResult;
        } catch (error) {
            console.error('Error removing profile picture:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user journals
    static async getUserJournals(userId) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                JOURNALS_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.orderDesc('createdAt')
                ]
            );
            return { success: true, data: response.documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create a new journal entry
    static async createJournalEntry(userId, journalData) {
        try {
            const entryData = {
                userId: userId,
                title: journalData.title,
                content: journalData.content,
                mood: journalData.mood || 'neutral',
                tags: journalData.tags || [],
                isPrivate: journalData.isPrivate || false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const response = await databases.createDocument(
                DATABASE_ID,
                JOURNALS_COLLECTION_ID,
                ID.unique(),
                entryData
            );
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Update journal entry
    static async updateJournalEntry(entryId, updates) {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                JOURNALS_COLLECTION_ID,
                entryId,
                {
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
            );
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Delete journal entry
    static async deleteJournalEntry(entryId) {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                JOURNALS_COLLECTION_ID,
                entryId
            );
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get journal entry by ID
    static async getJournalEntry(entryId) {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                JOURNALS_COLLECTION_ID,
                entryId
            );
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Search journals
    static async searchJournals(userId, searchTerm) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                JOURNALS_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.search('title', searchTerm),
                    Query.orderDesc('createdAt')
                ]
            );
            return { success: true, data: response.documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get journals by mood
    static async getJournalsByMood(userId, mood) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                JOURNALS_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.equal('mood', mood),
                    Query.orderDesc('createdAt')
                ]
            );
            return { success: true, data: response.documents };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
