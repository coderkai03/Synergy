"use client";

import * as React from "react";
import { ExternalLink, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hackathons as hackathonsList } from "@/constants/hackathonlist";
import { Hackathon } from "@/constants/hackathonlist";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { DialogHeader } from "./ui/dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function AllHackathons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [inviteLink, setInviteLink] = useState("");
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon>();
  const [teamName, setTeamName] = useState("");
  const [teamVisibility, setTeamVisibility] = useState("public");

  // Replace the hardcoded hackathons array with the imported data
  const hackathons: Hackathon[] = hackathonsList;

  //user selected hackathons
  const [addedHackathons, setAddedHackathons] = React.useState<string[]>([]);

  const filteredHackathons = React.useMemo(() => {
    return hackathons.filter((hackathon) => {
      const matchesSearch = hackathon.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDate =
        !dateFilter || new Date(hackathon.date) >= new Date(dateFilter);
      const matchesLocation =
        locationFilter === "all" ||
        (locationFilter === "online" && hackathon.isOnline) ||
        (locationFilter === "in-person" && !hackathon.isOnline);
      return matchesSearch && matchesDate && matchesLocation;
    });
  }, [hackathons, searchTerm, dateFilter, locationFilter]);

  const handleAddToHome = (hackathonId: string) => {
    if (!addedHackathons.includes(hackathonId)) {
      setAddedHackathons([...addedHackathons, hackathonId]);
    }
  };

  const handleRemoveFromHome = (hackathonId: string) => {
    setAddedHackathons(addedHackathons.filter((id) => id !== hackathonId));
  };

  const handleCreateTeam = () => {
    // In a real application, you would make an API call here to create the team
    const link = `https://yourdomain.com/invite/${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setInviteLink(link);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container px-4 py-16 md:py-24">
          <h1 className="text-center text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            2024 Season
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-center text-muted-foreground md:text-xl">
            Find, compete, and earn points at the largest, most diverse hacker
            events in the world.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hackathons..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="date-filter" className="text-sm font-medium">
              Show events from
            </label>
            <Input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-[180px]"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="all"
          className="mb-8"
          onValueChange={(value) => setLocationFilter(value)}
        >
          <TabsList>
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
            <TabsTrigger value="in-person">In-Person</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Hackathon Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHackathons.map((hackathon) => (
            <Card key={hackathon.id} className="shadow-md">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{hackathon.name}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  {hackathon.date} | {hackathon.location}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {addedHackathons && addedHackathons.includes(hackathon.id) ? (
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveFromHome(hackathon.id)}
                    >
                      Remove from Home
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleAddToHome(hackathon.id)}
                    >
                      Add to Home
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <a
                      href={hackathon.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedHackathon(hackathon)}>
                      Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Create Team for {selectedHackathon?.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="team-name" className="text-right">
                          Team Name
                        </Label>
                        <Input
                          id="team-name"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Visibility</Label>
                        <RadioGroup
                          value={teamVisibility}
                          onValueChange={setTeamVisibility}
                          className="col-span-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="public" id="public" />
                            <Label htmlFor="public">Public</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="private" id="private" />
                            <Label htmlFor="private">Private</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <DialogClose asChild>
                      <Button type="submit" onClick={handleCreateTeam}>
                        Create Team
                      </Button>
                    </DialogClose>
                    {inviteLink && (
                      <div className="mt-4">
                        <Label htmlFor="invite-link">Invite Link</Label>
                        <div className="flex mt-1">
                          <Input
                            id="invite-link"
                            value={inviteLink}
                            readOnly
                            className="flex-grow"
                          />
                          <Button
                            className="ml-2"
                            onClick={() => {
                              navigator.clipboard.writeText(inviteLink);
                              toast({
                                title: "Copied!",
                                description: "Invite link copied to clipboard.",
                              });
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
