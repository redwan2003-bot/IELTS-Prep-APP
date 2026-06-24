import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function NotesScreen() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }
    if (data) setNotes(data);
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreate = async () => {
    if (!user) return;
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a note title.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter note content.');
      return;
    }
    if (title.length > 200) {
      Alert.alert('Error', 'Title must be less than 200 characters.');
      return;
    }
    if (content.length > 10000) {
      Alert.alert('Error', 'Content must be less than 10,000 characters.');
      return;
    }
    
    const { error } = await supabase
      .from('notes')
      .insert([{ title: title.trim(), content: content.trim(), user_id: user.id }]);
    if (error) {
      console.error('Error creating note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
      return;
    }
    setTitle('');
    setContent('');
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'Failed to delete note. Please try again.');
      return;
    }
    fetchNotes();
  };

  const sanitizeContent = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notes</Text>
      
      <Card style={styles.card}>
        <CardHeader>
          <CardTitle>Create New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Note title"
          />
          <Input
            label="Content"
            value={content}
            onChangeText={setContent}
            placeholder="Write your note here..."
            multiline
            numberOfLines={4}
          />
          <Button title="Save Note" onPress={handleCreate} style={styles.button} />
        </CardContent>
      </Card>

      <View style={styles.grid}>
        {notes.map(note => (
          <Card key={note.id} style={styles.noteCard}>
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={styles.noteContent} numberOfLines={3}>
                {note.content}
              </Text>
              <Button
                title="Delete"
                onPress={() => handleDelete(note.id)}
                variant="danger"
                size="sm"
                style={styles.deleteButton}
              />
            </CardContent>
          </Card>
        ))}
        {notes.length === 0 && (
          <Text style={styles.empty}>No notes added yet.</Text>
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
  noteCard: {
    minHeight: 120,
  },
  noteContent: {
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
    lineHeight: 20,
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
