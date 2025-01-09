import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { AlertTriangle } from "lucide-react";
  import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/Teams";
import { useRouter } from "next/navigation";

  interface DeleteTeamDialogProps {
    team: Team;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teamName: string;
  }
  
  export function DeleteTeamDialog({
    team,
    open,
    onOpenChange,
    teamName,
  }: DeleteTeamDialogProps) {
    const router = useRouter();
    const { deleteTeam } = useTeams();
  
    const handleDelete = async () => {
      await deleteTeam(team.id, team.hostId);
      onOpenChange(false);
      router.push('/teams');
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Team
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                You are the last member of <span className="font-semibold">{teamName}</span>.
              </p>
              <p>
                Leaving will permanently delete this team. This action cannot be undone.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }