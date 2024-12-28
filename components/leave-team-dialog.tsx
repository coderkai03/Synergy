import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Team } from "@/types/Teams";
import { User } from "@/types/User";
import { LogOut } from "lucide-react";
import { SelectNewHostDialog } from "./select-new-host-dialog";
import { DeleteTeamDialog } from "@/components/delete-team-dialog";

interface LeaveTeamDialogProps {
  team: Team;
  userData: User;
  teammates: User[];
  onLeaveTeam: (newHostId?: string) => Promise<void>;
}

export function LeaveTeamDialog({ 
  team, 
  userData, 
  teammates, 
  onLeaveTeam,
}: LeaveTeamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showHostDialog, setShowHostDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const isHost = team.hostId === userData.id;
  const otherTeammates = teammates.filter(t => t.id !== userData.id);
  const isLastMember = otherTeammates.length === 0;

  const handleInitialLeave = () => {
    if (isHost) {
      if (isLastMember) {
        setShowDeleteDialog(true);
      } else {
        setShowHostDialog(true);
      }
    } else {
      handleLeave();
    }
    setIsOpen(false);
  };

  const handleLeave = async (newHostId?: string) => {
    await onLeaveTeam(newHostId);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Leave Team
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this team?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleInitialLeave}>
              Leave Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isHost && !isLastMember && (
        <SelectNewHostDialog
          open={showHostDialog}
          onOpenChange={setShowHostDialog}
          teammates={otherTeammates}
          onSelectHost={(newHostId) => handleLeave(newHostId)}
        />
      )}

      {isHost && isLastMember && (
        <DeleteTeamDialog
          team={team}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          teamName={team.name}
        />
      )}
    </>
  );
}