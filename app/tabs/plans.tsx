import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function StudyPlansScreen() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('1');

  const fetchPlans = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching plans:', error);
      return;
    }
    if (data) setPlans(data);
  }, [user]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleCreate = async () => {
    if (!user) return;
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a plan title.');
      return;
    }
    if (title.length > 200) {
      Alert.alert('Error', 'Title must be less than 200 characters.');
      return;
    }
    
    const { error } = await supabase
      .from('study_plans')
      .insert([{ title: title.trim(), duration_months: parseInt(duration), user_id: user.id }]);
    if (error) {
      console.error('Error creating plan:', error);
      Alert.alert('Error', 'Failed to create plan. Please try again.');
      return;
    }
    setTitle('');
    fetchPlans();
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('study_plans')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      console.error('Error deleting plan:', error);
      Alert.alert('Error', 'Failed to deletes plan. Please try again.');
      return;
    }
    fetchPlans();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Study Plans</Text>
      
      <Card style={styles.card}>
        <CardHeader>
          <CardTitle>Create New Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            label="Plan Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., 3-month intensive prep"
          />
          <View style={styles.durationContainer}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.pickerContainer}>
              <Button
                title={duration === '1' ? '1 Month' : duration === '2' ? '2 Months' : '3 Months'}
                onPress={() => setDuration(duration === '1' ? '2' : duration === '2' ? '3' : '1')}
                variant="outline"
              />
            </View>
          </View>
          <Button title="Create" onPress={handleCreate} style={styles.button} />
        </CardContent>
      </Card>

      <View style={styles.grid}>
        {plans.map(plan => (
          <Card key={plan.id} style={styles.planCard}>
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={styles.duration}>{plan.duration_months} Month(s)</Text>
              <Button
                title="Delete"
                onPress={() => handleDelete(plan.id)}
                variant="danger"
                size="sm"
                style={styles.deleteButton}
              />
            </CardContent>
          </Card>
        ))}
        {plans.length === 0 && (
          <Text style={styles.empty}>No study plans created yet.</Text>
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
  durationContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 8,
  },
  pickerContainer: {
    width: 120,
  },
  button: {
    marginTop: 8,
  },
  grid: {
    gap: 16,
  },
  planCard: {
    minHeight: 100,
  },
  duration: {
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
