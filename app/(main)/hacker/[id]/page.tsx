"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "@/types/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Briefcase, Code, Trophy } from 'lucide-react';
import { subscribeToDoc } from "@/hooks/useDocSubscription";

export default function HackerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [hacker, setHacker] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToDoc<User>({
      collectionName: 'users',
      docId: id,
      onUpdate: (userData) => {
        setHacker(userData);
        //setLoading(false);
      },
      enabled: !!id
    });

    return () => unsubscribe();
  }, [id]);


  if (!hacker) {
    return <div>Hacker not found</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={hacker.profilePicture} />
            <AvatarFallback>{hacker.firstName[0]}{hacker.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl text-white">
              {hacker.firstName} {hacker.lastName}
            </CardTitle>
            <p className="text-zinc-400">{hacker.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bio Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">About</h3>
            <p className="text-zinc-300">{hacker.bio}</p>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-amber-500" />
              <h3 className="text-lg font-semibold text-white">Education</h3>
            </div>
            <p className="text-zinc-300">{hacker.school} - {hacker.major}</p>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="text-amber-500" />
              <h3 className="text-lg font-semibold text-white">Hackathon Experience</h3>
            </div>
            <p className="text-zinc-300">{hacker.number_of_hackathons} Hackathons</p>
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="text-amber-500" />
              <h3 className="text-lg font-semibold text-white">Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {hacker.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Category Experience */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Briefcase className="text-amber-500" />
              <h3 className="text-lg font-semibold text-white">Category Experience</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {hacker.category_experience.map((category) => (
                <Badge key={category} variant="secondary" className="bg-zinc-700 text-zinc-200">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4 pt-4">
            {hacker.github && (
              <a href={hacker.github} target="_blank" rel="noopener noreferrer" 
                className="text-zinc-400 hover:text-amber-500">
                GitHub
              </a>
            )}
            {hacker.devpost && (
              <a href={hacker.devpost} target="_blank" rel="noopener noreferrer"
                className="text-zinc-400 hover:text-amber-500">
                Devpost
              </a>
            )}
            {hacker.linkedin && (
              <a href={hacker.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-zinc-400 hover:text-amber-500">
                LinkedIn
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
