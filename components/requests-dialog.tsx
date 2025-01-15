"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, X, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { User } from "@/types/User";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { useEffect, useState } from "react";
import { useTeams } from "@/hooks/useTeams";
import { toast } from "react-hot-toast";
import { testLog } from "@/hooks/useCollection";

interface RequestsDialogProps {
  teamId: string;
  requests: string[];
  teammates: User[];
  setTeammates: (teammates: User[]) => void;
}

export function RequestsDialog({ 
  teamId,
  requests,
  teammates,
  setTeammates,
}: RequestsDialogProps) {
  const { getUsers } = useFirebaseUser();
  const { loading: teamsLoading, updateRequests } = useTeams();

  const [requestUsers, setRequestUsers] = useState<User[]>([]);

  useEffect(() => {
    testLog('requests', requests);
    const fetchUsers = async () => {
      if (!requests.length) return;
      const users = await getUsers(requests);
      setRequestUsers(users);
    };
    fetchUsers();
  }, [requests]);

  const handleUpdateRequests = async (userId: string, isAccepted: boolean) => {
    try {
      await updateRequests(teamId, userId, isAccepted);

      if (isAccepted) {
        const updatedUsers = await getUsers([userId]);
        if (updatedUsers[0]) {
          const updatedTeammates = [...teammates, updatedUsers[0]];
          setTeammates(updatedTeammates);
        }
      }

      setRequestUsers(prev => prev.filter(user => user.id !== userId));
      
      toast.success(isAccepted ? "Request accepted!" : "Request declined");
    } catch (error) {
      console.error('Error handling request:', error);
      toast.error("Failed to update request");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white text-black border-zinc-700 relative hover:bg-white hover:text-black">
          <Mail className="h-4 w-4" />
          Requests
          {requestUsers.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {requestUsers.length}
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Join Requests</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {requestUsers.length === 0 ? (
            <p className="text-zinc-400 text-center py-4">No pending requests</p>
          ) : (
            requestUsers.map((user) => (
              <Card key={user.id} className="p-4 bg-zinc-800 border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback className="bg-zinc-700 text-white">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-zinc-400">{user.school}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={teamsLoading}
                      onClick={() => handleUpdateRequests(user.id, false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      disabled={teamsLoading}
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleUpdateRequests(user.id, true)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 