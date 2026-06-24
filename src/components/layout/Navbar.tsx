import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">IELTS Prep</Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/plans" className="text-sm font-medium hover:text-primary transition-colors">Plans</Link>
                <Link to="/notes" className="text-sm font-medium hover:text-primary transition-colors">Notes</Link>
                <Link to="/reminders" className="text-sm font-medium hover:text-primary transition-colors">Reminders</Link>
                <Link to="/roadmaps" className="text-sm font-medium hover:text-primary transition-colors">Roadmaps</Link>
                <span className="text-sm text-muted-foreground hidden sm:block ml-4">{user.email}</span>
                <Button variant="outline" size="sm" onClick={signOut}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button size="sm">Sign Up</Button></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
