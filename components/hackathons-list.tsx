"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useHackathons } from "@/hooks/useHackathons";
import { SearchBar } from "@/components/ui/SearchBar";
import { Hackathon } from "@/types/Hackathons";
import { HackathonCard } from "@/components/hackathon-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import Loading from "./loading";
import NotFound from "./not-found";

export function HackathonsListComponent() {
  //currently pulling from constants, will need to pull from database
  const { hackathons, loading: hackathonLoading } = useHackathons();
  const { userData, loading: userLoading } = useFirebaseUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  // Simple function to filter hackathons by date
  const getActiveHackathons = (hackathons: Hackathon[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return hackathons
      .filter((hackathon) => {
        const hackathonDate = new Date(hackathon.endDate);
        return hackathonDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Simple function to apply all filters
  const filterHackathons = (hackathons: Hackathon[]) => {
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
  };

  // Use these functions directly in your JSX
  const activeHackathons = getActiveHackathons(hackathons);
  const filteredHackathons = filterHackathons(activeHackathons);

  if (
    userLoading ||
    hackathonLoading
  ) {
    return <Loading />;
  }

  if (
    !userData &&
    !hackathonLoading &&
    !userLoading &&
    !hackathons
  ) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#111119] p-4">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
        >
          <span className="bg-gradient-to-r from-yellow-500 to-zinc-300 text-transparent bg-clip-text">2024-25</span>
          <span className="text-white"> Hackathon Season</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mx-auto mt-4 max-w-2xl text-lg text-zinc-400 mb-12"
        >
          Find and compete with your dream team at the largest, most diverse
          hacker events in the world.
        </motion.p>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white h-12">
                Filter by category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white border rounded-md shadow-lg">
              <div className="p-2 space-y-2">
                <DropdownMenuItem asChild>
                  <label className="flex items-center space-x-2">
                    <Checkbox 
                      id="online"
                      checked={locationFilter == "online"}
                      onCheckedChange={() => setLocationFilter("online")}
                      />
                    <span>Online</span>
                  </label>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <label className="flex items-center space-x-2">
                  <Checkbox 
                      id="in-person"
                      checked={locationFilter == "in-person"}
                      onCheckedChange={() => setLocationFilter("in-person")}
                    />
                    <span>In-person</span>
                  </label>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <label className="flex items-center space-x-2">
                  <Checkbox 
                      id="all"
                      checked={locationFilter == "all"}
                      onCheckedChange={() => setLocationFilter("all")}
                    />
                    <span>No Filter</span>
                  </label>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Hackathon Grid */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-4">
          {filteredHackathons.map((hackathon) => (
            <HackathonCard
              key={hackathon.id}
              hackathon={hackathon}
              userData={userData}
            />
          ))}
        </div>
      </main>
    </div>
  );
}