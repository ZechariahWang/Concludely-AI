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

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    const validatePassword = (pass) => {
        return {
            length: pass.length >= 8,
            uppercase: /[A-Z]/.test(pass),
            lowercase: /[a-z]/.test(pass),
            number: /\d/.test(pass)
        };
    };

    const passwordValidation = validatePassword(password);
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (!isPasswordValid) {
            Alert.alert('Error', 'Password must meet all requirements');
            return;
        }

        setLoading(true);
        const result = await signUp(email, password, name);
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
                        <Text variant="h1" style={styles.welcomeTitle}>Create Account</Text>
                        <Text variant="muted" style={styles.welcomeSubtitle}>
                            Join thousands of people on their journaling journey
                        </Text>
                    </View>

                    {/* Sign Up Form */}
                    <Card variant="elevated" style={styles.formCard}>
                        <Card.Content style={styles.formContent}>
                            <View style={styles.inputGroup}>
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    leftIcon="user"
                                    style={styles.input}
                                />
                            </View>

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
                                    placeholder="Create a password"
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

                                {/* Password Requirements */}
                                {password.length > 0 && (
                                    <View style={styles.passwordRequirements}>
                                        <Text variant="small" style={[styles.requirementTitle, { color: theme.mutedForeground }]}>
                                            Password must include:
                                        </Text>
                                        <View style={styles.requirementsList}>
                                            <View style={styles.requirement}>
                                                <Icon
                                                    name={passwordValidation.length ? "check-circle" : "circle"}
                                                    size={14}
                                                    color={passwordValidation.length ? theme.success : theme.mutedForeground}
                                                />
                                                <Text variant="small" style={[styles.requirementText, {
                                                    color: passwordValidation.length ? theme.success : theme.mutedForeground
                                                }]}>
                                                    At least 8 characters
                                                </Text>
                                            </View>
                                            <View style={styles.requirement}>
                                                <Icon
                                                    name={passwordValidation.uppercase ? "check-circle" : "circle"}
                                                    size={14}
                                                    color={passwordValidation.uppercase ? theme.success : theme.mutedForeground}
                                                />
                                                <Text variant="small" style={[styles.requirementText, {
                                                    color: passwordValidation.uppercase ? theme.success : theme.mutedForeground
                                                }]}>
                                                    One uppercase letter
                                                </Text>
                                            </View>
                                            <View style={styles.requirement}>
                                                <Icon
                                                    name={passwordValidation.lowercase ? "check-circle" : "circle"}
                                                    size={14}
                                                    color={passwordValidation.lowercase ? theme.success : theme.mutedForeground}
                                                />
                                                <Text variant="small" style={[styles.requirementText, {
                                                    color: passwordValidation.lowercase ? theme.success : theme.mutedForeground
                                                }]}>
                                                    One lowercase letter
                                                </Text>
                                            </View>
                                            <View style={styles.requirement}>
                                                <Icon
                                                    name={passwordValidation.number ? "check-circle" : "circle"}
                                                    size={14}
                                                    color={passwordValidation.number ? theme.success : theme.mutedForeground}
                                                />
                                                <Text variant="small" style={[styles.requirementText, {
                                                    color: passwordValidation.number ? theme.success : theme.mutedForeground
                                                }]}>
                                                    One number
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Input
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    leftIcon="lock"
                                    rightIcon={showConfirmPassword ? "eye-off" : "eye"}
                                    onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.input}
                                />
                                {confirmPassword.length > 0 && password !== confirmPassword && (
                                    <View style={styles.passwordMatch}>
                                        <Icon name="alert-circle" size={14} color={theme.destructive} />
                                        <Text variant="small" style={[styles.matchText, { color: theme.destructive }]}>
                                            Passwords do not match
                                        </Text>
                                    </View>
                                )}
                                {confirmPassword.length > 0 && password === confirmPassword && (
                                    <View style={styles.passwordMatch}>
                                        <Icon name="check-circle" size={14} color={theme.success} />
                                        <Text variant="small" style={[styles.matchText, { color: theme.success }]}>
                                            Passwords match
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <Button
                                onPress={handleSignUp}
                                disabled={loading || !isPasswordValid || password !== confirmPassword}
                                loading={loading}
                                size="lg"
                                style={styles.signUpButton}
                            >
                                {loading ? (
                                    <View style={styles.loadingContent}>
                                        <ActivityIndicator color={theme.primaryForeground} size="small" />
                                        <Text variant="bodyMedium" style={[styles.buttonText, { color: theme.primaryForeground }]}>
                                            Creating Account...
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.buttonContent}>
                                        <Icon name="user-plus" size={16} color={theme.primaryForeground} style={styles.buttonIcon} />
                                        <Text variant="bodyMedium" style={[styles.buttonText, { color: theme.primaryForeground }]}>
                                            Create Account
                                        </Text>
                                    </View>
                                )}
                            </Button>
                        </Card.Content>
                    </Card>

                    {/* Sign In Link */}
                    <View style={styles.signInSection}>
                        <Text variant="body" style={[styles.signInText, { color: theme.mutedForeground }]}>
                            Already have an account?
                        </Text>
                        <Button
                            variant="ghost"
                            onPress={() => navigation.navigate('SignIn')}
                            style={styles.signInButton}
                        >
                            <Text variant="bodyMedium" style={[styles.signInButtonText, { color: theme.primary }]}>
                                Sign In
                            </Text>
                        </Button>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text variant="small" style={[styles.footerText, { color: theme.mutedForeground }]}>
                            By creating an account, you agree to our Terms of Service and Privacy Policy
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
        paddingTop: SPACING[8],
        paddingBottom: SPACING[8],
    },
    brandingSection: {
        alignItems: 'center',
        marginBottom: SPACING[10],
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
    passwordRequirements: {
        marginTop: SPACING[3],
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[2],
        backgroundColor: THEMES.light.secondary,
        borderRadius: RADIUS.md,
    },
    requirementTitle: {
        marginBottom: SPACING[2],
        fontWeight: '600',
    },
    requirementsList: {
        gap: SPACING[1],
    },
    requirement: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[2],
    },
    requirementText: {
        flex: 1,
    },
    passwordMatch: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING[2],
        marginTop: SPACING[2],
        paddingHorizontal: SPACING[3],
    },
    matchText: {
        fontWeight: '500',
    },
    signUpButton: {
        marginTop: SPACING[6],
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
    signInSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING[8],
        flexWrap: 'wrap',
    },
    signInText: {
        marginRight: SPACING[2],
    },
    signInButton: {
        paddingHorizontal: SPACING[2],
        paddingVertical: SPACING[1],
    },
    signInButtonText: {
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        paddingHorizontal: SPACING[4],
    },
    footerText: {
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 340,
    },
});

export default SignUp;
