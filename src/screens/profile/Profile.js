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
    Platform,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserProfileService } from '../../services/api/userProfile';
import { useAuth } from '../../contexts/AuthContext';
import { THEMES, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/app';

const Profile = () => {
    const { userProfile, updateProfile, user, refreshProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
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

    const selectImage = () => {
        Alert.alert(
            'Select Image',
            'Choose from where you want to select an image',
            [
                { text: 'Camera', onPress: () => openImagePicker('camera') },
                { text: 'Gallery', onPress: () => openImagePicker('gallery') },
                { text: 'Remove Photo', onPress: () => removeProfilePicture() },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const openImagePicker = async (source) => {
        try {
            let permissionResult;
            
            if (source === 'camera') {
                permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            } else {
                permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            }

            if (permissionResult.granted === false) {
                Alert.alert('Permission needed', 'Permission to access media library is required!');
                return;
            }

            let result;
            if (source === 'camera') {
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets?.[0]) {
                await uploadProfilePicture(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to select image');
            console.error('Image picker error:', error);
        }
    };

    const uploadProfilePicture = async (imageAsset) => {
        if (!user) return;
        
        setUploadingImage(true);
        
        try {
            console.log('Image asset:', imageAsset);
            
            // Create a file object compatible with Appwrite
            // Keep filename short to avoid Appwrite's 100 char limit
            const fileName = `prof_${Date.now()}.jpg`;
            const fileType = imageAsset.mimeType || 'image/jpeg';
            
            // For React Native, we need to create a File-like object
            // that works with Appwrite's createFile method
            const file = {
                uri: imageAsset.uri,
                name: fileName,
                type: fileType,
                size: imageAsset.fileSize || undefined
            };

            console.log('File object:', file);

            const result = await UserProfileService.updateProfilePicture(
                user.$id, 
                file, 
                userProfile?.profilePictureFileId
            );
            
            if (result.success) {
                await refreshProfile();
                Alert.alert('Success', 'Profile picture updated successfully');
            } else {
                Alert.alert('Error', result.error || 'Failed to upload profile picture');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload profile picture');
            console.error('Upload error:', error);
        } finally {
            setUploadingImage(false);
        }
    };

    const removeProfilePicture = async () => {
        if (!user || !userProfile?.profilePictureFileId) return;
        
        Alert.alert(
            'Remove Photo',
            'Are you sure you want to remove your profile picture?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Remove', 
                    style: 'destructive',
                    onPress: async () => {
                        setUploadingImage(true);
                        try {
                            const result = await UserProfileService.removeProfilePicture(
                                user.$id,
                                userProfile.profilePictureFileId
                            );
                            
                            if (result.success) {
                                await refreshProfile();
                                Alert.alert('Success', 'Profile picture removed successfully');
                            } else {
                                Alert.alert('Error', result.error || 'Failed to remove profile picture');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to remove profile picture');
                            console.error('Remove error:', error);
                        } finally {
                            setUploadingImage(false);
                        }
                    }
                }
            ]
        );
    };

    const theme = THEMES.light;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={[styles.header, { backgroundColor: theme.background }]}>
                    <View style={styles.headerContent}>
                        <Text style={[styles.title, { color: theme.text }]}>My Profile</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Manage your personal information</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.editButton, {
                            backgroundColor: isEditing ? 'transparent' : theme.primary,
                            borderColor: isEditing ? theme.primary : 'transparent',
                            borderWidth: isEditing ? 2 : 0
                        }]}
                        onPress={() => setIsEditing(!isEditing)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.editButtonText, { color: isEditing ? theme.primary : '#FFFFFF' }]}>
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.profileCard, { backgroundColor: theme.surfaceElevated }]}>
                    <View style={styles.profilePictureContainer}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={
                                    userProfile?.profilePicture
                                        ? { uri: userProfile.profilePicture }
                                        : require('../../../assets/default-avatar.png')
                                }
                                style={styles.profilePicture}
                            />
                            {isEditing && (
                                <TouchableOpacity 
                                    style={[styles.changePhotoButton, { backgroundColor: theme.primary }]}
                                    onPress={selectImage}
                                    disabled={uploadingImage}
                                    activeOpacity={0.7}
                                >
                                    {uploadingImage ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.changePhotoText}>📷</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: theme.text }]}>{userProfile?.name || user?.name || 'User'}</Text>
                            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
                        </View>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>Name</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isEditing ? theme.surface : theme.borderLight,
                                    borderColor: isEditing ? theme.border : theme.borderLight,
                                    color: theme.text,
                                    opacity: isEditing ? 1 : 0.7
                                }]}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                editable={isEditing}
                                placeholder="Enter your name"
                                placeholderTextColor={theme.textMuted}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
                            <TextInput
                                style={[styles.textArea, {
                                    backgroundColor: isEditing ? theme.surface : theme.borderLight,
                                    borderColor: isEditing ? theme.border : theme.borderLight,
                                    color: theme.text,
                                    opacity: isEditing ? 1 : 0.7
                                }]}
                                value={formData.bio}
                                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                                editable={isEditing}
                                placeholder="Tell us about yourself"
                                placeholderTextColor={theme.textMuted}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>Date of Birth</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isEditing ? theme.surface : theme.borderLight,
                                    borderColor: isEditing ? theme.border : theme.borderLight,
                                    color: theme.text,
                                    opacity: isEditing ? 1 : 0.7
                                }]}
                                value={formData.dateOfBirth}
                                onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                                editable={isEditing}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor={theme.textMuted}
                            />
                        </View>
                    </View>
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
                                style={[styles.saveButton, { backgroundColor: loading ? theme.textMuted : theme.primary }]}
                                onPress={handleSave}
                                disabled={loading}
                                activeOpacity={0.7}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.md,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        ...TYPOGRAPHY.h1,
        fontWeight: '700',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        opacity: 0.8,
    },
    editButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.lg,
        minWidth: 100,
        alignItems: 'center',
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    editButtonText: {
        ...TYPOGRAPHY.bodyMedium,
        fontWeight: '600',
    },
    profileCard: {
        margin: SPACING.lg,
        marginTop: SPACING.md,
        borderRadius: RADIUS.xl,
        padding: SPACING.xl,
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.15,
        shadowRadius: 32,
        elevation: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    profilePictureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        paddingBottom: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: SPACING.lg,
    },
    profilePicture: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: THEMES.light.border,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    changePhotoButton: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    changePhotoText: {
        fontSize: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...TYPOGRAPHY.h2,
        fontWeight: '700',
        marginBottom: SPACING.xs,
    },
    userEmail: {
        ...TYPOGRAPHY.body,
    },
    form: {
        marginTop: SPACING.md,
    },
    inputContainer: {
        marginBottom: SPACING.xl,
    },
    label: {
        ...TYPOGRAPHY.bodyMedium,
        fontWeight: '600',
        marginBottom: SPACING.sm,
        letterSpacing: 0.3,
    },
    input: {
        borderWidth: 1,
        borderRadius: RADIUS.lg,
        paddingVertical: Platform.OS === 'ios' ? SPACING.lg : SPACING.md,
        paddingHorizontal: SPACING.lg,
        ...TYPOGRAPHY.body,
        minHeight: 56,
        fontSize: 16,
        lineHeight: 20,
        textAlignVertical: Platform.OS === 'android' ? 'center' : 'auto',
        includeFontPadding: false,
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: RADIUS.lg,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        ...TYPOGRAPHY.body,
        minHeight: 120,
        fontSize: 16,
        lineHeight: 22,
        textAlignVertical: 'top',
        includeFontPadding: false,
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    preferencesSection: {
        marginTop: SPACING.xl,
        marginHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        borderTopWidth: 2,
        borderTopColor: 'rgba(0,0,0,0.08)',
    },
    sectionTitle: {
        ...TYPOGRAPHY.h3,
        fontWeight: '700',
        color: '#333',
        marginBottom: SPACING.lg,
        letterSpacing: 0.5,
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.xl,
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.md,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    preferenceLabel: {
        ...TYPOGRAPHY.bodyMedium,
        fontWeight: '600',
        color: '#333',
    },
    preferenceValue: {
        ...TYPOGRAPHY.body,
        color: '#666',
        fontWeight: '500',
    },
    themeButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: '#007AFF',
        borderRadius: RADIUS.lg,
        minWidth: 80,
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    themeButtonText: {
        color: '#fff',
        ...TYPOGRAPHY.caption,
        fontWeight: '700',
    },
    toggleButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: '#34C759',
        borderRadius: RADIUS.lg,
        minWidth: 80,
        alignItems: 'center',
        shadowColor: '#34C759',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    toggleButtonText: {
        color: '#fff',
        ...TYPOGRAPHY.caption,
        fontWeight: '700',
    },
    privacyButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: '#FF9500',
        borderRadius: RADIUS.lg,
        minWidth: 80,
        alignItems: 'center',
        shadowColor: '#FF9500',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    privacyButtonText: {
        color: '#fff',
        ...TYPOGRAPHY.caption,
        fontWeight: '700',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.xl,
        gap: SPACING.md,
    },
    button: {
        flex: 1,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FF3B30',
        shadowOpacity: 0,
        elevation: 0,
    },
    saveButton: {
        flex: 1,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        alignItems: 'center',
        minHeight: 56,
        justifyContent: 'center',
        shadowColor: THEMES.light.primary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    cancelButtonText: {
        ...TYPOGRAPHY.bodyMedium,
        color: '#FF3B30',
        fontWeight: '700',
    },
    saveButtonText: {
        ...TYPOGRAPHY.bodyMedium,
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default Profile;
