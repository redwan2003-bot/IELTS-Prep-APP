import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Roadmaps = () => {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;

    // File validation
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF and DOC files are allowed.');
      return;
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload to Storage
    const { error: uploadError } = await supabase.storage.from('roadmaps').upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      alert('Failed to upload file. Please try again.');
      setUploading(false);
      return;
    }

    // Save to Database
    const { error: dbError } = await supabase.from('uploaded_roadmaps').insert([{
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      content_type: file.type
    }]);
    if (dbError) {
      console.error('Error saving roadmap record:', dbError);
      alert('Failed to save roadmap record. Please try again.');
      setUploading(false);
      return;
    }

    setFile(null);
    setUploading(false);
    fetchRoadmaps();
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage.from('roadmaps').download(filePath);
    if (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!user) return;
    const { error: storageError } = await supabase.storage.from('roadmaps').remove([filePath]);
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      alert('Failed to delete file. Please try again.');
      return;
    }
    const { error: dbError } = await supabase
      .from('uploaded_roadmaps')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (dbError) {
      console.error('Error deleting roadmap record:', dbError);
      alert('Failed to delete roadmap record. Please try again.');
      return;
    }
    fetchRoadmaps();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Uploaded Roadmaps</h1>
      
      <Card>
        <CardHeader><CardTitle>Upload PDF/DOC Roadmap</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="flex gap-4 items-end flex-wrap">
            <div className="flex-1">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium" 
                required 
              />
            </div>
            <Button type="submit" isLoading={uploading} disabled={!file}>Upload File</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map(doc => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle className="truncate" title={doc.file_name}>{doc.file_name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => handleDownload(doc.file_path, doc.file_name)}>Download</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(doc.id, doc.file_path)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
        {roadmaps.length === 0 && <p className="text-muted-foreground col-span-full">No roadmaps uploaded yet.</p>}
      </div>
    </div>
  );
};
