import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const StudyPlans = () => {
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Input validation
    if (!title.trim()) {
      alert('Please enter a plan title.');
      return;
    }
    if (title.length > 200) {
      alert('Title must be less than 200 characters.');
      return;
    }
    
    const { error } = await supabase
      .from('study_plans')
      .insert([{ title: title.trim(), duration_months: parseInt(duration), user_id: user.id }]);
    if (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create plan. Please try again.');
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
      alert('Failed to delete plan. Please try again.');
      return;
    }
    fetchPlans();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Study Plans</h1>
      
      <Card>
        <CardHeader><CardTitle>Create New Plan</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input label="Plan Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium leading-none block mb-1.5">Duration</label>
              <select className="flex h-10 w-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
              </select>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{plan.duration_months} Month(s)</p>
              <Button variant="danger" size="sm" className="mt-4" onClick={() => handleDelete(plan.id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
        {plans.length === 0 && <p className="text-muted-foreground col-span-full">No study plans created yet.</p>}
      </div>
    </div>
  );
};
