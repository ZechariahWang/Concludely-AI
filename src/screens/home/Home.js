import React from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Card, Text, Icon, THEMES, SPACING, RADIUS } from '../../components/ui';

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
                {/* Header Section */}
                <View style={styles.header}>
                    <Text variant="display">Hey {firstName},</Text>
                    <Text variant="muted" style={styles.subtitle}>
                        Ready to capture today's thoughts?
                    </Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    <Card variant="elevated" size="sm" style={styles.statCard}>
                        <Text variant="h2" color={theme.primary}>0</Text>
                        <Text variant="small" style={styles.statLabel}>Entries this week</Text>
                    </Card>
                    <Card variant="elevated" size="sm" style={styles.statCard}>
                        <Text variant="h2" color={theme.success}>0</Text>
                        <Text variant="small" style={styles.statLabel}>Total entries</Text>
                    </Card>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text variant="h3" style={styles.sectionTitle}>Quick Actions</Text>

                    <Card variant="elevated" style={styles.primaryActionCard}>
                        <Card.Content>
                            <View style={styles.primaryAction}>
                                <View style={styles.actionIcon}>
                                    <Icon name="edit-3" size={24} color={theme.primary} />
                                </View>
                                <View style={styles.actionContent}>
                                    <Text variant="h4">Write New Entry</Text>
                                    <Text variant="muted">Capture your thoughts and feelings</Text>
                                </View>
                            </View>
                            <Button
                                onPress={() => navigation.navigate('Journal')}
                                size="lg"
                                style={styles.primaryButton}
                            >
                                Start Writing
                            </Button>
                        </Card.Content>
                    </Card>

                    <View style={styles.secondaryActions}>
                        <Card variant="outlined" style={styles.secondaryActionCard}>
                            <Card.Content style={styles.secondaryActionContent}>
                                <Icon name="book-open" size={32} color={theme.mutedForeground} style={styles.secondaryActionIcon} />
                                <Text variant="bodyMedium" style={styles.secondaryActionTitle}>Journal</Text>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onPress={() => navigation.navigate('Journal')}
                                >
                                    View
                                </Button>
                            </Card.Content>
                        </Card>

                        <Card variant="outlined" style={styles.secondaryActionCard}>
                            <Card.Content style={styles.secondaryActionContent}>
                                <Icon name="user" size={32} color={theme.mutedForeground} style={styles.secondaryActionIcon} />
                                <Text variant="bodyMedium" style={styles.secondaryActionTitle}>Profile</Text>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onPress={() => navigation.navigate('Profile')}
                                >
                                    Edit
                                </Button>
                            </Card.Content>
                        </Card>
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.section}>
                    <Text variant="h3" style={styles.sectionTitle}>Recent Activity</Text>
                    <Card variant="outlined">
                        <Card.Content style={styles.emptyState}>
                            <Icon name="file-text" size={48} color={theme.mutedForeground} style={styles.emptyStateIcon} />
                            <Text variant="h4" style={styles.emptyStateTitle}>No entries yet</Text>
                            <Text variant="muted" style={styles.emptyStateDescription}>
                                Start your journaling journey by writing your first entry
                            </Text>
                            <Button
                                variant="outline"
                                onPress={() => navigation.navigate('Journal')}
                                style={styles.emptyStateButton}
                            >
                                Write First Entry
                            </Button>
                        </Card.Content>
                    </Card>
                </View>

                {/* Sign Out */}
                <Button
                    variant="destructive"
                    onPress={handleSignOut}
                    style={styles.signOutButton}
                >
                    Sign Out
                </Button>
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
        alignItems: 'center',
        marginBottom: SPACING[8],
        paddingTop: SPACING[4],
        minHeight: 60,
    },
    subtitle: {
        textAlign: 'center',
        marginTop: SPACING[2],
    },
    statsGrid: {
        flexDirection: 'row',
        gap: SPACING[4],
        marginBottom: SPACING[8],
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        textAlign: 'center',
        marginTop: SPACING[1],
    },
    section: {
        marginBottom: SPACING[8],
    },
    sectionTitle: {
        marginBottom: SPACING[4],
    },
    primaryActionCard: {
        marginBottom: SPACING[4],
    },
    primaryAction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING[4],
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.lg,
        backgroundColor: THEMES.light.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING[3],
    },
    actionContent: {
        flex: 1,
    },
    primaryButton: {
        width: '100%',
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: SPACING[4],
    },
    secondaryActionCard: {
        flex: 1,
    },
    secondaryActionContent: {
        alignItems: 'center',
        paddingVertical: SPACING[2],
    },
    secondaryActionIcon: {
        marginBottom: SPACING[2],
    },
    secondaryActionTitle: {
        marginBottom: SPACING[2],
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING[8],
    },
    emptyStateIcon: {
        marginBottom: SPACING[4],
    },
    emptyStateTitle: {
        marginBottom: SPACING[2],
    },
    emptyStateDescription: {
        textAlign: 'center',
        marginBottom: SPACING[6],
        maxWidth: 280,
    },
    emptyStateButton: {
        minWidth: 160,
    },
    signOutButton: {
        marginTop: SPACING[4],
    },
});

export default Home;
