import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Notes = () => {
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Input validation
    if (!title.trim()) {
      alert('Please enter a note title.');
      return;
    }
    if (!content.trim()) {
      alert('Please enter note content.');
      return;
    }
    if (title.length > 200) {
      alert('Title must be less than 200 characters.');
      return;
    }
    if (content.length > 10000) {
      alert('Content must be less than 10,000 characters.');
      return;
    }
    
    const { error } = await supabase
      .from('notes')
      .insert([{ title: title.trim(), content: content.trim(), user_id: user.id }]);
    if (error) {
      console.error('Error creating note:', error);
      alert('Failed to save note. Please try again.');
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
      alert('Failed to delete note. Please try again.');
      return;
    }
    fetchNotes();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Notes</h1>
      
      <Card>
        <CardHeader><CardTitle>Create New Note</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div>
              <label className="text-sm font-medium leading-none block mb-1.5">Content</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Save Note</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map(note => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
                __html: note.content
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#39;')
              }}></p>
              <Button variant="danger" size="sm" className="mt-4" onClick={() => handleDelete(note.id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
        {notes.length === 0 && <p className="text-muted-foreground col-span-full">No notes added yet.</p>}
      </div>
    </div>
  );
};
