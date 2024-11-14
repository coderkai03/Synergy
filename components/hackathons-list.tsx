"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Calendar, Globe2, MapPin, Search, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hackathons as hackathonsList } from "@/constants/hackathonlist";
import { Hackathon } from "@/constants/hackathonlist";
import { Checkbox } from "@/components/ui/checkbox";
// import Image from "next/image";

export function HackathonsListComponent() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState("all");

  const hackathons: Hackathon[] = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    return hackathonsList.filter((hackathon) => {
      const hackathonDate = new Date(hackathon.endDate);
      return hackathonDate >= today;
    });
  }, []);

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

  return (
    <div className="min-h-screen bg-zinc-800 p-4">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
        >
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">2024</span>
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
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-[#E4E4E4] border-none"
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
                <h3 className="text-xl font-semibold text-black line-clamp-1">
                  {hackathon.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-zinc-800">
                  <Calendar className="h-4 w-4 text-black" />
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
                <div className="flex items-center gap-2 text-sm text-black">
                  {hackathon.isOnline ? (
                    <Globe2 className="h-4 w-4 text-black" />
                  ) : (
                    <MapPin className="h-4 w-4 text-black" />
                  )}
                  {hackathon.location}
                </div>
                {/* {hackathon.participants && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-blue-500" />
                    {`${hackathon.participants} want to match on Synergy`}
                  </div>
                )} */}
                <div className="mt-4 flex gap-3">
                  <Button asChild className="flex-1 bg-amber-500 hover:bg-amber-600 font-bold text-black hover:text-white">
                    <Link href={`/alpha/hackathons/${hackathon.id}`}>
                      Form Team
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-[#E4E4E4] border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald">
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
