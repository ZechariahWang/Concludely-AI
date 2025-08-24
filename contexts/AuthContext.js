import React, { createContext, useState, useContext, useEffect } from 'react';
import { account } from '../appwrite';
import { ID } from 'appwrite';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
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
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
