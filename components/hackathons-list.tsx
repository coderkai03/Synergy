"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Calendar, Globe2, MapPin, Search, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Hackathon } from "@/constants/hackathonlist";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import { useUserExists, useUserHackathons } from "@/hooks/useFirebaseUsers";
import { useHackathons } from "@/hooks/useHackathons";

export function HackathonsListComponent() {
  //currently pulling from constants, will need to pull from database
  const { user } = useUser();
  const { hackathonIds } = useUserHackathons(user?.id);
  const { hackathonsList } = useHackathons();
  const { exists } = useUserExists(user?.id);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const hackathons: Hackathon[] = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    return hackathonsList
      .filter((hackathon) => {
        const hackathonDate = new Date(hackathon.endDate);
        return hackathonDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [hackathonsList]);

  const filteredHackathons = useMemo(() => {
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
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search hackathons..."
                className="pl-10 h-12 flex-1 bg-[#E4E4E4] border-amber-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-white h-12">
                  Filter by category
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-56 bg-white border rounded-md shadow-lg">
                <div className="p-2 space-y-2">
                  <DropdownMenu.Item asChild>
                    <label className="flex items-center space-x-2">
                      <Checkbox 
                        id="online"
                        checked={locationFilter == "online"}
                        onCheckedChange={() => setLocationFilter("online")}
                        />
                      <span>Online</span>
                    </label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <label className="flex items-center space-x-2">
                    <Checkbox 
                        id="in-person"
                        checked={locationFilter == "in-person"}
                        onCheckedChange={() => setLocationFilter("in-person")}
                      />
                      <span>In-person</span>
                    </label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <label className="flex items-center space-x-2">
                    <Checkbox 
                        id="all"
                        checked={locationFilter == "all"}
                        onCheckedChange={() => setLocationFilter("all")}
                      />
                      <span>No Filter</span>
                    </label>
                  </DropdownMenu.Item>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>

        {/* Hackathon Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHackathons.map((hackathon) => (
            <Card
              key={hackathon.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-[#4A4A4A] border-none"
            >
              <CardHeader className="p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hackathon.image}
                  alt={hackathon.name}
                  className="w-full h-[200px] object-cover object-top rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="grid gap-3 p-4">
                <h3 className="text-xl font-semibold text-white line-clamp-1">
                  {hackathon.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Calendar className="h-4 w-4 text-white" />
                  <time dateTime={hackathon.date}>
                    {new Date(`${hackathon.date}T00:00:00`).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                    {" - "}
                    {new Date(
                      `${hackathon.endDate}T00:00:00`
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  {hackathon.daysLeft && (
                    <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                      {hackathon.daysLeft} days left
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-white">
                  {hackathon.isOnline ? (
                    <Globe2 className="h-4 w-4 text-white" />
                  ) : (
                    <MapPin className="h-4 w-4 text-white" />
                  )}
                  {hackathon.location}
                </div>
                {hackathon.participants && (
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Users className="h-4 w-4 text-white" />
                    {`${hackathon.participants} hackers`}
                  </div>
                )}
                <div className="mt-4 flex gap-3">
                  {hackathonIds.includes(hackathon.id) ? (
                    <Button disabled className="flex-1 bg-gray-500 font-bold text-white">
                      Applied
                    </Button>
                  ) : (
                    <Button 
                      asChild 
                      className="flex-1 bg-amber-500 hover:bg-amber-600 font-bold text-white hover:text-white"
                    >
                      <Link href={exists ? `/hackathons/${hackathon.id}` : '/account-setup'}>
                        Form Team
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="flex-1 bg-[#4A4A4A] border-[#ffac4c] text-[#ffac4c] hover:bg-[#FFAD08]/10 hover:text-[#ffac4c]">
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