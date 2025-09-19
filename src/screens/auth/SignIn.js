import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Card, Text, Input, Icon, THEMES, SPACING, RADIUS } from '../../components/ui';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const result = await signIn(email, password);
        setLoading(false);

        if (!result.success) {
            Alert.alert('Error', result.error);
        }
    };

    const theme = THEMES.light;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* App Branding */}
                    <View style={styles.brandingSection}>
                        <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
                            <Icon name="book-open" size={32} color={theme.primaryForeground} />
                        </View>
                        <Text variant="display" style={styles.appName}>JournalApp</Text>
                        <Text variant="muted" style={styles.appTagline}>
                            Your personal journaling companion
                        </Text>
                    </View>

                    {/* Welcome Section */}
                    <View style={styles.welcomeSection}>
                        <Text variant="h1" style={styles.welcomeTitle}>Welcome Back</Text>
                        <Text variant="muted" style={styles.welcomeSubtitle}>
                            Sign in to continue your journaling journey
                        </Text>
                    </View>

                    {/* Sign In Form */}
                    <Card variant="elevated" style={styles.formCard}>
                        <Card.Content style={styles.formContent}>
                            <View style={styles.inputGroup}>
                                <Input
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    leftIcon="mail"
                                    style={styles.input}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Input
                                    label="Password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    leftIcon="lock"
                                    rightIcon={showPassword ? "eye-off" : "eye"}
                                    onRightIconPress={() => setShowPassword(!showPassword)}
                                    style={styles.input}
                                />
                            </View>

                            <Button
                                onPress={handleSignIn}
                                disabled={loading}
                                loading={loading}
                                size="lg"
                                style={styles.signInButton}
                            >
                                {loading ? (
                                    <View style={styles.loadingContent}>
                                        <ActivityIndicator color={theme.primaryForeground} size="small" />
                                        <Text variant="bodyMedium" style={[styles.buttonText, { color: theme.primaryForeground }]}>
                                            Signing In...
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.buttonContent}>
                                        <Icon name="log-in" size={16} color={theme.primaryForeground} style={styles.buttonIcon} />
                                        <Text variant="bodyMedium" style={[styles.buttonText, { color: theme.primaryForeground }]}>
                                            Sign In
                                        </Text>
                                    </View>
                                )}
                            </Button>
                        </Card.Content>
                    </Card>

                    {/* Sign Up Link */}
                    <View style={styles.signUpSection}>
                        <Text variant="body" style={[styles.signUpText, { color: theme.mutedForeground }]}>
                            Don't have an account?
                        </Text>
                        <Button
                            variant="ghost"
                            onPress={() => navigation.navigate('SignUp')}
                            style={styles.signUpButton}
                        >
                            <Text variant="bodyMedium" style={[styles.signUpButtonText, { color: theme.primary }]}>
                                Create Account
                            </Text>
                        </Button>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text variant="small" style={[styles.footerText, { color: theme.mutedForeground }]}>
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING[6],
        paddingTop: SPACING[10],
        paddingBottom: SPACING[8],
    },
    brandingSection: {
        alignItems: 'center',
        marginBottom: SPACING[12],
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING[4],
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    appName: {
        marginBottom: SPACING[2],
        fontWeight: '700',
    },
    appTagline: {
        textAlign: 'center',
        maxWidth: 280,
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: SPACING[8],
    },
    welcomeTitle: {
        marginBottom: SPACING[2],
        textAlign: 'center',
    },
    welcomeSubtitle: {
        textAlign: 'center',
        maxWidth: 320,
    },
    formCard: {
        marginBottom: SPACING[6],
    },
    formContent: {
        paddingVertical: SPACING[6],
        paddingHorizontal: SPACING[4],
    },
    inputGroup: {
        marginBottom: SPACING[5],
    },
    input: {
        minHeight: 56,
    },
    signInButton: {
        marginTop: SPACING[4],
        minHeight: 56,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: SPACING[2],
    },
    buttonText: {
        fontWeight: '600',
    },
    signUpSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING[8],
        flexWrap: 'wrap',
    },
    signUpText: {
        marginRight: SPACING[2],
    },
    signUpButton: {
        paddingHorizontal: SPACING[2],
        paddingVertical: SPACING[1],
    },
    signUpButtonText: {
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        paddingHorizontal: SPACING[4],
    },
    footerText: {
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 300,
    },
});

export default SignIn;
