import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    Image,
    Platform,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { UserProfileService } from '../../services/api/userProfile';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Card, Text, Input, Icon, THEMES, SPACING, RADIUS } from '../../components/ui';

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
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text variant="display">My Profile</Text>
                    </View>
                    <Button
                        variant={isEditing ? "outline" : "default"}
                        onPress={() => setIsEditing(!isEditing)}
                        style={styles.editButton}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </View>

                <Card variant="elevated" style={styles.profileCard}>
                    <Card.Content>
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
                                <Button
                                    variant="default"
                                    size="sm"
                                    style={styles.changePhotoButton}
                                    onPress={selectImage}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Icon name="camera" size={16} color={theme.primaryForeground} />
                                    )}
                                </Button>
                            )}
                        </View>
                        <View style={styles.userInfo}>
                            <Text variant="h2">{userProfile?.name || user?.name || 'User'}</Text>
                            <Text variant="muted">{user?.email}</Text>
                        </View>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text variant="bodyMedium" style={styles.label}>Name</Text>
                            <Input
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                editable={isEditing}
                                placeholder="Enter your name"
                                style={[styles.input, { opacity: isEditing ? 1 : 0.7 }]}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text variant="bodyMedium" style={styles.label}>Bio</Text>
                            <Input
                                value={formData.bio}
                                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                                editable={isEditing}
                                placeholder="Tell us about yourself"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                style={[styles.textArea, { opacity: isEditing ? 1 : 0.7 }]}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text variant="bodyMedium" style={styles.label}>Date of Birth</Text>
                            <Input
                                value={formData.dateOfBirth}
                                onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                                editable={isEditing}
                                placeholder="YYYY-MM-DD"
                                style={[styles.input, { opacity: isEditing ? 1 : 0.7 }]}
                            />
                        </View>
                    </View>
                    </Card.Content>
                </Card>

                <Card variant="outlined" style={styles.preferencesSection}>
                    <Card.Content>
                        <Text variant="h3" style={styles.sectionTitle}>Preferences</Text>
                        
                        <View style={styles.preferenceItem}>
                            <Text variant="bodyMedium" style={styles.preferenceLabel}>Theme</Text>
                            {isEditing ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onPress={() => {
                                        const newTheme = formData.preferences.theme === 'light' ? 'dark' : 'light';
                                        setFormData({
                                            ...formData,
                                            preferences: { ...formData.preferences, theme: newTheme }
                                        });
                                    }}
                                >
                                    {formData.preferences.theme === 'light' ? 'Light' : 'Dark'}
                                </Button>
                            ) : (
                                <Text variant="muted">
                                    {formData.preferences.theme === 'light' ? 'Light' : 'Dark'}
                                </Text>
                            )}
                        </View>

                        <View style={styles.preferenceItem}>
                            <Text variant="bodyMedium" style={styles.preferenceLabel}>Notifications</Text>
                            {isEditing ? (
                                <Button
                                    variant={formData.preferences.notifications ? "default" : "outline"}
                                    size="sm"
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
                                    {formData.preferences.notifications ? 'On' : 'Off'}
                                </Button>
                            ) : (
                                <Text variant="muted">
                                    {formData.preferences.notifications ? 'On' : 'Off'}
                                </Text>
                            )}
                        </View>

                        <View style={styles.preferenceItem}>
                            <Text variant="bodyMedium" style={styles.preferenceLabel}>Privacy</Text>
                            {isEditing ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onPress={() => {
                                        const newPrivacy = formData.preferences.privacy === 'private' ? 'public' : 'private';
                                        setFormData({
                                            ...formData,
                                            preferences: { ...formData.preferences, privacy: newPrivacy }
                                        });
                                    }}
                                >
                                    {formData.preferences.privacy === 'private' ? 'Private' : 'Public'}
                                </Button>
                            ) : (
                                <Text variant="muted">
                                    {formData.preferences.privacy === 'private' ? 'Private' : 'Public'}
                                </Text>
                            )}
                        </View>
                    </Card.Content>
                </Card>

                {isEditing && (
                    <View style={styles.buttonContainer}>
                        <Button
                            variant="destructive"
                            style={styles.cancelButton}
                            onPress={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            style={styles.saveButton}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
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
        padding: SPACING[6],
        paddingBottom: SPACING[10],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING[8],
        paddingTop: SPACING[4],
        minHeight: 60,
    },
    headerContent: {
        flex: 1,
    },
    subtitle: {
        textAlign: 'center',
        marginTop: SPACING[2],
    },
    editButton: {
        minWidth: 100,
    },
    profileCard: {
        marginBottom: SPACING[6],
    },
    profilePictureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING[6],
        paddingBottom: SPACING[4],
        borderBottomWidth: 1,
        borderBottomColor: THEMES.light.border,
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: SPACING[4],
    },
    profilePicture: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: THEMES.light.border,
        borderWidth: 3,
        borderColor: THEMES.light.background,
    },
    changePhotoButton: {
        position: 'absolute',
        bottom: -6,
        right: -6,
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: THEMES.light.background,
    },
    userInfo: {
        flex: 1,
    },
    form: {
        marginTop: SPACING[4],
    },
    inputContainer: {
        marginBottom: SPACING[6],
    },
    label: {
        fontWeight: '600',
        marginBottom: SPACING[2],
    },
    input: {
        minHeight: 56,
    },
    textArea: {
        minHeight: 120,
    },
    preferencesSection: {
        marginBottom: SPACING[6],
    },
    sectionTitle: {
        fontWeight: '700',
        marginBottom: SPACING[4],
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING[4],
        marginBottom: SPACING[3],
        backgroundColor: THEMES.light.secondary,
        borderRadius: RADIUS.lg,
        paddingHorizontal: SPACING[4],
    },
    preferenceLabel: {
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING[6],
        gap: SPACING[4],
    },
    cancelButton: {
        flex: 1,
    },
    saveButton: {
        flex: 1,
    },
});

export default Profile;
