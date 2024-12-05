"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Calendar, Globe2, MapPin, Search, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Hackathon } from "@/constants/hackathonlist";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { db } from "@/firebaseConfig";
import { User } from "@clerk/nextjs/server";

export function HackathonsListComponent() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [userdata, setUserdata] = useState<User | null>(null);
  const [hackathonsList, setHackathonsList] = useState<Hackathon[]>([]);
  const [userTeams, setUserTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserdata(userDocSnap.data() as User);
        }

        const hackathonsRef = collection(db, "hackathons");
        const hackathonsSnap = await getDocs(hackathonsRef);
        const hackathonsData = hackathonsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHackathonsList(hackathonsData as Hackathon[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const filteredHackathons = hackathonsList.filter((hackathon) => {
    const matchesSearch = hackathon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation =
      locationFilter === "all" ||
      (locationFilter === "online" && hackathon.isOnline) ||
      (locationFilter === "in-person" && !hackathon.isOnline);

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#111119] p-4">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6"
        >
          <span className="bg-gradient-to-r from-yellow-500 to-zinc-300 text-transparent bg-clip-text">
            2024-25
          </span>{" "}
          <span className="text-white">Hackathon Season</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mx-auto text-sm sm:text-base md:text-lg text-zinc-400 mb-8 max-w-2xl"
        >
          Find and compete with your dream team at the largest, most diverse
          hacker events <span className="italic">in the world.</span>
        </motion.p>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search hackathons..."
              className="pl-10 h-12 w-full bg-[#E4E4E4] border-amber-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto">
                Filter by category
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-56 bg-white border rounded-md shadow-lg">
              <div className="p-2 space-y-2">
                <DropdownMenu.Item asChild>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      id="online"
                      checked={locationFilter === "online"}
                      onCheckedChange={() => setLocationFilter("online")}
                    />
                    <span>Online</span>
                  </label>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      id="in-person"
                      checked={locationFilter === "in-person"}
                      onCheckedChange={() => setLocationFilter("in-person")}
                    />
                    <span>In-person</span>
                  </label>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      id="all"
                      checked={locationFilter === "all"}
                      onCheckedChange={() => setLocationFilter("all")}
                    />
                    <span>No Filter</span>
                  </label>
                </DropdownMenu.Item>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        {/* Hackathons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map((hackathon) => (
            <Card
              key={hackathon.id}
              className="overflow-hidden bg-[#4A4A4A] hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hackathon.image}
                  alt={hackathon.name}
                  className="w-full h-[150px] sm:h-[200px] object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white line-clamp-1">
                  {hackathon.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={hackathon.date}>
                    {new Date(hackathon.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Link href={`/hackathons/${hackathon.id}`}>Form Team</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-[#4A4A4A] border-[#ffac4c] text-[#ffac4c]"
                  >
                    <Link
                      href={hackathon.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
