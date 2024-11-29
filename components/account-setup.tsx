"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { ChevronDown } from "lucide-react";
import { Multiselect } from "./multiselect";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { db } from '@/firebaseConfig'
import { doc, setDoc, getDoc } from '@firebase/firestore'
import User from "@/interfaces/User";
import SkillsSection from "./slider-section";

export function AccountSetupComponent() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [formData, setFormData] = useState<User>({
    full_name: "",
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
    role_experience: {
      product_management: -1,
      software: -1,
      hardware: -1,
      uiux_design: -1,
    },
    // dietaryRestrictions: "",
    // accessibilityNeeds: "",
  });

  //const [isOptionalExpanded, setIsOptionalExpanded] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) return;
    
    async function fetchUserData() {
      try {
        const userId = user?.id
        const userEmail = user?.primaryEmailAddress?.emailAddress
        console.log('User:', userId, userEmail)

        if (!userId) {
          throw new Error("User ID not found")
        }

        if (!userEmail) {
          throw new Error("User email not found")
        }

        const userDoc = await getDoc(doc(db, 'users', userId))
        setFormData({
          ...(userDoc.data()) as User
        });
        setFirstName(userDoc.data()?.full_name?.split(' ')[0] || "");
        setLastName(userDoc.data()?.full_name?.split(' ')[1] || "");
        console.log('Loaded user: ',userDoc.data())

      } catch (error) {
        console.error("Error getting user ID:", error)
        return
      }
    }

    fetchUserData()
  }, [user, isSignedIn, isLoaded]);

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
    console.log(`Role: ${role}, Value: ${value}`);
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

      formData.full_name = `${firstName} ${lastName}`;

      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, {
        ...formData
      });

      // Navigate to the next page
      router.push("/hackathons");
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

  // const category_experience = [
  //   "Web Development",
  //   "Mobile Development",
  //   "AI/Machine Learning",
  //   "Data Science",
  //   "IoT",
  //   "Blockchain",
  //   "Cybersecurity",
  //   "Cloud Computing",
  //   "AR/VR",
  //   "Game Development",
  // ];

  // const createRandomDoc = async (data: any) => {
  //   try {
  //     const docRef = await addDoc(collection(db, 'users'), data); // Automatically generates a random ID
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //   }
  // };

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

          {isLoaded ? (
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
                      <Input 
                        id="firstName" 
                        className="bg-zinc-700 border-amber-500/50" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        className="bg-zinc-700 border-amber-500/50" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" className="bg-zinc-700 border-amber-500/50" value={formData.phone}/>
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
                      value={formData.gradYear}
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
                          value={formData.number_of_hackathons}
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
                    </div>

                    <div className="space-y-8">
                      <h3 className="text-sm text-zinc-400">Rate your experience level in each role from 0 to 5</h3>

                      <SkillsSection formData={formData} handleSliderChange={handleSliderChange}/>
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
          ) : (
            <div>Loading...</div>
          )}
        </Card>
      </div>
    </div>
  );
}
