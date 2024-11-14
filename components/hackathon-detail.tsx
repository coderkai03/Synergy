"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Hackathon, hackathons } from "@/constants/hackathonlist";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import HackathonWait from "./wait";
import { useClerk, UserButton } from "@clerk/nextjs"; // Importing Clerk components
import { Multiselect } from "./multiselect";
import { Calendar, Globe2, MapPin, Search, Users, Zap } from "lucide-react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { addDoc, collection, setDoc } from "@firebase/firestore";
import { doc } from "@firebase/firestore";
import { db } from "@/firebaseConfig";

export function HackathonDetailComponent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { user, signOut } = useClerk(); // Destructure user and signOut from useClerk
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    alreadyInTeam: "",
    hasProjectIdea: "",
    projectIdea: "",
    teamMembers: "",
    goals: [] as string[],
    technologies: [] as string[],
    problemSpaces: [] as string[],
    teammates: [] as string[]
  });

  useEffect(() => {
    const fetchHackathon = () => {
      const foundHackathon = hackathons.find((h) => h.id === id);
      if (foundHackathon) {
        setHackathon(foundHackathon);
      } else {
        toast.error("Hackathon not found");
        router.push("/alpha/hackathons");
      }
    };

    if (id) {
      fetchHackathon();
    }

    // Check if the user has already submitted for this hackathon
    const submittedHackathons = JSON.parse(
      localStorage.getItem("submittedHackathons") || "[]"
    );
    if (submittedHackathons.includes(id)) {
      setHasSubmitted(true);
    }
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        goals: [...formData.goals, value],
      });
    } else {
      setFormData({
        ...formData,
        goals: formData.goals.filter((goal) => goal !== value),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting formData:", formData);
      const userId = user?.id;
      const userEmail = user?.primaryEmailAddress?.emailAddress

      if (!userId) throw new Error("User ID is not available");

      formData.teammates.push(userId)

      const docRef = await addDoc(
        collection(db, 'teams'),
        { ...formData }
      )
      console.log("Team created with ID:", docRef.id);
      console.log("Team details:", formData);
      toast.success("Team created successfully!");
      router.push("/alpha/hackathons");
    } catch {
      toast.error("Failed to submit information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hackathon) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasSubmitted) {
    return <HackathonWait />;
  }

  // const technologyOptions = [
  //   "JavaScript",
  //   "Python",
  //   "React",
  //   "Node.js",
  //   "Machine Learning",
  //   "Product Management",
  //   "UI/UX Design",
  //   "Data Science",
  //   "Mobile Development",
  //   "Cloud Computing",
  // ];

  const problemSpaceOptions = [
    "Healthcare",
    "Education",
    "Fintech",
    "Sustainability",
    "Social Impact",
    "AI/ML",
    "Developer Tools",
    "Entertainment",
    "E-commerce",
    "Productivity",
    "PNC",
    "Piñata",
    "EOG Resources",
    "Goldman Sachs",
    "Infosys",
    "CBRE",
    "Frontier",
    "Veolia",
    "Toyota",
    "Design",
    "Beginner",
    "Hardware",
    "Samba Nova",
  ];

  return (
    <div className="min-h-screen bg-zinc-800 p-4 py-8 text-white">
      <Card className="max-w-2xl mx-auto my-9 text-white bg-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Team Formation for {hackathon.name}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="text-lg font-semibold">
                Project Ideas and Interests:
              </div>

              <div className="space-y-2">
                <Label>Are you in a team already?</Label>
                <RadioGroup
                  name="alreadyInTeam"
                  value={formData.alreadyInTeam}
                  onValueChange={(value) => handleRadioChange("alreadyInTeam", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id="alreadyInTeam-yes"
                      className="w-4 h-4 border border-white bg-transparent rounded text-white checked:text-white"
                    />
                    <Label htmlFor="alreadyInTeam-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="no"
                      id="alreadyInTeam-no"
                      className="w-4 h-4 border border-white bg-transparent rounded text-white checked:text-white"
                    />
                    <Label htmlFor="alreadyInTeam-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.alreadyInTeam === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="teamMembers">Please list your existing team members:</Label>
                  <Textarea
                    id="teamMembers"
                    name="teamMembers"
                    value={formData.teamMembers}
                    onChange={handleChange}
                    placeholder="List the names of your team members..."
                    className="min-h-[100px] text-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Do You Have a Project Idea for This Hackathon?</Label>
                <RadioGroup
                  name="hasProjectIdea"
                  value={formData.hasProjectIdea}
                  onValueChange={(value) => handleRadioChange("hasProjectIdea", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="yes"
                      id="hasProjectIdea-yes"
                      className="w-4 h-4 border border-white bg-transparent rounded text-white checked:text-white"
                    />
                    <Label htmlFor="hasProjectIdea-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="no"
                      id="hasProjectIdea-no"
                      className="w-4 h-4 border border-white bg-transparent rounded text-white checked:text-white"
                    />
                    <Label htmlFor="hasProjectIdea-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.hasProjectIdea === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="projectIdea">If Yes, Please Describe Your Project Idea:</Label>
                  <Textarea
                    id="projectIdea"
                    name="projectIdea"
                    value={formData.projectIdea}
                    onChange={handleChange}
                    placeholder="Describe your project idea..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="text-lg font-semibold">Goals and Expectations:</div>

                <div className="space-y-2">
                  <Label>What Are Your Goals for This Hackathon?</Label>
                  <div className="space-y-2">
                    {["Learning new technologies", "Networking", "Winning prizes"].map(
                      (goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            id={goal}
                            checked={formData.goals.includes(goal)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(goal, checked as boolean)
                            }
                            className="w-4 h-4 border border-white rounded bg-transparent"
                          />
                          <Label htmlFor={goal}>{goal}</Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>


              {/* <div className="space-y-2">
                <Label htmlFor="technologies">
                  Which Technologies or Skills Are You Interested in Exploring?
                </Label>
                <Multiselect
                  options={technologyOptions}
                  selectedItems={formData.technologies}
                  setSelectedItems={(items) =>
                    setFormData({ ...formData, technologies: items })
                  }
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="problemSpaces" className="text-white">
                  What Categories Are You Passionate About?
                </Label>
                <Multiselect
                  options={problemSpaceOptions}
                  selectedItems={formData.problemSpaces}
                  setSelectedItems={(items) =>
                    setFormData({ ...formData, problemSpaces: items })
                  }
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
