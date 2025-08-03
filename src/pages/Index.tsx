import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { TeamSelector } from '@/components/TeamSelector';
import { TaskBoard } from '@/components/TaskBoard';
import { Team } from '@/hooks/useTeams';

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">CollabTask</h1>
            <TeamSelector onTeamChange={setSelectedTeam} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {user.email}</span>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </header>

        {selectedTeam ? (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border">
              <h2 className="text-xl font-semibold mb-2">{selectedTeam.name}</h2>
              {selectedTeam.description && (
                <p className="text-muted-foreground">{selectedTeam.description}</p>
              )}
            </div>
            <TaskBoard teamId={selectedTeam.id} />
          </div>
        ) : (
          <div className="text-center p-12">
            <h2 className="text-2xl font-semibold mb-4">Welcome to CollabTask!</h2>
            <p className="text-muted-foreground mb-6">
              Create or select a team to start managing your project tasks.
            </p>
            <p className="text-sm text-muted-foreground">
              Use the team selector above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
