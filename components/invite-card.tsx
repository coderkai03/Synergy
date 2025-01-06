import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { Invite, Team } from "@/types/Teams";
import { User } from "@/types/User";
import { Hackathon } from "@/types/Hackathons";

interface InviteCardProps {
  invite: Invite;
  inviter: User;
  team: Team;
  hackathon: Hackathon;
  onDecline: () => void;
  onJoin: () => void;
}

export function InviteCard({ invite, inviter, team, hackathon, onDecline, onJoin }: InviteCardProps) {
  return (
    <div className="flex flex-col p-3 border border-zinc-700 rounded bg-zinc-800">
      <div className="text-sm text-zinc-400 mb-3">
        from {inviter?.firstName || 'Unknown'}
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="font-medium text-white">
            Invited you to join <a href={`/teams/${team?.id}`} className="hover:underline text-yellow-400">{team?.name}</a>
          </div>
          <div className="text-sm text-zinc-400">
            {hackathon?.name || 'Unknown Hackathon'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDecline} 
            className="text-white hover:bg-zinc-700"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onJoin} 
            className="bg-white text-black hover:bg-zinc-200"
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
} 