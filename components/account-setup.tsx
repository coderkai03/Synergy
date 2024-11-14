"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Users, Zap } from "lucide-react";
import { Multiselect } from "./multiselect";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { db } from '@/firebaseConfig'
import { doc, setDoc, updateDoc, collection, addDoc } from '@firebase/firestore'

export function AccountSetupComponent() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    // email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    gradYear: "",
    school: "",
    degree: "",
    programming_languages: [] as string[],
    frameworks_and_tools: [] as string[],
    devpost: "",
    github: "",
    number_of_hackathons: "",
    // achievements: "",
    // objectives: "",
    category_experience: [] as string[],
    role_experience: {
      projectManagement: 50,
      software: 50,
      hardware: 50,
      uiDesign: 50,
    },
    // dietaryRestrictions: "",
    // accessibilityNeeds: "",
  });

  //const [isOptionalExpanded, setIsOptionalExpanded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("accountSetupData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSliderChange = (role: string) => (value: number[]) => {
    setFormData({
      ...formData,
      role_experience: {
        ...formData.role_experience,
        [role]: value[0],
      },
    });
  };

  // const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting formData:", formData);
      const userId = user?.id;
      const userEmail = user?.primaryEmailAddress?.emailAddress

      if (!userId) throw new Error("User ID is not available");
      if (!userEmail) throw new Error("User email is not available");

      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, {
        email: userEmail,
        ...formData
      });

      // Navigate to the next page
      router.push("/alpha/hackathons");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      toast.error("Failed to save your profile. Please try again.");
    }
  };

  const programming_languages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Ruby",
    "Go",
    "Swift",
    "Kotlin",
    "PHP",
    "TypeScript",
  ];

  const frameworks_and_tools = [
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Django",
    "Flask",
    "Spring",
    "Express.js",
    "TensorFlow",
    "PyTorch",
  ];

  const category_experience = [
    "Web Development",
    "Mobile Development",
    "AI/Machine Learning",
    "Data Science",
    "IoT",
    "Blockchain",
    "Cybersecurity",
    "Cloud Computing",
    "AR/VR",
    "Game Development",
  ];

  const createRandomDoc = async (data: any) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), data); // Automatically generates a random ID
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="justify-center min-h-screen bg-[#111119] p-4">
      <div className="flex justify-center">
        <Card className="felx fex-col items-center space-y-6 w-3/4 bg-[#111119] text-white border-none pt-5">
          <CardHeader>
            <CardTitle>Synergy: Hackathon Account Setup</CardTitle>
            <CardDescription>
              Complete your profile to find the perfect hackathon partners and
              enhance your experience.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 text-white">

              {/* Personal Information section */}
              <Collapsible className="bg-zinc-800 rounded-lg">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
                  <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" className="bg-zinc-700 border-amber-500/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" className="bg-zinc-700 border-amber-500/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" className="bg-zinc-700 border-amber-500/50" />
                  </div>
                </CollapsibleContent>
              </Collapsible> 

              {/* Educational Background section */}
              <Collapsible className="bg-zinc-800 rounded-lg">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
                <h2 className="text-lg font-semibold text-white">Educational Background</h2>
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Input id="school" className="bg-zinc-700 border-amber-500/50" 
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="Your School"
                      required 
                      />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="Your Degree"
                      required
                      className="bg-zinc-700 border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Select
                          name="graduatingClass"
                          value={formData.graduatingClass}
                          onValueChange={handleSelectChange("graduatingClass")}
                        >
                          <SelectTrigger className="bg-zinc-700 border-amber-500/50 text-white-500">
                            <SelectValue placeholder="Select graduation year"/>
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-700 border-amber-500/50 text-white hover:bg-[##FFAD08]">
                            {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

              {/* Technical Skills section */}
              <Collapsible className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
                    <h2 className="text-lg font-semibold text-white">Technical Skills</h2>
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 space-y-4">
                  <div className="space-y-2 text-black">
                    <Label htmlFor="programming_languages" className="text-white">Programming Languages</Label>
                    <Multiselect
                      options={programming_languages}
                      selectedItems={formData.programming_languages}
                      setSelectedItems={(items) => {
                        setFormData((prev) => ({
                          ...prev,
                          programming_languages: items,
                        }));
                      }}
                    />
                  </div>

                  <div className="space-y-2 text-black">
                    <Label htmlFor="frameworks_and_tools" className="text-white">Frameworks and Tools</Label>
                    <Multiselect
                      options={frameworks_and_tools}
                      selectedItems={formData.frameworks_and_tools}
                      setSelectedItems={(items) => {
                        setFormData((prev) => ({
                          ...prev,
                          frameworks_and_tools: items,
                        }));
                      }}
                    />
                  </div>
                  </CollapsibleContent>
                </Collapsible>

              {/* Online Profiles section */}
              <Collapsible className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
                    <h2 className="text-lg font-semibold text-white">Online Profiles</h2>
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="devpost">Devpost Profile</Label>
                        <Input
                          id="devpost"
                          name="devpost"
                          value={formData.devpost}
                          onChange={handleChange}
                          placeholder="https://devpost.com/yourusername"
                    required
                          className="bg-zinc-700 border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub Profile</Label>
                        <Input
                          id="github"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="https://github.com/yourusername"
                    required
                          className="bg-zinc-700 border-amber-500/50"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

              {/* Hackathon Experience section */}
              <Collapsible className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
                    <h2 className="text-lg font-semibold text-white">Hackathons Experience and Preferred Roles</h2>
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hackathonsAttended">Number of Hackathons Attended</Label>
                        <Select
                          name="hackathonsAttended"
                          value={formData.hackathonsAttended}
                          onValueChange={handleSelectChange("hackathonsAttended")}
                        >
                          <SelectTrigger className="bg-zinc-700 border-amber-500/50">
                            <SelectValue placeholder="Select number of hackathons" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-700 border-amber-500/50 text-white">
                            {[0, 1, 2, 3, 4, "5+"].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 text-black">
                        <Label className="text-white">Focuses</Label>
                        <Multiselect
                          options={focuses}
                          selectedItems={formData.focuses}
                          setSelectedItems={(selectedItems) => {
                            setFormData((prev) => ({
                              ...prev,
                              focuses: selectedItems,
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h3 className="text-sm text-zinc-400">Rate your experience level in each role from 0 to 5</h3>

                      {/* Project Management */}
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label htmlFor="projectManagement">Project Management</Label>
                          <span className="text-zinc-400 text-sm">Leading teams, coordinating tasks, and ensuring project success</span>
                        </div>
                        <Slider
                          id="projectManagement"
                          min={0}
                          max={5}
                          step={1}
                          value={[formData.preferredRoles.projectManagement]}
                          onValueChange={handleSliderChange("projectManagement")}
                          className="[&_[role=slider]]:bg-amber-500"
                        />
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>0</span>
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>

                      {/* Software Development */}
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label htmlFor="software">Software Development</Label>
                          <span className="text-zinc-400 text-sm">Programming, app development, and software architecture</span>
                        </div>
                        <Slider
                          id="software"
                          min={0}
                          max={5}
                          step={1}
                          value={[formData.preferredRoles.software]}
                          onValueChange={handleSliderChange("software")}
                          className="[&_[role=slider]]:bg-amber-500"
                        />
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>0</span>
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>

                      {/* Hardware Development */}
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label htmlFor="hardware">Hardware Development</Label>
                          <span className="text-zinc-400 text-sm">Electronics, prototyping, and physical computing</span>
                        </div>
                        <Slider
                          id="hardware"
                          min={0}
                          max={5}
                          step={1}
                          value={[formData.preferredRoles.hardware]}
                          onValueChange={handleSliderChange("hardware")}
                          className="[&_[role=slider]]:bg-amber-500"
                        />
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>0</span>
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>

                      {/* UI/UX Design */}
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <Label htmlFor="uiDesign">UI/UX Design</Label>
                          <span className="text-zinc-400 text-sm">User interface design, user experience, wireframing, and prototyping</span>
                        </div>
                        <Slider
                          id="uiDesign"
                          min={0}
                          max={5}
                          step={1}
                          value={[formData.preferredRoles.uiDesign]}
                          onValueChange={handleSliderChange("uiDesign")}
                          className="[&_[role=slider]]:bg-amber-500"
                        />
                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>0</span>
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

            </CardContent>
            <CardFooter>
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                  Submit
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
