import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useTeams, Team } from '@/hooks/useTeams';

interface TeamSelectorProps {
  onTeamChange: (team: Team) => void;
}

export const TeamSelector = ({ onTeamChange }: TeamSelectorProps) => {
  const { teams, currentTeam, setCurrentTeam, createTeam } = useTeams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });

  const handleTeamSelect = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
      onTeamChange(team);
    }
  };

  const handleCreateTeam = async () => {
    if (newTeam.name.trim()) {
      await createTeam(newTeam.name, newTeam.description);
      setNewTeam({ name: '', description: '' });
      setIsCreateOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={currentTeam?.id || ''} onValueChange={handleTeamSelect}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                placeholder="Enter team name"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="teamDescription">Description (Optional)</Label>
              <Textarea
                id="teamDescription"
                placeholder="Describe your team project"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              />
            </div>
            <Button onClick={handleCreateTeam} className="w-full">
              Create Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};