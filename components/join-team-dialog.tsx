"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Team } from "@/types/Teams";
import { User } from "@/types/User";
import { useTeams } from "@/hooks/useTeams";

interface JoinTeamDialogProps {
  team: Team;
  userData: User;
}

export function JoinTeamDialog({ team, userData }: JoinTeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { updateTeamRequests } = useTeams();

  const alreadyRequested = team.requests?.includes(userData.id);

  const handleJoinRequest = async () => {
    setIsLoading(true);
    try {
      await updateTeamRequests(team.id, userData.id);
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending join request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={alreadyRequested ? "secondary" : "default"}
          className="gap-2"
          disabled={alreadyRequested}
        >
          <UserPlus className="h-4 w-4" />
          {alreadyRequested ? "Request Pending" : "Join Team"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Join {team.name}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Request to join this team?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinRequest}
              disabled={isLoading}
              className="bg-white text-black"
            >
              {isLoading ? "Sending Request..." : "Send Join Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 