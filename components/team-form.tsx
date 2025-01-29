"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { Team } from "@/types/Teams";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useHackathons } from "@/hooks/useHackathons";
import { Hackathon } from "@/types/Hackathons";
import { useTeams } from "@/hooks/useTeams";
import { testLog } from "@/hooks/useCollection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GPTTeamRecommendations } from "./gpt-team-recommendations";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { HackathonSelector } from "./hackathon-selector";
import { User } from "@/types/User";


export function TeamForm({ hackathonId }: { hackathonId?: string }) {
  const { user } = useUser();
  const router = useRouter();

  const { getAllHackathons } = useHackathons();
  const { createTeam, teamNameExists } = useTeams();
  const { getUserData } = useFirebaseUser();

  const [userData, setUserData] = useState<User | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Team>({
    id: '',
    name: "",
    hackathonId: hackathonId || "",
    hostId: "",
    teammates: [],
    requests: []
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const data = await getUserData(user.id);

      if (!data) return
      setUserData(data);
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (hackathonId) {
      setFormData(prev => ({
        ...prev,
        hackathonId
      }));
    }
  }, [hackathonId]);

  useEffect(() => {
    getAllHackathons().then(setHackathons);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = user?.id;

    if (!userId) {
      toast.error("User not found");
      setIsSubmitting(false);
      return;
    }

    if (!formData.hackathonId) {
      toast.error("Please select a hackathon");
      setIsSubmitting(false);
      return;
    }

    const exists = await teamNameExists(formData.name, formData.hackathonId);
    if (exists) {
      toast.error("Team already exists");
      setIsSubmitting(false);
      return;
    }

    testLog("TEAM", formData);

    try {
      formData.hostId = user?.id || "";
      formData.teammates = [user?.id || ""];
      const teamId = await createTeam(formData, user?.id || "");

      if (teamId && teamId !== 'alreadyInTeam') {
        router.push(`/teams/${teamId}`);
        toast.success("Team created");
      } else if (teamId === 'alreadyInTeam') {
        toast.error("You are already in a team for this hackathon");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to Form Team");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActiveHackathons = (hackathons: Hackathon[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    return hackathons
      .filter((hackathon) => {
        const endDate = new Date(hackathon.endDate);
        return endDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const activeHackathons = getActiveHackathons(hackathons);
  const selectedHackathon = activeHackathons.find(h => h.id === formData.hackathonId);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-white" htmlFor="hackathon">Select Hackathon</Label>
        <HackathonSelector
          hackathons={activeHackathons}
          selectedHackathon={selectedHackathon}
          onSelect={(hackathonId) => setFormData({ ...formData, hackathonId })}
        />
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-800 border border-gray-700">
          <TabsTrigger value="create">Create Team</TabsTrigger>
          <TabsTrigger value="match">✨ AI Match</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <h2 className="text-zinc-400 mb-6 my-8">Create your own team and invite friends to join.</h2>
          <form onSubmit={handleSubmit} className="space-y-5 text-white">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                maxLength={20}
                required
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
              disabled={isSubmitting || !formData.name}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="match">
          <h2 className="text-zinc-400 mb-6 my-8">
            Let AI find your perfect team in seconds.
          </h2>
          {userData ? (
            <GPTTeamRecommendations 
              userData={userData} 
              hackathonId={formData.hackathonId}
              isGracePeriod={selectedHackathon?.grace_period || false}
            />
          ) : (
            <div>Please sign in to use AI matching.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 