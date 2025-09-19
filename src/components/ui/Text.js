import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { THEMES, TYPOGRAPHY } from '../../constants/app';

const Text = ({
    children,
    variant = 'body',
    color,
    align = 'left',
    weight,
    style,
    theme = 'light',
    ...props
}) => {
    const colors = THEMES[theme];

    const getTextColor = () => {
        if (color) return color;

        switch (variant) {
            case 'display':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
                return colors.foreground;
            case 'large':
            case 'body':
            case 'bodyMedium':
                return colors.foreground;
            case 'small':
            case 'muted':
            case 'caption':
                return colors.mutedForeground;
            case 'label':
                return colors.foreground;
            default:
                return colors.foreground;
        }
    };

    const getTextStyle = () => {
        const baseStyle = styles[variant] || styles.body;

        return {
            ...baseStyle,
            color: getTextColor(),
            textAlign: align,
            ...(weight && { fontWeight: weight }),
        };
    };

    return (
        <RNText style={[getTextStyle(), style]} {...props}>
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    display: TYPOGRAPHY.display,
    h1: TYPOGRAPHY.h1,
    h2: TYPOGRAPHY.h2,
    h3: TYPOGRAPHY.h3,
    h4: TYPOGRAPHY.h4,
    large: TYPOGRAPHY.large,
    body: TYPOGRAPHY.body,
    bodyMedium: TYPOGRAPHY.bodyMedium,
    small: TYPOGRAPHY.small,
    muted: TYPOGRAPHY.muted,
    caption: TYPOGRAPHY.caption,
    label: TYPOGRAPHY.label,
    code: TYPOGRAPHY.code,
});

export default Text;