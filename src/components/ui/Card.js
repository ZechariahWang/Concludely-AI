import React from 'react';
import { View, StyleSheet } from 'react-native';
import { THEMES, SPACING, RADIUS } from '../../constants/app';

const Card = ({
  children,
  variant = 'default',
  size = 'default',
  style,
  theme = 'light',
  ...props
}) => {
  const colors = THEMES[theme];

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 8,
        };
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.card,
          shadowColor: colors.shadowSoft,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 3,
          elevation: 2,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: SPACING[3],
          borderRadius: RADIUS.md,
        };
      case 'lg':
        return {
          padding: SPACING[8],
          borderRadius: RADIUS.xl,
        };
      default:
        return {
          padding: SPACING[6],
          borderRadius: RADIUS.lg,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyles(),
        getSizeStyles(),
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const CardHeader = ({ children, style, theme = 'light' }) => (
  <View style={[styles.header, style]}>
    {children}
  </View>
);

const CardContent = ({ children, style }) => (
  <View style={[styles.content, style]}>
    {children}
  </View>
);

const CardFooter = ({ children, style }) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    // Base styles handled by variant and size
  },
  header: {
    marginBottom: SPACING[4],
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: SPACING[4],
  },
});

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;