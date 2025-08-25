import React, { createContext, useState, useContext, useEffect } from 'react';
import { account } from '../appwrite';
import { ID } from 'appwrite';
import { UserProfileService } from '../services/userProfile';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
            
            // Load user profile data
            const profileResult = await UserProfileService.getUserProfile(currentUser.$id);
            if (profileResult.success) {
                setUserProfile(profileResult.data);
            } else {
                // If profile doesn't exist, create one with basic user data
                const createResult = await UserProfileService.createUserProfile(currentUser.$id, {
                    name: currentUser.name || '',
                    email: currentUser.email || ''
                });
                if (createResult.success) {
                    setUserProfile(createResult.data);
                }
            }
        } catch (error) {
            setUser(null);
            setUserProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password, name) => {
        try {
            const response = await account.create(
                ID.unique(),
                email,
                password,
                name
            );
            
            if (response) {
                // Create user profile
                await UserProfileService.createUserProfile(response.$id, {
                    name: name,
                    email: email
                });
                
                await signIn(email, password);
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signIn = async (email, password) => {
        try {
            console.log('Attempting to sign in with:', email);
            console.log('Using endpoint:', account.client.config.endpoint);
            const response = await account.createEmailPasswordSession(email, password);
            console.log('Sign in response:', response);
            if (response) {
                await checkUser();
            }
            return { success: true };
        } catch (error) {
            console.error('Sign in error:', error);
            console.error('Error details:', error.code, error.type, error.response);
            return { success: false, error: error.message };
        }
    };

    const signOut = async () => {
        try {
            await account.deleteSessions();
            setUser(null);
            setUserProfile(null);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Profile management functions
    const updateProfile = async (updates) => {
        if (!user) return { success: false, error: 'User not authenticated' };
        
        try {
            console.log('Updating profile for user:', user.$id, 'with updates:', updates);
            const result = await UserProfileService.updateUserProfile(user.$id, updates);
            console.log('Update result:', result);
            if (result.success) {
                setUserProfile(result.data);
            }
            return result;
        } catch (error) {
            console.error('Error in updateProfile:', error);
            return { success: false, error: error.message };
        }
    };

    const refreshProfile = async () => {
        if (!user) return;
        
        try {
            const result = await UserProfileService.getUserProfile(user.$id);
            if (result.success) {
                setUserProfile(result.data);
            }
        } catch (error) {
            console.error('Error refreshing profile:', error);
        }
    };

    // Profile picture management functions
    const updateProfilePicture = async (profilePictureFile) => {
        if (!user) return { success: false, error: 'User not authenticated' };
        
        try {
            const result = await UserProfileService.updateProfilePicture(
                user.$id,
                profilePictureFile,
                userProfile?.profilePictureFileId
            );
            
            if (result.success) {
                setUserProfile(result.data);
            }
            return result;
        } catch (error) {
            console.error('Error in updateProfilePicture:', error);
            return { success: false, error: error.message };
        }
    };

    const removeProfilePicture = async () => {
        if (!user || !userProfile?.profilePictureFileId) {
            return { success: false, error: 'No profile picture to remove' };
        }
        
        try {
            const result = await UserProfileService.removeProfilePicture(
                user.$id,
                userProfile.profilePictureFileId
            );
            
            if (result.success) {
                setUserProfile(result.data);
            }
            return result;
        } catch (error) {
            console.error('Error in removeProfilePicture:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        userProfile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
        updateProfilePicture,
        removeProfilePicture,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
