import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard</Text>
      
      <Card style={styles.welcomeCard}>
        <CardHeader>
          <Text style={styles.welcomeText}>Welcome back, {user?.email}!</Text>
          <Text style={styles.subText}>
            Your IELTS journey continues. Access your study tools below.
          </Text>
        </CardHeader>
      </Card>

      <View style={styles.grid}>
        <Card style={styles.card} onPress={() => router.push('/tabs/plans')}>
          <CardHeader>
            <CardTitle style={styles.cardTitle}>Study Plans</CardTitle>
            <CardDescription>Manage your 1, 2, or 3-month schedules</CardDescription>
          </CardHeader>
        </Card>

        <Card style={styles.card} onPress={() => router.push('/tabs/notes')}>
          <CardHeader>
            <CardTitle style={styles.cardTitle}>Notes</CardTitle>
            <CardDescription>Jot down important concepts and vocabulary</CardDescription>
          </CardHeader>
        </Card>

        <Card style={styles.card} onPress={() => router.push('/tabs/reminders')}>
          <CardHeader>
            <CardTitle style={styles.cardTitle}>Reminders</CardTitle>
            <CardDescription>Set push notifications for your daily tasks</CardDescription>
          </CardHeader>
        </Card>

        <Card style={styles.card} onPress={() => router.push('/tabs/roadmaps')}>
          <CardHeader>
            <CardTitle style={styles.cardTitle}>Roadmaps</CardTitle>
            <CardDescription>Upload and view your PDF/DOC roadmaps</CardDescription>
          </CardHeader>
        </Card>
      </View>

      <Button
        title="Logout"
        onPress={signOut}
        variant="danger"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 20,
  },
  welcomeCard: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  subText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  grid: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    minHeight: 100,
  },
  cardTitle: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
  },
});
