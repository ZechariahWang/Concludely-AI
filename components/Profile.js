import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    Image,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { userProfile, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: userProfile?.name || '',
        bio: userProfile?.bio || '',
        dateOfBirth: userProfile?.dateOfBirth || '',
        preferences: userProfile?.preferences || {
            theme: 'light',
            notifications: true,
            privacy: 'private'
        }
    });

    const handleSave = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        setLoading(true);
        const result = await updateProfile(formData);
        setLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Profile updated successfully');
            setIsEditing(false);
        } else {
            Alert.alert('Error', result.error);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: userProfile?.name || '',
            bio: userProfile?.bio || '',
            dateOfBirth: userProfile?.dateOfBirth || '',
            preferences: userProfile?.preferences || {
                theme: 'light',
                notifications: true,
                privacy: 'private'
            }
        });
        setIsEditing(false);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditing(!isEditing)}
                >
                    <Text style={styles.editButtonText}>
                        {isEditing ? 'Cancel' : 'Edit'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.profilePictureContainer}>
                    <Image
                        source={
                            userProfile?.profilePicture
                                ? { uri: userProfile.profilePicture }
                                : require('../assets/default-avatar.png')
                        }
                        style={styles.profilePicture}
                    />
                    {isEditing && (
                        <TouchableOpacity style={styles.changePhotoButton}>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            editable={isEditing}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.textArea, !isEditing && styles.disabledInput]}
                            value={formData.bio}
                            onChangeText={(text) => setFormData({ ...formData, bio: text })}
                            editable={isEditing}
                            placeholder="Tell us about yourself"
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.disabledInput]}
                            value={formData.dateOfBirth}
                            onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                            editable={isEditing}
                            placeholder="YYYY-MM-DD"
                        />
                    </View>

                    <View style={styles.preferencesSection}>
                        <Text style={styles.sectionTitle}>Preferences</Text>
                        
                        <View style={styles.preferenceItem}>
                            <Text style={styles.preferenceLabel}>Theme</Text>
                            {isEditing ? (
                                <TouchableOpacity
                                    style={styles.themeButton}
                                    onPress={() => {
                                        const newTheme = formData.preferences.theme === 'light' ? 'dark' : 'light';
                                        setFormData({
                                            ...formData,
                                            preferences: { ...formData.preferences, theme: newTheme }
                                        });
                                    }}
                                >
                                    <Text style={styles.themeButtonText}>
                                        {formData.preferences.theme === 'light' ? 'Light' : 'Dark'}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.preferenceValue}>
                                    {formData.preferences.theme === 'light' ? 'Light' : 'Dark'}
                                </Text>
                            )}
                        </View>

                        <View style={styles.preferenceItem}>
                            <Text style={styles.preferenceLabel}>Notifications</Text>
                            {isEditing ? (
                                <TouchableOpacity
                                    style={styles.toggleButton}
                                    onPress={() => {
                                        setFormData({
                                            ...formData,
                                            preferences: {
                                                ...formData.preferences,
                                                notifications: !formData.preferences.notifications
                                            }
                                        });
                                    }}
                                >
                                    <Text style={styles.toggleButtonText}>
                                        {formData.preferences.notifications ? 'On' : 'Off'}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.preferenceValue}>
                                    {formData.preferences.notifications ? 'On' : 'Off'}
                                </Text>
                            )}
                        </View>

                        <View style={styles.preferenceItem}>
                            <Text style={styles.preferenceLabel}>Privacy</Text>
                            {isEditing ? (
                                <TouchableOpacity
                                    style={styles.privacyButton}
                                    onPress={() => {
                                        const newPrivacy = formData.preferences.privacy === 'private' ? 'public' : 'private';
                                        setFormData({
                                            ...formData,
                                            preferences: { ...formData.preferences, privacy: newPrivacy }
                                        });
                                    }}
                                >
                                    <Text style={styles.privacyButtonText}>
                                        {formData.preferences.privacy === 'private' ? 'Private' : 'Public'}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.preferenceValue}>
                                    {formData.preferences.privacy === 'private' ? 'Private' : 'Public'}
                                </Text>
                            )}
                        </View>
                    </View>

                    {isEditing && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
                                onPress={handleSave}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    editButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#007AFF',
        borderRadius: 6,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    profileSection: {
        padding: 20,
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ddd',
    },
    changePhotoButton: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#007AFF',
        borderRadius: 6,
    },
    changePhotoText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#fafafa',
        height: 100,
        textAlignVertical: 'top',
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#666',
    },
    preferencesSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    preferenceLabel: {
        fontSize: 16,
        color: '#333',
    },
    preferenceValue: {
        fontSize: 16,
        color: '#666',
    },
    themeButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#007AFF',
        borderRadius: 6,
    },
    themeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    toggleButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#34C759',
        borderRadius: 6,
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    privacyButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#FF9500',
        borderRadius: 6,
    },
    privacyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    saveButton: {
        backgroundColor: '#34C759',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Profile;
