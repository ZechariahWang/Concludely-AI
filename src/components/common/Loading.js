import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { THEMES, TYPOGRAPHY, SPACING } from '../../constants/app';

const Loading = () => {
    const theme = THEMES.light;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.loadingCard, { backgroundColor: theme.surfaceElevated }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                    Loading...
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    loadingCard: {
        padding: SPACING.xl,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    loadingText: {
        ...TYPOGRAPHY.body,
        marginTop: SPACING.md,
    },
});

export default Loading;
