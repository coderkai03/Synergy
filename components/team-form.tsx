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
import { HackathonPreview } from "./hackathon-preview";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTeams } from "@/hooks/useTeams";
import { testLog } from "@/hooks/useCollection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMatchRequests } from "@/hooks/useMatchRequests";
import { GPTTeamRecommendations } from "./gpt-team-recommendations";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";

export function TeamForm({ hackathonId }: { hackathonId?: string }) {
  const { user } = useUser();
  const router = useRouter();
  const { getAllHackathons } = useHackathons();
  const { createTeam, teamNameExists, getUserTeams } = useTeams();
  const { userData } = useFirebaseUser();
  const { createMatchRequest, checkIfPendingRequest } = useMatchRequests();

  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(0);
  const [formData, setFormData] = useState<Team>({
    id: '',
    name: "",
    hackathonId: hackathonId || "",
    hostId: "",
    teammates: [],
    requests: []
  });

  useEffect(() => {
    const fetchUserTeams = async () => {
      const teams = await getUserTeams();
      setUserTeams(teams || []);
    }
    fetchUserTeams();
  }, []);

  useEffect(() => {
    if (hackathonId) {
      const checkPendingRequest = async () => {
        const pending = await checkIfPendingRequest(user?.id || "", hackathonId);
        setPendingRequest(pending);
      }
      checkPendingRequest();
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
      const teamId = await createTeam(formData, userTeams);

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

  const handleMatchRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user?.id || !formData.hackathonId) {
        toast.error("Please select a hackathon");
        return;
      }
      
      await createMatchRequest(user.id, formData.hackathonId);
      toast.success("✨ AI Match requested submitted!");
      router.push('/home');
    } catch (error) {
      console.error("Error creating match request:", error);
      toast.error("Failed to request AI Match");
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
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-zinc-800 border border-gray-700">
        <TabsTrigger value="create">Create Team</TabsTrigger>
        <TabsTrigger value="match">✨ AI Match</TabsTrigger>
      </TabsList>

      <TabsContent value="create">
        <h2 className="text-zinc-400 mb-6 my-8">Create your own team and invite friends to join.</h2>
        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          <div className="space-y-2">
            <Label htmlFor="hackathon">Select Hackathon</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between h-auto min-h-[2.5rem] py-2 bg-gray-800 border border-gray-700 hover:text-white shadow-sm rounded-lg hover:bg-gray-700"
                >
                  {selectedHackathon ? (
                    <HackathonPreview hackathon={selectedHackathon} />
                  ) : (
                    "Select hackathon..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[600px] h-[250px] p-0">
                <Command>
                  <CommandInput placeholder="Search hackathon..." />
                  <CommandEmpty>No hackathon found.</CommandEmpty>
                  <CommandGroup className="h-[200px] overflow-y-auto">
                    {activeHackathons.map((hackathon) => (
                      <CommandItem
                        key={hackathon.id}
                        value={hackathon.name}
                        onSelect={() => {
                          setFormData({
                            ...formData,
                            hackathonId: hackathon.id,
                          });
                          setOpen(false);
                        }}
                        className="py-2 text-black"
                      >
                        <HackathonPreview hackathon={hackathon} />
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            formData.hackathonId === hackathon.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

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
            disabled={isSubmitting || !formData.hackathonId || !formData.name}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="match">
        <h2 className="text-zinc-400 mb-6 my-8">
          Let AI find your perfect team in seconds.
        </h2>
        {!formData.hackathonId ? (
          <div className="space-y-5 text-white">
            <div className="space-y-2">
              <Label htmlFor="hackathon">Select Hackathon</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-[2.5rem] py-2 bg-gray-800 border border-gray-700 hover:text-white shadow-sm rounded-lg hover:bg-gray-700"
                  >
                    {selectedHackathon ? (
                      <HackathonPreview hackathon={selectedHackathon} />
                    ) : (
                      "Select hackathon..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] h-[250px] p-0">
                  <Command>
                    <CommandInput placeholder="Search hackathon..." />
                    <CommandEmpty>No hackathon found.</CommandEmpty>
                    <CommandGroup className="h-[200px] overflow-y-auto">
                      {activeHackathons.map((hackathon) => (
                        <CommandItem
                          key={hackathon.id}
                          value={hackathon.name}
                          onSelect={() => {
                            setFormData({
                              ...formData,
                              hackathonId: hackathon.id,
                            });
                            setOpen(false);
                          }}
                          className="py-2 text-black"
                        >
                          <HackathonPreview hackathon={hackathon} />
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              formData.hackathonId === hackathon.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : userData ? (
          <GPTTeamRecommendations 
            userData={userData} 
            hackathonId={formData.hackathonId} 
          />
        ) : (
          <div>Please sign in to use AI matching.</div>
        )}
      </TabsContent>
    </Tabs>
  );
} 