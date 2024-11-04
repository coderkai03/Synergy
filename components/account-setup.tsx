"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Multiselect } from "./multiselect";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export function AccountSetupComponent() {
  const router = useRouter();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    graduatingClass: "",
    school: "",
    degree: "",
    programmingLanguages: [] as string[],
    frameworksAndTools: [] as string[],
    devpostProfile: "",
    githubProfile: "",
    hackathonsAttended: "",
    achievements: "",
    objectives: "",
    focuses: [] as string[],
    preferredRoles: {
      projectManagement: 50,
      software: 50,
      hardware: 50,
      uiDesign: 50,
    },
    dietaryRestrictions: "",
    accessibilityNeeds: "",
  });

  const [isOptionalExpanded, setIsOptionalExpanded] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting formData:", formData);

      // Save to localStorage
      localStorage.setItem("accountSetupData", JSON.stringify(formData));
      console.log("Account Setup Data saved to localStorage:", formData);

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
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Synergy: Hackathon Account Setup</CardTitle>
          <CardDescription>
            Complete your profile to find the perfect hackathon partners and
            enhance your experience.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Personal Information section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduatingClass">Graduating Class</Label>
                  <Select
                    name="graduatingClass"
                    value={formData.graduatingClass}
                    onValueChange={handleSelectChange("graduatingClass")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select graduation year" />
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
                </div>
              </div>
            </div>

            {/* Educational Background section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Educational Background</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Input
                    id="school"
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
                  />
                </div>
              </div>
            </div>

            {/* Technical Skills section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Technical Skills</h3>
              <div className="space-y-2">
                <Label htmlFor="programmingLanguages">
                  Programming Languages
                </Label>
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
              <div className="space-y-2">
                <Label htmlFor="frameworksAndTools">Frameworks and Tools</Label>
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
            </div>

            {/* Online Profiles section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Online Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="devpostProfile">Devpost Profile</Label>
                  <Input
                    id="devpostProfile"
                    name="devpostProfile"
                    value={formData.devpostProfile}
                    onChange={handleChange}
                    placeholder="https://devpost.com/yourusername"
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
                  />
                </div>
              </div>
            </div>

            {/* Hackathon Experience section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hackathon Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hackathonsAttended">
                    Number of Hackathons Attended
                  </Label>
                  <Select
                    onValueChange={handleSelectChange("hackathonsAttended")}
                    value={formData.hackathonsAttended}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of hackathons" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, "5+"].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements">Achievements</Label>
                  <Textarea
                    id="achievements"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    placeholder="Highlights past successes and areas of excellence"
                  />
                </div>
              </div>
            </div>

            {/* Goals and Interests section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Goals and Interests</h3>
              <div className="space-y-2">
                <Label htmlFor="focuses">Focuses</Label>
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

            {/* Preferred Roles section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preferred Roles</h3>
              <p className="text-sm text-muted-foreground">
                Rate your confidence level in each role from 0 to 100
              </p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectManagement">Project Management</Label>
                  <p className="text-sm text-muted-foreground">
                    Leading teams, coordinating tasks, and ensuring project
                    success, presentation skills
                  </p>
                  <Slider
                    id="projectManagement"
                    min={0}
                    max={100}
                    step={1}
                    value={[formData.preferredRoles.projectManagement]}
                    onValueChange={handleSliderChange("projectManagement")}
                  />
                  <p className="text-sm text-right">
                    {formData.preferredRoles.projectManagement}%
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="software">Software Development</Label>
                  <p className="text-sm text-muted-foreground">
                    Programming, app development, and software architecture
                  </p>
                  <Slider
                    id="software"
                    min={0}
                    max={100}
                    step={1}
                    value={[formData.preferredRoles.software]}
                    onValueChange={handleSliderChange("software")}
                  />
                  <p className="text-sm text-right">
                    {formData.preferredRoles.software}%
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hardware">Hardware Development</Label>
                  <p className="text-sm text-muted-foreground">
                    Electronics, prototyping, and physical computing
                  </p>
                  <Slider
                    id="hardware"
                    min={0}
                    max={100}
                    step={1}
                    value={[formData.preferredRoles.hardware]}
                    onValueChange={handleSliderChange("hardware")}
                  />
                  <p className="text-sm text-right">
                    {formData.preferredRoles.hardware}%
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uiDesign">UI/UX Design</Label>
                  <p className="text-sm text-muted-foreground">
                    User interface design, user experience, wireframing, and
                    prototyping
                  </p>
                  <Slider
                    id="uiDesign"
                    min={0}
                    max={100}
                    step={1}
                    value={[formData.preferredRoles.uiDesign]}
                    onValueChange={handleSliderChange("uiDesign")}
                  />
                  <p className="text-sm text-right">
                    {formData.preferredRoles.uiDesign}%
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Information section */}

            <Collapsible
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
            </Collapsible>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
