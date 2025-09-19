import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { THEMES, TYPOGRAPHY, SPACING, RADIUS } from '../../constants/app';

const Button = ({
    children,
    onPress,
    variant = 'default',
    size = 'default',
    disabled = false,
    loading = false,
    style,
    textStyle,
    theme = 'light',
    ...props
}) => {
    const colors = THEMES[theme];

    const getButtonStyles = () => {
        const baseStyle = {
            borderRadius: RADIUS.md,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderWidth: 1,
        };

        if (disabled) {
            return {
                ...baseStyle,
                backgroundColor: colors.muted,
                borderColor: colors.border,
                opacity: 0.5,
            };
        }

        switch (variant) {
            case 'default':
                return {
                    ...baseStyle,
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 4,
                    elevation: 3,
                };
            case 'destructive':
                return {
                    ...baseStyle,
                    backgroundColor: colors.destructive,
                    borderColor: colors.destructive,
                };
            case 'outline':
                return {
                    ...baseStyle,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                };
            case 'secondary':
                return {
                    ...baseStyle,
                    backgroundColor: colors.secondary,
                    borderColor: colors.secondary,
                };
            case 'ghost':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                };
            case 'link':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    paddingHorizontal: 0,
                    justifyContent: 'flex-start',
                };
            default:
                return baseStyle;
        }
    };

    const getTextStyles = () => {
        if (disabled) {
            return { color: colors.mutedForeground };
        }

        switch (variant) {
            case 'default':
                return { color: colors.primaryForeground };
            case 'destructive':
                return { color: colors.destructiveForeground };
            case 'outline':
                return { color: colors.foreground };
            case 'secondary':
                return { color: colors.secondaryForeground };
            case 'ghost':
                return { color: colors.foreground };
            case 'link':
                return {
                    color: colors.primary,
                    textDecorationLine: 'underline',
                };
            default:
                return { color: colors.foreground };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return {
                    paddingHorizontal: SPACING[3],
                    paddingVertical: SPACING[2],
                    minHeight: 36,
                    borderRadius: RADIUS.sm,
                };
            case 'lg':
                return {
                    paddingHorizontal: SPACING[8],
                    paddingVertical: SPACING[3],
                    minHeight: 44,
                    borderRadius: RADIUS.md,
                };
            case 'icon':
                return {
                    width: 40,
                    height: 40,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    borderRadius: RADIUS.md,
                };
            default:
                return {
                    paddingHorizontal: SPACING[4],
                    paddingVertical: SPACING[2],
                    minHeight: 40,
                    borderRadius: RADIUS.md,
                };
        }
    };

    const getTextSizeStyles = () => {
        switch (size) {
            case 'sm':
                return TYPOGRAPHY.small;
            case 'lg':
                return TYPOGRAPHY.body;
            case 'icon':
                return TYPOGRAPHY.small;
            default:
                return TYPOGRAPHY.small;
        }
    };

    return (
        <TouchableOpacity
            style={[
                getButtonStyles(),
                getSizeStyles(),
                style
            ]}
            onPress={disabled || loading ? undefined : onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={getTextStyles().color}
                    style={{ marginRight: children ? SPACING[2] : 0 }}
                />
            )}
            {children && (
                <Text
                    style={[
                        styles.text,
                        getTextSizeStyles(),
                        getTextStyles(),
                        textStyle
                    ]}
                >
                    {children}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default Button;