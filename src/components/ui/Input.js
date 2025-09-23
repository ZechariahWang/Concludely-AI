import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEMES, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/app';

const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    disabled = false,
    size = 'default',
    variant = 'default',
    style,
    inputStyle,
    theme = 'light',
    leftIcon,
    rightIcon,
    onRightIconPress,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const colors = THEMES[theme];

    const getContainerStyles = () => {
        const baseStyle = {
            borderWidth: 1,
            borderRadius: RADIUS.md,
            backgroundColor: colors.background,
        };

        if (disabled) {
            return {
                ...baseStyle,
                backgroundColor: colors.muted,
                borderColor: colors.border,
                opacity: 0.5,
            };
        }

        if (error) {
            return {
                ...baseStyle,
                borderColor: colors.destructive,
                backgroundColor: colors.background,
            };
        }

        if (isFocused) {
            return {
                ...baseStyle,
                borderColor: colors.ring,
                backgroundColor: colors.background,
                shadowColor: colors.ring,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
            };
        }

        return {
            ...baseStyle,
            borderColor: colors.input,
            backgroundColor: colors.background,
        };
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return {
                    paddingHorizontal: SPACING[3],
                    paddingVertical: SPACING[2],
                    minHeight: 36,
                };
            case 'lg':
                return {
                    paddingHorizontal: SPACING[4],
                    paddingVertical: SPACING[3],
                    minHeight: 44,
                };
            default:
                return {
                    paddingHorizontal: SPACING[3],
                    paddingVertical: SPACING[2.5],
                    minHeight: 40,
                };
        }
    };

    const getTextStyles = () => {
        return {
            ...TYPOGRAPHY.body,
            color: disabled ? colors.mutedForeground : colors.foreground,
            flex: 1,
        };
    };

    return (
        <View style={style}>
            {label && (
                <Text style={[styles.label, { color: colors.foreground }]}>
                    {label}
                </Text>
            )}
            <View style={[getContainerStyles(), getSizeStyles(), styles.inputContainer]}>
                {leftIcon && (
                    <View style={styles.iconContainer}>
                        {leftIcon}
                    </View>
                )}
                <TextInput
                    style={[getTextStyles(), inputStyle]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.mutedForeground}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={onRightIconPress}
                        disabled={disabled}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text style={[styles.error, { color: colors.destructive }]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        ...TYPOGRAPHY.label,
        marginBottom: SPACING[1.5],
    },
    error: {
        ...TYPOGRAPHY.small,
        marginTop: SPACING[1],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        paddingHorizontal: SPACING[2],
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Input;