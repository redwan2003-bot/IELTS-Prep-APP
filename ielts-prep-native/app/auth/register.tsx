import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Registration Failed', error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <CardContent style={styles.successContent}>
            <Button
              title="Go to Login"
              onPress={() => router.push('/auth/login')}
              style={styles.button}
            />
          </CardContent>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <CardHeader>
          <CardTitle style={styles.title}>Create an Account</CardTitle>
          <CardDescription style={styles.description}>
            Sign up to start your IELTS journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          <Button
            title="Sign Up"
            onPress={handleRegister}
            isLoading={loading}
            style={styles.button}
          />
        </CardContent>
        <CardFooter style={styles.footer}>
          <View style={styles.footerContent}>
            <Button
              title="Sign In"
              onPress={() => router.push('/auth/login')}
              variant="outline"
              size="sm"
            />
          </View>
        </CardFooter>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  footer: {
    justifyContent: 'center',
  },
  footerContent: {
    alignItems: 'center',
  },
  successContent: {
    padding: 20,
    alignItems: 'center',
  },
});
