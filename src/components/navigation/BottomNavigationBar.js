import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEMES, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/app';

const BottomNavigationBar = ({ currentRoute }) => {
    const navigation = useNavigation();
    const theme = THEMES.light;

    const navigationItems = [
        {
            name: 'Home',
            label: 'Home',
            icon: '🏠',
            route: 'Home'
        },
        {
            name: 'Journal',
            label: 'Journal',
            icon: '📝',
            route: 'Journal'
        },
        {
            name: 'Profile',
            label: 'Profile',
            icon: '👤',
            route: 'Profile'
        }
    ];

    const handlePress = (route) => {
        if (currentRoute !== route && navigation) {
            navigation.navigate(route);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.surfaceElevated, borderTopColor: theme.border }]}>
                {navigationItems.map((item, index) => {
                    const isActive = currentRoute === item.route;

                    return (
                        <TouchableOpacity
                            key={item.name}
                            style={[
                                styles.tabItem,
                                isActive && [styles.activeTabItem, { backgroundColor: theme.primaryLight }]
                            ]}
                            onPress={() => handlePress(item.route)}
                            activeOpacity={0.7}
                        >
                            {isActive && (
                                <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />
                            )}
                            <View style={[
                                styles.iconContainer,
                                isActive && styles.activeIconContainer
                            ]}>
                                <Text style={[
                                    styles.icon,
                                    isActive && styles.activeIcon
                                ]}>
                                    {item.icon}
                                </Text>
                            </View>
                            <Text style={[
                                styles.label,
                                isActive && styles.activeLabel
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'transparent',
    },
    container: {
        flexDirection: 'row',
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        backgroundColor: '#F8F9FA',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
        ...Platform.select({
            ios: {
                paddingBottom: SPACING.xs,
            },
            android: {
                paddingBottom: SPACING.sm,
            },
        }),
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.xs,
        borderRadius: RADIUS.xl,
        position: 'relative',
        minHeight: 48,
    },
    activeTabItem: {
        backgroundColor: '#007AFF',
        transform: [{ scale: 1.02 }],
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    activeIconContainer: {
        transform: [{ scale: 1.05 }],
    },
    icon: {
        fontSize: 20,
        textAlign: 'center',
        color: '#666666',
    },
    activeIcon: {
        fontSize: 21,
        color: '#FFFFFF',
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
        letterSpacing: 0.2,
        color: '#666666',
    },
    activeLabel: {
        fontWeight: '600',
        fontSize: 11,
        color: '#FFFFFF',
    },
    activeIndicator: {
        position: 'absolute',
        top: 6,
        width: 20,
        height: 2,
        borderRadius: 1,
    },
});

export default BottomNavigationBar;