import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, className = '', onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.card, style]}>
          {children}
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardHeader, style]}>
      {children}
    </View>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, style, numberOfLines, ellipsizeMode }) => {
  return (
    <Text style={[styles.cardTitle, style]} numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode}>
      {children}
    </Text>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => {
  return (
    <Text style={[styles.cardDescription, style]}>
      {children}
    </Text>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardContent, style]}>
      {children}
    </View>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardFooter, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    padding: 20,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  cardContent: {
    padding: 20,
    paddingTop: 8,
  },
  cardFooter: {
    padding: 20,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
