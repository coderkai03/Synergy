"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useHackathons } from "@/hooks/useHackathons";
import { SearchBar } from "@/components/ui/SearchBar";
import { Hackathon } from "@/types/Hackathons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import Loading from "./loading";
import NotFound from "./not-found";
import { HackathonGrid } from "./hackathon-grid";
import { defaultUser, User } from "@/types/User";
import { useUser } from "@clerk/nextjs";
import { testLog } from "@/hooks/useCollection";

export function HackathonsListComponent() {
  const { user } = useUser();

  const { getAllHackathons, loading: hackathonLoading } = useHackathons();
  const { getUserData, loading: userLoading } = useFirebaseUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User>(defaultUser);

  useEffect(() => {
    const fetchUserData = async () => {
      testLog('Fetching user data');
      if (!user || userData !== defaultUser) return;
      const fetchedUserData = await getUserData(user.id);
      testLog('User data fetched:', fetchedUserData);

      if (!fetchedUserData) return;
      setUserData(fetchedUserData);
    };
    fetchUserData();
  }, [user]);

  // Fetch hackathons only once on mount
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setIsLoading(true);
        const fetchedHackathons = await getAllHackathons();
        setHackathons(fetchedHackathons);
      } catch (error) {
        console.error('Failed to fetch hackathons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, []); // Empty dependency array means this only runs once on mount

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

  if (isLoading || userLoading || hackathonLoading) {
    return <Loading />;
  }

  if (!userData && !isLoading && !hackathons.length) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#111119] p-4">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
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

        <HackathonGrid
          hackathons={filteredHackathons}
          userData={userData}
        />
      </main>
    </div>
  );
}