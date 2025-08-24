import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await signOut();
                        if (!result.success) {
                            Alert.alert('Error', result.error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>
                    You are successfully signed in
                </Text>
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.userInfoTitle}>User Information:</Text>
                <Text style={styles.userInfoText}>Name: {user?.name}</Text>
                <Text style={styles.userInfoText}>Email: {user?.email}</Text>
                <Text style={styles.userInfoText}>
                    User ID: {user?.$id}
                </Text>
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    userInfo: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    userInfoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    userInfoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    signOutButton: {
        backgroundColor: '#FF3B30',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    signOutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Home;
