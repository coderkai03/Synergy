"use client"

import { User } from "@/types/User";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface HackerPreviewProps {
  user: User;
}

export function HackerPreview({ user }: HackerPreviewProps) {
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  return (
    <Card className="w-full hover:bg-gray-700 transition-colors cursor-pointer bg-gray-800 text-white">
    <CardContent className="p-4">
        <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-gray-800">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="bg-gray-600 text-white">{initials}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-300">{user.school} • {user.major}</p>
                <p className="text-sm text-gray-300">{user.number_of_hackathons} Hackathons Attended</p>
            </div>
            </div>

            <p className="text-sm text-gray-300">{user.bio}</p>

            <div className="flex flex-wrap gap-2">
            {user.technologies?.slice(0, 3).map((tech) => (
                <Badge 
                key={tech} 
                variant="outline"
                className="bg-blue-500/50 text-white"
                >
                {tech}
                </Badge>
            ))}
            {user.technologies?.length > 3 && (
                <Badge 
                variant="outline"
                className="bg-blue-500/50 text-white"
                >
                +{user.technologies.length - 3}
                </Badge>
            )}
            </div>

            <div className="flex flex-wrap gap-2">
            {user.category_experience?.slice(0, 2).map((category) => (
                <Badge 
                key={category}
                variant="outline" 
                className="bg-green-500/50 text-white"
                >
                {category}
                </Badge>
            ))}
            </div>

            <div className="flex flex-wrap gap-2">
            {user.interests?.slice(0, 2).map((interest) => (
                <Badge
                key={interest}
                variant="outline"
                className="bg-purple-500/50 text-white"
                >
                {interest}
                </Badge>
            ))}
            </div>
        </div>
        </div>
    </CardContent>
    </Card>
  );
} 