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

export function AccountSetupComponent() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    // email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    graduatingClass: "",
    school: "",
    degree: "",
    programmingLanguages: [] as string[],
    frameworksAndTools: [] as string[],
    devpostProfile: "",
    githubProfile: "",
    hackathonsAttended: "",
    // achievements: "",
    // objectives: "",
    focuses: [] as string[],
    preferredRoles: {
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
      preferredRoles: {
        ...formData.preferredRoles,
        [role]: value[0],
      },
    });
  };

  // const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting formData:", formData);

      // Save to localStorage
      localStorage.setItem("accountSetupData", JSON.stringify(formData));
      console.log("Account Setup Data saved to localStorage:", formData);

      //entry.868333928=name
      //entry.2109342534=phone
      //entry.1001414379=gradyear
      //entry.279323951=school
      //entry.1194461452=degree
      //entry.1215536533=langs
      //entry.2068797540=frameworks
      //entry.1483794269=devpost
      //entry.618662987=github
      //entry.1247596049=numHackathons
      //entry.289288076=focus
      //entry.444967086=prodMgmt
      //entry.1174368867=software
      //entry.638316355=hardware
      //entry.334805419=uiuxdesign

      // setIsSubmitting(true);

      const localFormData = new FormData();
      localFormData.append("entry.868333928", formData.fullName);
      localFormData.append("entry.2109342534", formData.phone);
      localFormData.append("entry.1001414379", formData.graduatingClass);
      localFormData.append("entry.279323951", formData.school);
      localFormData.append("entry.1194461452", formData.degree);
      localFormData.append(
        "entry.1215536533",
        formData.programmingLanguages.join(",")
      );
      localFormData.append(
        "entry.2068797540",
        formData.frameworksAndTools.join(",")
      );
      localFormData.append("entry.1483794269", formData.devpostProfile);
      localFormData.append("entry.618662987", formData.githubProfile);
      localFormData.append("entry.1247596049", formData.hackathonsAttended);
      localFormData.append("entry.289288076", formData.focuses.join(","));
      localFormData.append(
        "entry.444967086",
        formData.preferredRoles.projectManagement.toString()
      );
      localFormData.append(
        "entry.1174368867",
        formData.preferredRoles.software.toString()
      );
      localFormData.append(
        "entry.638316355",
        formData.preferredRoles.hardware.toString()
      );
      localFormData.append(
        "entry.334805419",
        formData.preferredRoles.uiDesign.toString()
      );

      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSf6PNnpumkNMZqvoJA8cOPNtLfv9UfrXygDQA1zEm24LW46NA/formResponse",
        {
          method: "POST",
          body: localFormData,
          mode: "no-cors",
        }
      );

      // Navigate to the next page
      router.push("/alpha/hackathons");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      toast.error("Failed to save your profile. Please try again.");
    }
  };

  const programmingLanguages = [
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

  const frameworksAndTools = [
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

  const focuses = [
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

  return (
    <div className="justify-center min-h-screen bg-[#111119] p-4">
      <header className="sticky top-0 z-10 bg-white/20 rounded-full mx-2 px-4 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-white" />
            <Link href="/" className="text-2xl font-bold text-white">
              ynergy
            </Link>
          </div>
          {/* Profile Dropdown Menu */}
          <div className="flex items-center gap-2">
            {/* Profile Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  {/* Display the user's full name */}
                  <span className="text-white">{user?.fullName || "Username"}</span>
                  {/* Display the user's profile picture */}
                  {/* <Image
                    src={user?.profileImageUrl || "/placeholder.svg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  /> */}
                  <UserButton />
                </div>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content className="w-48 bg-zinc-800 text-white border border-amber-500 rounded-md shadow-lg p-2">
                <DropdownMenu.Item asChild>
                  <Link href="/alpha/account-setup" className="flex items-center gap-2 p-2 rounded hover:bg-amber-100 hover:text-black">
                    <Users className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 p-2 w-full text-left rounded hover:bg-amber-100 hover:text-black"
                  >
                    <span>Sign Out</span>
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          {/* <div className="flex justify-end mb-4">
            <UserButton />
            <Button variant="secondary" onClick={() => signOut()} className="ml-2">
              Sign Out
            </Button>
          </div> */}
        </div>
      </header>
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

                  {/* <div className="space-y-2">
                    <Label htmlFor="graduatingClass">Graduating Class</Label>
                    <Select
                      name="graduatingClass"
                      value={formData.graduatingClass}
                      onValueChange={handleSelectChange("graduatingClass")}
                    >
                      <SelectTrigger >
                        <SelectValue placeholder="Select graduation year"/>
                      </SelectTrigger>
                      <SelectContent>
                        {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(
                          (year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div> */}
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
                    <Label htmlFor="programmingLanguages" className="text-white">Programming Languages</Label>
                    <Multiselect
                      options={programmingLanguages}
                      selectedItems={formData.programmingLanguages}
                      setSelectedItems={(items) => {
                        setFormData((prev) => ({
                          ...prev,
                          programmingLanguages: items,
                        }));
                      }}
                    />
                  </div>

                  <div className="space-y-2 text-black">
                    <Label htmlFor="frameworksAndTools" className="text-white">Frameworks and Tools</Label>
                    <Multiselect
                      options={frameworksAndTools}
                      selectedItems={formData.frameworksAndTools}
                      setSelectedItems={(items) => {
                        setFormData((prev) => ({
                          ...prev,
                          frameworksAndTools: items,
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
                        <Label htmlFor="devpostProfile">Devpost Profile</Label>
                        <Input
                          id="devpostProfile"
                          name="devpostProfile"
                          value={formData.devpostProfile}
                          onChange={handleChange}
                          placeholder="https://devpost.com/yourusername"
                          className="bg-zinc-700 border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="githubProfile">GitHub Profile</Label>
                        <Input
                          id="githubProfile"
                          name="githubProfile"
                          value={formData.githubProfile}
                          onChange={handleChange}
                          placeholder="https://github.com/yourusername"
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

              {/* Optional Information section */}

              {/* <Collapsible
                open={isOptionalExpanded}
                onOpenChange={setIsOptionalExpanded}
                className="space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center justify-between w-full"
                  >
                    <span>Optional Information</span>
                    {isOptionalExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Goals</Label>
                    <Textarea
                      id="objectives"
                      name="objectives"
                      value={formData.objectives}
                      onChange={handleChange}
                      placeholder="What's something you're excited to work on in the next 10 years? Dream big!"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dietaryRestrictions">
                      Dietary Restrictions
                    </Label>
                    <Input
                      id="dietaryRestrictions"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleChange}
                      placeholder="Any dietary requirements or allergies"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessibilityNeeds">
                      Accessibility Needs
                    </Label>
                    <Textarea
                      id="accessibilityNeeds"
                      name="accessibilityNeeds"
                      value={formData.accessibilityNeeds}
                      onChange={handleChange}
                      placeholder="Any specific accessibility requirements"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible> */}
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
