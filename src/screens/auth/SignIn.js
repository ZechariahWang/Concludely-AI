import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { THEMES, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/app';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Sign in to your account</Text>
                    </View>

                    <View style={[styles.form, { backgroundColor: theme.surfaceElevated }]}>
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme.text }]}>Email</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                                placeholder="Enter your email"
                                placeholderTextColor={theme.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, { color: theme.text }]}>Password</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                                placeholder="Enter your password"
                                placeholderTextColor={theme.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: loading ? theme.textMuted : theme.primary }]}
                            onPress={handleSignIn}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.linkButton}
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                                Don't have an account?{' '}
                                <Text style={[styles.linkTextHighlight, { color: theme.primary }]}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    title: {
        ...TYPOGRAPHY.h1,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
    },
    form: {
        padding: SPACING.xl,
        borderRadius: RADIUS.xl,
        shadowColor: THEMES.light.shadow,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 12,
    },
    inputContainer: {
        marginBottom: SPACING.lg,
    },
    inputLabel: {
        ...TYPOGRAPHY.bodyMedium,
        marginBottom: SPACING.sm,
    },
    input: {
        borderWidth: 1,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        ...TYPOGRAPHY.body,
        minHeight: 48,
    },
    button: {
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.lg,
        minHeight: 48,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        ...TYPOGRAPHY.bodyMedium,
    },
    linkButton: {
        marginTop: SPACING.lg,
        alignItems: 'center',
        padding: SPACING.sm,
    },
    linkText: {
        ...TYPOGRAPHY.caption,
    },
    linkTextHighlight: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
    },
});

export default SignIn;
