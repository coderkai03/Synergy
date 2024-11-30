"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { useClerk } from "@clerk/nextjs"; // Importing Clerk components
import { Multiselect } from "./multiselect";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "@firebase/firestore";
import { db } from "@/firebaseConfig";
import { Input } from "@/components/ui/input";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Hackathon {
  id: string;
  name: string;
  image: string;
  // ... add other fields you need
}

export function HackathonDetailComponent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { user } = useClerk(); // Destructure user and signOut from useClerk
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    alreadyInTeam: "",
    hasProjectIdea: "",
    projectIdea: "",
    goals: [] as string[],
    problemSpaces: [] as string[],
    teammates: [] as string[]
  });
  const [usersList, setUsersList] = useState<Array<{
    email: string;
    id: string;
  }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathon = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const hackathonRef = doc(db, 'hackathons', id);
        const hackathonSnap = await getDoc(hackathonRef);
        
        if (hackathonSnap.exists()) {
          setHackathon({
            id: hackathonSnap.id,
            ...hackathonSnap.data()
          } as Hackathon);
        } else {
          toast.error("Hackathon not found");
          router.push("/hackathons");
        }
      } catch (error) {
        console.error("Error fetching hackathon:", error);
        toast.error("Error loading hackathon details");
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();

    // Check if user has already submitted
    const submittedHackathons = JSON.parse(
      localStorage.getItem("submittedHackathons") || "[]"
    );
    if (submittedHackathons.includes(id)) {
      setHasSubmitted(true);
    }
  }, [id, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email,
      }));
      setUsersList(users);
      console.log(users);
    };

    fetchUsers();
  }, []);

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
      //const userEmail = user?.primaryEmailAddress?.emailAddress

      if (!userId) throw new Error("User ID is not available");

      formData.teammates.push(userId)

      const docRef = await addDoc(
        collection(db, 'teams'),
        {
          ...formData,
          name: hackathon?.name,
          hackathonId: hackathon?.id
        }
      )

      // Add team ID to user's teams array in Firestore
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentTeams = userDoc.data().teams || [];
        await updateDoc(userRef, {
          teams: [...currentTeams, docRef.id]
        });
      } else {
        throw new Error("User not signed in");
      }
      console.log("User data:", {
        id: userId,
        teams: userDoc.exists() ? userDoc.data().teams : [],
      });

      console.log("Team created with ID:", docRef.id);
      console.log("Team details:", formData);
      toast.success("Team created successfully!");
      router.push("/hackathons");
    } catch {
      toast.error("Failed to submit information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasSubmitted) {
    return <HackathonWait />;
  }

  if (!hackathon) {
    return <div className="min-h-screen bg-zinc-800 p-4 py-8 text-white">
      <Card className="max-w-2xl mx-auto my-9 text-white bg-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <div className="text-center">Hackathon not found</div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>;
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
            {hackathon.name}: Team Formation
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <img 
            src={hackathon.image} 
            alt={hackathon.name}
            className="rounded-lg max-h-[150px] object-cover" 
          />
        </CardContent>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="text-lg font-semibold">
                Project Ideas and Interests:
              </div>

              <div className="space-y-2">
                <Label>Do you have teammates?</Label>
                <RadioGroup
                  name="alreadyInTeam"
                  value={formData.alreadyInTeam}
                  onValueChange={(value) => handleRadioChange("alreadyInTeam", value)}
                  required
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
                  <Label htmlFor="teammates">Select your team members:</Label>
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          maxLength={50}
                          disabled={formData.teammates.length >= 4}
                          type="text"
                          placeholder="Search email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-zinc-700 border-amber-500/50"
                        />
                        <Button
                          disabled={formData.teammates.length >= 3}
                          type="button"
                          onClick={() => {
                            const foundUser = usersList.find(user => 
                              user.email?.toLowerCase() === searchTerm.toLowerCase()
                            );
                            
                            if (foundUser) {
                              if (!formData.teammates.includes(foundUser.id)) {
                                setFormData({
                                  ...formData,
                                  teammates: [...formData.teammates, foundUser.id]
                                });
                              }
                              setSearchTerm('');
                              console.log(`Added ${foundUser.email} to team`);
                            } else {
                              toast.error('Email not found');
                            }
                          }}
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          Add
                        </Button>
                      </div>
                      
                      {/* Show selected teammates */}
                      <div className="mt-4 space-y-2">
                        {formData.teammates.map(teamId => {
                          const user = usersList.find(u => u.id === teamId);
                          return user ? (
                            <div key={teamId} className="flex items-center gap-2 bg-zinc-700 p-2 rounded">
                              <span>{user.email}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    teammates: formData.teammates.filter(id => id !== teamId)
                                  });
                                }}
                                className="text-red-500 hover:text-red-600 p-1"
                              >
                                ✕
                              </Button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Do You Have a Project Idea for This Hackathon?</Label>
                <RadioGroup
                  name="hasProjectIdea"
                  value={formData.hasProjectIdea}
                  onValueChange={(value) => handleRadioChange("hasProjectIdea", value)}
                  required
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
                  <div className="relative">
                    <Textarea
                      id="projectIdea"
                      name="projectIdea"
                      value={formData.projectIdea}
                      onChange={handleChange}
                      placeholder="Describe your project idea..."
                      className="min-h-[100px]"
                      required
                      maxLength={1500}
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-gray-400">
                      {formData.projectIdea.length}/1500
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="text-lg font-semibold">Goals and Expectations:</div>

                <div className="space-y-2">
                  <Label>What Are Your Goals for This Hackathon? (Select at least one)</Label>
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
                            required={formData.goals.length === 0}
                          />
                          <Label htmlFor={goal}>{goal}</Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemSpaces" className="text-white">
                  What Categories Are You Passionate About? (Select at least one)
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
            <Button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
              disabled={
                isSubmitting || 
                formData.goals.length === 0 || 
                formData.problemSpaces.length === 0 || 
                !formData.alreadyInTeam || 
                (formData.alreadyInTeam === "yes" && formData.teammates.length === 0) ||
                !formData.hasProjectIdea || 
                (formData.hasProjectIdea === "yes" && !formData.projectIdea)
              }
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
