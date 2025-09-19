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
import { Icon, THEMES, TYPOGRAPHY, SPACING, RADIUS } from '../ui';

const BottomNavigationBar = ({ currentRoute }) => {
    const navigation = useNavigation();
    const theme = THEMES.light;

    const navigationItems = [
        {
            name: 'Home',
            label: 'Home',
            icon: 'home',
            route: 'Home'
        },
        {
            name: 'Journal',
            label: 'Journal',
            icon: 'edit-3',
            route: 'Journal'
        },
        {
            name: 'Profile',
            label: 'Profile',
            icon: 'user',
            route: 'Profile'
        }
    ];

    const handlePress = (route) => {
        if (currentRoute !== route && navigation) {
            navigation.navigate(route);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.surfaceElevated, borderTopColor: theme.border }]}>
                {navigationItems.map((item, index) => {
                    const isActive = currentRoute === item.route;

                    return (
                        <TouchableOpacity
                            key={item.name}
                            style={styles.tabItem}
                            onPress={() => handlePress(item.route)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconContainer}>
                                <Icon
                                    name={item.icon}
                                    size={24}
                                    color={isActive ? theme.primary : theme.mutedForeground}
                                />
                            </View>
                            <Text style={[
                                styles.label,
                                { color: isActive ? theme.primary : theme.mutedForeground },
                                isActive && styles.activeLabel
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: SPACING[4],
        paddingHorizontal: SPACING[4],
        borderTopWidth: 1,
        borderTopColor: THEMES.light.border,
        backgroundColor: THEMES.light.card,
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
        paddingBottom: SPACING[6],
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING[3],
        paddingHorizontal: SPACING[2],
        borderRadius: RADIUS.lg,
        minHeight: 60,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING[1],
    },
    label: {
        ...TYPOGRAPHY.caption,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    activeLabel: {
        fontWeight: '600',
    },
});

export default BottomNavigationBar;