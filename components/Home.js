import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const Home = ({ navigation }) => {
    const { user, userProfile, signOut } = useAuth();

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
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>
                    You are successfully signed in
                </Text>
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.userInfoTitle}>User Information:</Text>
                <Text style={styles.userInfoText}>Name: {userProfile?.name || user?.name}</Text>
                <Text style={styles.userInfoText}>Email: {user?.email}</Text>
                {userProfile?.bio && (
                    <Text style={styles.userInfoText}>Bio: {userProfile.bio}</Text>
                )}
            </View>

            <View style={styles.menuSection}>
                <Text style={styles.menuTitle}>Quick Actions</Text>
                
                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Journal')}
                >
                    <Text style={styles.menuButtonText}>📝 My Journal</Text>
                    <Text style={styles.menuButtonSubtext}>Write and manage your journal entries</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.menuButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={styles.menuButtonText}>👤 My Profile</Text>
                    <Text style={styles.menuButtonSubtext}>Update your profile and preferences</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
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
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuSection: {
        marginBottom: 30,
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    menuButton: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    menuButtonSubtext: {
        fontSize: 14,
        color: '#666',
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
