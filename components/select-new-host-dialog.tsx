import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/User";

interface SelectNewHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teammates: User[];
  onSelectHost: (newHostId: string) => Promise<void>;
}

export function SelectNewHostDialog({ 
  open, 
  onOpenChange, 
  teammates, 
  onSelectHost 
}: SelectNewHostDialogProps) {
  const [selectedHostId, setSelectedHostId] = useState<string>("");

  const handleConfirm = async () => {
    if (!selectedHostId) return;
    await onSelectHost(selectedHostId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select New Host</DialogTitle>
          <DialogDescription>
            As the host, you must select a new host before leaving the team.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">
            Select New Host
          </label>
          <Select
            value={selectedHostId}
            onValueChange={setSelectedHostId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a new host" />
            </SelectTrigger>
            <SelectContent>
              {teammates.map((teammate) => (
                <SelectItem key={teammate.id} value={teammate.id}>
                  {teammate.firstName} {teammate.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!selectedHostId}
          >
            Confirm New Host
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 