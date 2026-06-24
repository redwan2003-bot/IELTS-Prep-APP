import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  isLoading,
  className = '',
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'ghost':
        return styles.ghost;
      case 'danger':
        return styles.danger;
      default:
        return styles.primary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return styles.sm;
      case 'md':
        return styles.md;
      case 'lg':
        return styles.lg;
      default:
        return styles.md;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getVariantStyles(),
        getSizeStyles(),
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#3B82F6' : '#FFFFFF'} />
        </View>
      ) : (
        <Text style={[
          styles.text,
          (variant === 'outline' || variant === 'ghost') && styles.textOutline,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#3B82F6',
  },
  secondary: {
    backgroundColor: '#64748B',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#EF4444',
  },
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  lg: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    minHeight: 44,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  textOutline: {
    color: '#0F172A',
  },
  loadingContainer: {
    padding: 4,
  },
});
