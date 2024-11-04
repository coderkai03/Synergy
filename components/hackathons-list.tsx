"use client";

import * as React from "react";
import { Calendar, Globe2, MapPin, Search, Trophy, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useClerk, UserButton } from "@clerk/nextjs";

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

  // Replace the hardcoded hackathons array with the imported data
  const hackathons: Hackathon[] = hackathonsList;

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
    <div className="min-h-screen bg-background">
      {/* Header with Avatar and Sign Out */}
      <div className="container px-4 py-4">
        <div className="flex justify-end mb-4">
          <UserButton />
          <Button variant="outline" size="sm" asChild>
            <Link href="/alpha/account-setup">Edit Profile</Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => signOut()}
            className="ml-2"
          >
            Sign Out
          </Button>
        </div>
      </div>

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
            <Card key={hackathon.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src={hackathon.image}
                  alt={hackathon.name}
                  width={400}
                  height={200}
                  className="aspect-[2/1] object-cover"
                />
              </CardHeader>
              <CardContent className="grid gap-2.5 p-4">
                <h3 className="line-clamp-1 text-xl font-semibold">
                  {hackathon.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
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
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {hackathon.daysLeft} days left
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {hackathon.isOnline ? (
                    <Globe2 className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  {hackathon.location}
                </div>
                {(hackathon.prizePool || hackathon.participants) && (
                  <div className="flex gap-4 text-sm">
                    {hackathon.prizePool && (
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-primary" />
                        {hackathon.prizePool}
                      </div>
                    )}
                    {hackathon.participants && (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary" />
                        {hackathon.participants.toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  <Button asChild className="w-1/2">
                    <Link href={`/alpha/hackathons/${hackathon.id}`}>
                      Form Team
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-1/2">
                    <Link href={hackathon.website} target="_blank">
                      Website
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
