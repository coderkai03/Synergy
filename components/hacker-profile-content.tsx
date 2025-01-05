"use client";

import { User } from "@/types/User";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Github, Globe, Linkedin } from "lucide-react";
import Link from "next/link";

interface HackerProfileContentProps {
  user: User;
  matchScore?: number;
}

function BadgeSection({ title, items, colorClass }: { 
  title: string; 
  items: string[]; 
  colorClass: string;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="outline" className={colorClass + " text-white"}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function HackerProfileContent({ user, matchScore }: HackerProfileContentProps) {
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.profilePicture} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
          <p className="text-zinc-400">{user.school} • {user.major}</p>
          {matchScore && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {matchScore}% Match
            </Badge>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <h3 className="font-semibold">About</h3>
        <p className="text-zinc-400">{user.bio}</p>
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <h3 className="font-semibold">Experience</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(user.role_experience).map(([role, level]) => (
            <Card key={role} className="p-3 bg-zinc-800/50 border-zinc-700">
              <div className="text-sm text-zinc-200 capitalize">{role.replace('_', ' ')}</div>
              <div className="text-xl font-bold text-white">{level} <span className="text-sm text-zinc-400">/3</span></div>
            </Card>
          ))}
        </div>
      </div>

      {/* Technologies */}
      <BadgeSection 
        title="Technologies" 
        items={user.technologies} 
        colorClass="bg-blue-500/50" 
      />
      
      {/* Categories */}
      <BadgeSection 
        title="Categories" 
        items={user.category_experience} 
        colorClass="bg-purple-500/50" 
      />
      
      {/* Interests */}
      <BadgeSection 
        title="Interests" 
        items={user.interests} 
        colorClass="bg-pink-500/50" 
      />

      {/* Links */}
      <div className="flex gap-4">
        {user.github && (
          <Link href={user.github} target="_blank" className="text-zinc-400 hover:text-white">
            <Github className="h-5 w-5" />
          </Link>
        )}
        {user.linkedin && (
          <Link href={user.linkedin} target="_blank" className="text-zinc-400 hover:text-white">
            <Linkedin className="h-5 w-5" />
          </Link>
        )}
        {user.devpost && (
          <Link href={user.devpost} target="_blank" className="text-zinc-400 hover:text-white">
            <Globe className="h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Teams */}
      {/* {Object.keys(user.teams).length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Teams</h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(user.teams).map(([teamId, role]) => (
              <Card key={teamId} className="p-3 bg-zinc-800 border-zinc-700">
                <div className="flex justify-between items-center">
                  <div>Team {teamId}</div>
                  <Badge variant="outline">{role}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
} 