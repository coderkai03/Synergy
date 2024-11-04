"use client";

import * as React from "react";
import { Calendar, Globe2, MapPin, Search, Users } from "lucide-react";
import Link from "next/link";
import { useClerk, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hackathons as hackathonsList } from "@/constants/hackathonlist";
import { Hackathon } from "@/constants/hackathonlist";

export function HackathonsListComponent() {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Synergy
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-blue-50"
              asChild
            >
              <Link href="/alpha/account-setup">
                <Users className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            <UserButton />
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-red-50 hover:text-red-600 transition-colors"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-blue-600 mb-4 text-center"
        >
          2024 Hackathon Season
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mx-auto mt-4 max-w-2xl text-lg text-gray-600 mb-12"
        >
          Find and compete with your dream team at the largest, most diverse
          hacker events in the world.
        </motion.p>

        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search hackathons..."
                className="pl-10 h-12 text-lg bg-white shadow-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-12 w-full md:w-[200px] bg-white shadow-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>

          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={(value) => setLocationFilter(value)}
          >
            <TabsList className="w-full bg-white shadow-sm border border-gray-200 p-1 rounded-md">
              <TabsTrigger
                value="all"
                className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                All Events
              </TabsTrigger>
              <TabsTrigger
                value="online"
                className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Globe2 className="h-4 w-4 mr-2" />
                Online
              </TabsTrigger>
              <TabsTrigger
                value="in-person"
                className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <MapPin className="h-4 w-4 mr-2" />
                In-Person
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHackathons.map((hackathon) => (
            <Card
              key={hackathon.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hackathon.image}
                  alt={hackathon.name}
                  className="w-full h-[200px] object-cover object-top"
                />
              </CardHeader>
              <CardContent className="grid gap-3 p-4">
                <h3 className="text-xl font-semibold line-clamp-1">
                  {hackathon.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <time dateTime={hackathon.date}>
                    {new Date(hackathon.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {" - "}
                    {new Date(hackathon.endDate).toLocaleDateString("en-US", {
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {hackathon.isOnline ? (
                    <Globe2 className="h-4 w-4 text-blue-500" />
                  ) : (
                    <MapPin className="h-4 w-4 text-blue-500" />
                  )}
                  {hackathon.location}
                </div>
                {hackathon.participants && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-blue-500" />
                    {`${hackathon.participants} on Synergy`}
                  </div>
                )}
                <div className="mt-4 flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href={`/alpha/hackathons/${hackathon.id}`}>
                      Form Team
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
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
