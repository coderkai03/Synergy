"use client";

import { getMatchScoreColor, User } from "@/types/User";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { HackerPreview } from "./hacker-preview";
import { HackerProfileContent } from "@/components/hacker-profile-content";

interface HackerProfileDialogProps {
  user: User;
  matchScore?: number;
}

export function HackerProfileDialog({ user, matchScore }: HackerProfileDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer w-full flex items-center justify-between gap-4">
          <div className="flex-1 w-1/2">
            <HackerPreview user={user} />
          </div>
          {matchScore !== undefined && (
            <div className={`text-lg font-semibold px-4 py-2 rounded-r-lg ${getMatchScoreColor(matchScore)}`}>
              {matchScore}% Match
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Hacker Profile</DialogTitle>
        </DialogHeader>
        <HackerProfileContent user={user} matchScore={matchScore} />
      </DialogContent>
    </Dialog>
  );
} 