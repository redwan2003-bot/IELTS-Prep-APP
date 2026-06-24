import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function RoadmapsScreen() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const fetchRoadmaps = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('uploaded_roadmaps')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching roadmaps:', error);
      return;
    }
    if (data) setRoadmaps(data);
  }, [user]);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        
        // File validation
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(selectedFile.mimeType || '')) {
          Alert.alert('Error', 'Only PDF and DOC files are allowed.');
          return;
        }
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (selectedFile.size && selectedFile.size > maxSize) {
          Alert.alert('Error', 'File size must be less than 10MB.');
          return;
        }

        setFile(selectedFile);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (!user || !file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      // Upload to Storage
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      } as any);

      const { error: uploadError } = await supabase.storage.from('roadmaps').upload(filePath, formData as any);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        Alert.alert('Error', 'Failed to upload file. Please try again.');
        setUploading(false);
        return;
      }

      // Save to Database
      const { error: dbError } = await supabase.from('uploaded_roadmaps').insert([{
        user_id: user.id,
        file_name: file.name,
        file_path: filePath,
        content_type: file.mimeType || 'application/octet-stream',
      }]);
      if (dbError) {
        console.error('Error saving roadmap record:', dbError);
        Alert.alert('Error', 'Failed to save roadmap record. Please try again.');
        setUploading(false);
        return;
      }

      setFile(null);
      setUploading(false);
      fetchRoadmaps();
      Alert.alert('Success', 'Roadmap uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
      setUploading(false);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from('roadmaps').download(filePath);
      if (error) {
        console.error('Error downloading file:', error);
        Alert.alert('Error', 'Failed to download file. Please try again.');
        return;
      }
      
      // For React Native, we would need to use FileSystem to save the file
      // This is a simplified version - in production you'd use expo-file-system
      Alert.alert('Download', `File ${fileName} would be downloaded here (requires expo-file-system for full implementation)`);
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file.');
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!user) return;
    
    try {
      const { error: storageError } = await supabase.storage.from('roadmaps').remove([filePath]);
      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        Alert.alert('Error', 'Failed to delete file. Please try again.');
        return;
      }
      const { error: dbError } = await supabase
        .from('uploaded_roadmaps')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (dbError) {
        console.error('Error deleting roadmap record:', dbError);
        Alert.alert('Error', 'Failed to delete roadmap record. Please try again.');
        return;
      }
      fetchRoadmaps();
      Alert.alert('Success', 'Roadmap deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete roadmap.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Uploaded Roadmaps</Text>
      
      <Card style={styles.card}>
        <CardHeader>
          <CardTitle>Upload PDF/DOC Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            title={file ? file.name : 'Select File'}
            onPress={pickDocument}
            variant={file ? 'primary' : 'outline'}
            style={styles.fileButton}
          />
          <Button
            title="Upload File"
            onPress={handleUpload}
            isLoading={uploading}
            disabled={!file}
            style={styles.uploadButton}
          />
        </CardContent>
      </Card>

      <View style={styles.grid}>
        {roadmaps.map(doc => (
          <Card key={doc.id} style={styles.roadmapCard}>
            <CardHeader>
              <CardTitle numberOfLines={1} ellipsizeMode="tail">{doc.file_name}</CardTitle>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Download"
                  onPress={() => handleDownload(doc.file_path, doc.file_name)}
                  variant="outline"
                  size="sm"
                  style={styles.actionButton}
                />
                <Button
                  title="Delete"
                  onPress={() => handleDelete(doc.id, doc.file_path)}
                  variant="danger"
                  size="sm"
                  style={styles.actionButton}
                />
              </View>
            </CardContent>
          </Card>
        ))}
        {roadmaps.length === 0 && (
          <Text style={styles.empty}>No roadmaps uploaded yet.</Text>
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
  fileButton: {
    marginBottom: 12,
  },
  uploadButton: {
    marginTop: 8,
  },
  grid: {
    gap: 16,
  },
  roadmapCard: {
    minHeight: 100,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
  empty: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 20,
  },
});
