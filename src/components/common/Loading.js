import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Card, Text, THEMES, SPACING } from '../ui';

const Loading = () => {
    const theme = THEMES.light;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Card variant="elevated" style={styles.loadingCard}>
                <Card.Content style={styles.loadingContent}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text variant="body" style={styles.loadingText}>
                        Loading...
                    </Text>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING[6],
    },
    loadingCard: {
        minWidth: 200,
    },
    loadingContent: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING[4],
    },
});

export default Loading;
