import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { THEMES, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/app';

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

    const theme = THEMES.light;
    const firstName = (userProfile?.name || user?.name)?.split(' ')[0] || 'there';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <Text style={[styles.greeting, { color: theme.textSecondary }]}>Good day,</Text>
                    <Text style={[styles.title, { color: theme.text }]}>{firstName}! 👋</Text>
                    <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                        Ready to capture today's thoughts?
                    </Text>
                </View>

                <View style={[styles.statsCard, { backgroundColor: theme.surfaceElevated }]}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: theme.primary }]}>0</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Entries this week</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: theme.secondary }]}>0</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total entries</Text>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={[styles.menuTitle, { color: theme.text }]}>Quick Actions</Text>
                    
                    <TouchableOpacity 
                        style={[styles.menuButton, styles.primaryButton, { backgroundColor: theme.primary }]}
                        onPress={() => navigation.navigate('Journal')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.buttonIcon}>
                            <Text style={styles.buttonEmoji}>✍️</Text>
                        </View>
                        <View style={styles.buttonContent}>
                            <Text style={styles.primaryButtonText}>Write New Entry</Text>
                            <Text style={styles.primaryButtonSubtext}>Capture your thoughts and feelings</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.secondaryActions}>
                        <TouchableOpacity 
                            style={[styles.secondaryButton, { backgroundColor: theme.surfaceElevated }]}
                            onPress={() => navigation.navigate('Journal')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.secondaryButtonEmoji}>📚</Text>
                            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>My Journal</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.secondaryButton, { backgroundColor: theme.surfaceElevated }]}
                            onPress={() => navigation.navigate('Profile')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.secondaryButtonEmoji}>👤</Text>
                            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.signOutButton, { backgroundColor: theme.surface, borderColor: theme.border }]} 
                    onPress={handleSignOut}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.signOutButtonText, { color: theme.error }]}>Sign Out</Text>
                </TouchableOpacity>
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
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    greeting: {
        ...TYPOGRAPHY.body,
        marginBottom: SPACING.xs,
    },
    title: {
        ...TYPOGRAPHY.h1,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
    },
    statsCard: {
        flexDirection: 'row',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.xl,
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: THEMES.light.border,
        marginHorizontal: SPACING.lg,
    },
    statNumber: {
        ...TYPOGRAPHY.h2,
        fontWeight: '700',
    },
    statLabel: {
        ...TYPOGRAPHY.caption,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    menuSection: {
        marginBottom: SPACING.xl,
    },
    menuTitle: {
        ...TYPOGRAPHY.h3,
        marginBottom: SPACING.lg,
    },
    menuButton: {
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.lg,
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    buttonIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    buttonEmoji: {
        fontSize: 24,
    },
    buttonContent: {
        flex: 1,
    },
    primaryButtonText: {
        ...TYPOGRAPHY.h4,
        color: '#FFFFFF',
        marginBottom: SPACING.xs,
    },
    primaryButtonSubtext: {
        ...TYPOGRAPHY.caption,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    secondaryActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.md,
    },
    secondaryButton: {
        flex: 1,
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    secondaryButtonEmoji: {
        fontSize: 28,
        marginBottom: SPACING.sm,
    },
    secondaryButtonText: {
        ...TYPOGRAPHY.bodyMedium,
    },
    signOutButton: {
        borderWidth: 1,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.lg,
    },
    signOutButtonText: {
        ...TYPOGRAPHY.bodyMedium,
    },
});

export default Home;
