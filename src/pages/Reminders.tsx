import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Reminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
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
    fetchReminders();
    requestNotificationPermission();
  }, [fetchReminders, requestNotificationPermission]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Input validation
    if (!title.trim()) {
      alert('Please enter a reminder title.');
      return;
    }
    if (!reminderTime) {
      alert('Please select a date and time.');
      return;
    }
    if (title.length > 200) {
      alert('Title must be less than 200 characters.');
      return;
    }
    const reminderDate = new Date(reminderTime);
    if (reminderDate <= new Date()) {
      alert('Reminder time must be in the future.');
      return;
    }
    
    const timeIso = reminderDate.toISOString();
    const { error } = await supabase
      .from('reminders')
      .insert([{ title: title.trim(), reminder_time: timeIso, user_id: user.id }]);
    if (error) {
      console.error('Error creating reminder:', error);
      alert('Failed to create reminder. Please try again.');
      return;
    }
    setTitle('');
    setReminderTime('');
    fetchReminders();

    // Setup local notification timeout if time is in future (basic implementation)
    const timeDiff = reminderDate.getTime() - new Date().getTime();
    if (timeDiff > 0 && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification('IELTS Reminder', { body: title });
      }, timeDiff);
    }
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
      alert('Failed to delete reminder. Please try again.');
      return;
    }
    fetchReminders();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Reminders</h1>
      
      <Card>
        <CardHeader><CardTitle>Add New Reminder</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input label="Reminder Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Input label="Date & Time" type="datetime-local" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} required />
            </div>
            <Button type="submit">Add Reminder</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reminders.map(rem => (
          <Card key={rem.id}>
            <CardHeader>
              <CardTitle>{rem.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{new Date(rem.reminder_time).toLocaleString()}</p>
              <Button variant="danger" size="sm" className="mt-4" onClick={() => handleDelete(rem.id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
        {reminders.length === 0 && <p className="text-muted-foreground col-span-full">No upcoming reminders.</p>}
      </div>
    </div>
  );
};
