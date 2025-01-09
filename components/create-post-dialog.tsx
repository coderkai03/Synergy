"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { technologies_options } from "@/types/User";
import { X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function CreatePostDialog() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput) {
      e.preventDefault();
      if (!selectedTechnologies.includes(techInput)) {
        setSelectedTechnologies([...selectedTechnologies, techInput]);
      }
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement post creation logic
    setIsOpen(false);
  };

  return (
    <>
      <Card
        className="p-4 mb-6 bg-gray-900 border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="bg-gray-700 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3">
            <p className="text-gray-400 text-sm">
              Start a team invite post...
            </p>
          </div>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px] bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Create a Team Invite Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe what kind of teammates you're looking for..."
                className="min-h-[100px] bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies (optional)</Label>
              <Input
                id="technologies"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
                placeholder="Type and press enter to add technologies"
                className="bg-gray-800 border-gray-700"
                list="tech-options"
              />
              <datalist id="tech-options">
                {technologies_options.map((tech) => (
                  <option key={tech} value={tech} />
                ))}
              </datalist>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTechnologies.map((tech) => (
                  <Badge 
                    key={tech}
                    variant="secondary"
                    className="bg-gray-800 text-gray-200 flex items-center gap-1"
                  >
                    {tech}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTechnology(tech)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-gray-700"
              >
                Cancel
              </Button>
              <Button type="submit">Create Post</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
