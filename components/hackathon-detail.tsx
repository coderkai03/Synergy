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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import HackathonWait from "./wait";
import { useClerk, UserButton } from "@clerk/nextjs"; // Importing Clerk components

export function HackathonDetailComponent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { signOut } = useClerk(); // Destructure signOut from useClerk
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    alreadyInTeam: "",
    hasProjectIdea: "",
    projectIdea: "",
    goals: [] as string[],
    technologies: "",
    problemSpaces: "",
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
      // Save to localStorage
      const submittedHackathons = JSON.parse(
        localStorage.getItem("submittedHackathons") || "[]"
      );
      submittedHackathons.push(id);
      localStorage.setItem(
        "submittedHackathons",
        JSON.stringify(submittedHackathons)
      );

      // Prepare FormData for Google Forms submission
      const googleFormUrl =
        "https://docs.google.com/forms/d/e/1FAIpQLSdZik-P5jC2D4pd_NvvA6lWwaYI810_VQ3zP8LeATOYGx_iiA/formResponse";
      const submissionData = new FormData();
      submissionData.append("entry.664542093", formData.alreadyInTeam); // Yes/No-ProjectIdea
      submissionData.append("entry.1119798189", formData.projectIdea); // Idea1
      submissionData.append("entry.1594324207", formData.goals.join(", ")); // goal1
      submissionData.append("entry.684422712", formData.technologies); // tech1
      submissionData.append("entry.23754417", formData.problemSpaces); // problem1

      // Submit to Google Forms
      const response = await fetch(googleFormUrl, {
        method: "POST",
        body: submissionData,
        mode: "no-cors",
      });

      if (response.ok || response.type === "opaque") {
        toast.success("Information submitted successfully!");

        setHasSubmitted(true);
      } else {
        throw new Error("Network response was not ok.");
      }
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Avatar and Sign Out */}
      <div className="flex justify-end mb-4">
        <UserButton />
        <Button variant="secondary" onClick={() => signOut()} className="ml-2">
          Sign Out
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
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
                <Label>Are you in already?</Label>
                <RadioGroup
                  name="alreadyInTeam"
                  value={formData.alreadyInTeam}
                  onValueChange={(value) =>
                    handleRadioChange("alreadyInTeam", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="alreadyInTeam-yes" />
                    <Label htmlFor="alreadyInTeam-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="alreadyInTeam-no" />
                    <Label htmlFor="alreadyInTeam-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Do You Have a Project Idea for This Hackathon?</Label>
                <RadioGroup
                  name="hasProjectIdea"
                  value={formData.hasProjectIdea}
                  onValueChange={(value) =>
                    handleRadioChange("hasProjectIdea", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hasProjectIdea-yes" />
                    <Label htmlFor="hasProjectIdea-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hasProjectIdea-no" />
                    <Label htmlFor="hasProjectIdea-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.hasProjectIdea === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="projectIdea">
                    If Yes, Please Describe Your Project Idea:
                  </Label>
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
            </div>

            <div className="space-y-4">
              <div className="text-lg font-semibold">
                Goals and Expectations:
              </div>

              <div className="space-y-2">
                <Label>What Are Your Goals for This Hackathon?</Label>
                <div className="space-y-2">
                  {[
                    "Learning new technologies",
                    "Networking",
                    "Winning prizes",
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(goal, checked as boolean)
                        }
                      />
                      <Label htmlFor={goal}>{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">
                  Which Technologies or Skills Are You Interested in Exploring?
                </Label>
                <Input
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, Product Management"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemSpaces">
                  What Problem Spaces or Domains Are You Passionate About?
                </Label>
                <Input
                  id="problemSpaces"
                  name="problemSpaces"
                  value={formData.problemSpaces}
                  onChange={handleChange}
                  placeholder="e.g., Healthcare, Education, Fintech"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
