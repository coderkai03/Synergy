"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Team } from "@/types/Teams";
import { User } from "@/types/User";
import { useTeams } from "@/hooks/useTeams";
import { useRouter } from "next/navigation";
import { RequireProfile } from "./require-profile";

interface JoinTeamDialogProps {
  team: Team;
  userData: User;
}

export function JoinTeamDialog({ team, userData }: JoinTeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const router = useRouter();

  const { updateTeamRequests } = useTeams();
  

  const alreadyRequested = team.requests?.includes(userData.id);

  const handleJoinRequest = async () => {
    if (!userData) {
      router.push("/account-setup");
    }

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
        <RequireProfile>
          <Button
            variant={alreadyRequested ? "secondary" : "default"}
            className="gap-2 bg-white text-black hover:bg-white"
            disabled={alreadyRequested}
            onClick={() => setIsOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            {alreadyRequested ? "Request Pending" : "Join Team"}
          </Button>
        </RequireProfile>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Join {team.name}</DialogTitle>
          <DialogDescription className="text-white">
            Request to join this team?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinRequest}
              disabled={isLoading}
              className="bg-white text-black hover:bg-white"
            >
              {isLoading ? "Sending Request..." : "Send Join Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 