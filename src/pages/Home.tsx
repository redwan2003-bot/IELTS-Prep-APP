import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-primary">
          Master Your IELTS Journey
        </h1>
        <p className="text-xl text-muted-foreground">
          Your daily companion for study planning, note-taking, and staying on track.
        </p>
      </div>
      <div className="flex space-x-4">
        <Link to="/register">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline">Sign In</Button>
        </Link>
      </div>
    </div>
  );
};
