import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RemindersScreen() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  const requestNotificationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('ielts-reminders', {
        name: 'IELTS Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications to receive reminders.');
    }
  }, []);

  const fetchReminders = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('reminder_time', { ascending: true });
    if (error) {
      console.error('Error fetching reminders:', error);
      return;
    }
    if (data) setReminders(data);
  }, [user]);

  useEffect(() => {
    requestNotificationPermission();
    fetchReminders();
  }, [requestNotificationPermission, fetchReminders]);

  const scheduleNotification = async (title: string, body: string, scheduledTime: Date) => {
    try {
      const trigger = scheduledTime.getTime() - Date.now();
      
      if (trigger > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: trigger / 1000,
            repeats: false,
          },
        });
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const handleCreate = async () => {
    if (!user) return;
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a reminder title.');
      return;
    }
    if (!reminderTime) {
      Alert.alert('Error', 'Please select a date and time.');
      return;
    }
    if (title.length > 200) {
      Alert.alert('Error', 'Title must be less than 200 characters.');
      return;
    }
    
    const reminderDate = new Date(reminderTime);
    if (reminderDate <= new Date()) {
      Alert.alert('Error', 'Reminder time must be in the future.');
      return;
    }
    
    const timeIso = reminderDate.toISOString();
    const { error } = await supabase
      .from('reminders')
      .insert([{ title: title.trim(), reminder_time: timeIso, user_id: user.id }]);
    if (error) {
      console.error('Error creating reminder:', error);
      Alert.alert('Error', 'Failed to create reminder. Please try again.');
      return;
    }
    
    // Schedule local notification
    await scheduleNotification('IELTS Reminder', title, reminderDate);
    
    setTitle('');
    setReminderTime('');
    fetchReminders();
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      console.error('Error deleting reminder:', error);
      Alert.alert('Error', 'Failed to delete reminder. Please try again.');
      return;
    }
    // Cancel scheduled notification
    await Notifications.cancelScheduledNotificationAsync(id);
    fetchReminders();
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reminders</Text>
      
      <Card style={styles.card}>
        <CardHeader>
          <CardTitle>Add New Reminder</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            label="Reminder Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Practice listening test"
          />
          <Input
            label="Date & Time"
            value={reminderTime}
            onChangeText={setReminderTime}
            placeholder="YYYY-MM-DD HH:MM"
          />
          <Button title="Add Reminder" onPress={handleCreate} style={styles.button} />
        </CardContent>
      </Card>

      <View style={styles.grid}>
        {reminders.map(rem => (
          <Card key={rem.id} style={styles.reminderCard}>
            <CardHeader>
              <CardTitle>{rem.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={styles.time}>{formatDateTime(rem.reminder_time)}</Text>
              <Button
                title="Delete"
                onPress={() => handleDelete(rem.id)}
                variant="danger"
                size="sm"
                style={styles.deleteButton}
              />
            </CardContent>
          </Card>
        ))}
        {reminders.length === 0 && (
          <Text style={styles.empty}>No upcoming reminders.</Text>
        )}
      </View>
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
  card: {
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
  },
  grid: {
    gap: 16,
  },
  reminderCard: {
    minHeight: 100,
  },
  time: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  deleteButton: {
    marginTop: 8,
  },
  empty: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 20,
  },
});
