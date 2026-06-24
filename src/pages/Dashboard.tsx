import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
      <div className="p-6 bg-card border rounded-lg shadow-sm">
        <p className="text-card-foreground">Welcome back, {user?.email}!</p>
        <p className="text-sm text-muted-foreground mt-2">
          Your IELTS journey continues. Access your study tools below.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/plans">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Study Plans</CardTitle>
              <CardDescription>Manage your 1, 2, or 3-month schedules</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/notes">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Jot down important concepts and vocabulary</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/reminders">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
              <CardDescription>Set push notifications for your daily tasks</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/roadmaps">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle>Roadmaps</CardTitle>
              <CardDescription>Upload and view your PDF/DOC roadmaps</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};
