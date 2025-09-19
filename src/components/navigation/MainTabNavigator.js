import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import BottomNavigationBar from './BottomNavigationBar';

const MainTabNavigator = ({ children }) => {
    const navigation = useNavigation();
    const [currentRoute, setCurrentRoute] = useState('Home');

    const navigationState = useNavigationState(state => state);

    useEffect(() => {
        if (navigationState && navigationState.routes && navigationState.index !== undefined) {
            const activeRoute = navigationState.routes[navigationState.index];
            if (activeRoute && activeRoute.name) {
                setCurrentRoute(activeRoute.name);
            }
        }
    }, [navigationState]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>
            <BottomNavigationBar
                currentRoute={currentRoute}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
    },
});

export default MainTabNavigator;