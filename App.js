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

const Navigation = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    const MainStackScreen = ({ route }) => {
        const { name } = route;
        let ScreenComponent;

        switch (name) {
            case 'Home':
                ScreenComponent = Home;
                break;
            case 'Profile':
                ScreenComponent = Profile;
                break;
            case 'Journal':
                ScreenComponent = Journal;
                break;
            default:
                ScreenComponent = Home;
        }

        return (
            <MainTabNavigator>
                <ScreenComponent />
            </MainTabNavigator>
        );
    };

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="Home" component={MainStackScreen} />
                    <Stack.Screen name="Profile" component={MainStackScreen} />
                    <Stack.Screen name="Journal" component={MainStackScreen} />
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
