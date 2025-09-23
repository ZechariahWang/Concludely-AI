import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import SignIn from './src/screens/auth/SignIn';
import SignUp from './src/screens/auth/SignUp';
import Home from './src/screens/home/Home';
import Profile from './src/screens/profile/Profile';
import Journal from './src/screens/journal/Journal';
import Loading from './src/components/common/Loading';
import MainTabNavigator from './src/components/navigation/MainTabNavigator';

const Stack = createStackNavigator();

// Create stable screen components outside of Navigation to prevent recreation
const HomeScreen = () => (
    <MainTabNavigator>
        <Home />
    </MainTabNavigator>
);

const ProfileScreen = () => (
    <MainTabNavigator>
        <Profile />
    </MainTabNavigator>
);

const JournalScreen = () => (
    <MainTabNavigator>
        <Journal />
    </MainTabNavigator>
);

const Navigation = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animationEnabled: false,
                gestureEnabled: false,
                cardStyleInterpolator: () => ({
                    cardStyle: {
                        opacity: 1,
                    },
                }),
                transitionSpec: {
                    open: {
                        animation: 'timing',
                        config: {
                            duration: 0,
                        },
                    },
                    close: {
                        animation: 'timing',
                        config: {
                            duration: 0,
                        },
                    },
                },
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="Journal" component={JournalScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="SignIn" component={SignIn} />
                    <Stack.Screen name="SignUp" component={SignUp} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Navigation />
            </NavigationContainer>
        </AuthProvider>
    );
}
