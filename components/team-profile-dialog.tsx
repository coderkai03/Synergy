"use client";

import { Team } from "@/types/Teams";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { TeamPreview } from "./team-preview";
import { TeamProfileContent } from "./team-profile-content";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface TeamProfileDialogProps {
  team: Team;
  matchScore?: number;
}

export function TeamProfileDialog({ team, matchScore }: TeamProfileDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer w-full">
          <TeamPreview team={team} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Team Profile</DialogTitle>
        </DialogHeader>
        <TeamProfileContent team={team} matchScore={matchScore} />
      </DialogContent>
    </Dialog>
  );
} 