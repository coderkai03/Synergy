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
// import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { ChevronDown, ChevronUp } from "lucide-react";
import { Multiselect } from "./multiselect";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { db } from '@/firebaseConfig'
import { doc, setDoc, updateDoc, collection, addDoc } from '@firebase/firestore'

export function AccountSetupComponent() {
  const router = useRouter();
  const { user } = useUser();

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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradYear">Graduating Class</Label>
                  <Select
                    name="gradYear"
                    value={formData.gradYear}
                    onValueChange={handleSelectChange("gradYear")}
                    required
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
                <Label htmlFor="programming_languages">
                  Programming Languages
                </Label>
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
              <div className="space-y-2">
                <Label htmlFor="frameworks_and_tools">Frameworks and Tools</Label>
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
            </div>

            {/* Online Profiles section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Online Profiles</h3>
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
                  />
                </div>
              </div>
            </div>

            {/* Hackathon Experience section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hackathon Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number_of_hackathons">
                    Number of Hackathons Attended
                  </Label>
                  <Select
                    onValueChange={handleSelectChange("number_of_hackathons")}
                    value={formData.number_of_hackathons}
                    required
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
              </div>
            </div>

            {/* Goals and Interests section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Goals and Interests</h3>
              <div className="space-y-2">
                <Label htmlFor="category_experience">Category_experience</Label>
                <Multiselect
                  options={category_experience}
                  selectedItems={formData.category_experience}
                  setSelectedItems={(selectedItems) => {
                    setFormData((prev) => ({
                      ...prev,
                      category_experience: selectedItems,
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
                    value={[formData.role_experience.projectManagement]}
                    onValueChange={handleSliderChange("projectManagement")}
                  />
                  <p className="text-sm text-right">
                    {formData.role_experience.projectManagement}%
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
                    value={[formData.role_experience.software]}
                    onValueChange={handleSliderChange("software")}
                  />
                  <p className="text-sm text-right">
                    {formData.role_experience.software}%
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
                    value={[formData.role_experience.hardware]}
                    onValueChange={handleSliderChange("hardware")}
                  />
                  <p className="text-sm text-right">
                    {formData.role_experience.hardware}%
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
                    value={[formData.role_experience.uiDesign]}
                    onValueChange={handleSliderChange("uiDesign")}
                  />
                  <p className="text-sm text-right">
                    {formData.role_experience.uiDesign}%
                  </p>
                </div>
              </div>
            </div>

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
            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
