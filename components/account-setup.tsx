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
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { db } from '@/firebaseConfig'
import { doc, setDoc } from '@firebase/firestore'
import {
  defaultUser,
  technologies_options,
  category_experience_options,
  // interests_options,
  User
} from "@/types/User";
import SkillsSection from "./slider-section";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { ItemSelect } from "./item-select";
import { useSchools } from "@/hooks/useSchools";

export function AccountSetupComponent() {
  const router = useRouter();
  const { user } = useUser();
  const { userData } = useFirebaseUser();
  const { loading, error } = useSchools();

  const [formData, setFormData] = useState<User>({
    ...defaultUser,
    email: user?.primaryEmailAddress?.emailAddress || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [currentSection, setCurrentSection] = useState(0);
  
  useEffect(() => {
    console.log('Current userData:', userData);
    setFormData({
      ...formData,
      ...userData,
    });
  }, [userData]);

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
      if (!user?.id) return;
      const userDoc = doc(db, 'users', user.id);
      await setDoc(userDoc, {
        ...formData, 
        email: user?.primaryEmailAddress?.emailAddress,
      });
      console.log("User data updated successfully");

      // Navigate to the next page
      router.push("/hackathons");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      toast.error("Failed to save your profile. Please try again.");
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentSection(prev => prev + 1);
  };

  return (
    <div className="justify-center min-h-screen bg-[#111119] p-4">
      <div className="flex justify-center">
        <Card className="felx fex-col items-center space-y-6 w-1/2 bg-[#111119] text-white border-none pt-5">
          <CardHeader>
            <CardTitle>Account Setup</CardTitle>
            <CardDescription>
              Complete your profile to find the perfect hackathon partners and
              enhance your experience.
            </CardDescription>
          </CardHeader>

          {userData ? (
            <form onSubmit={
              currentSection === 4 ? handleSubmit : handleNext
            }>
              <CardContent className="space-y-6 text-white">

              {/* Personal Information section */}
              {currentSection === 0 && (
                <Collapsible defaultOpen className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                    <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-rows-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        className="bg-zinc-700 border-amber-500/50" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        className="bg-zinc-700 border-amber-500/50" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      className="bg-zinc-700 border-amber-500/50" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div> */}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Educational Background section */}
              {currentSection === 1 && (
                <Collapsible defaultOpen className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                    <h2 className="text-lg font-semibold text-white">Education</h2>
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-rows-2 gap-4">
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
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      placeholder="Your Major"
                      required
                      className="bg-zinc-700 border-amber-500/50"
                    />
                  </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="gradYear">Graduation Year</Label>
                        <Select
                          name="gradYear"
                          value={formData.gradYear}
                          onValueChange={handleSelectChange("gradYear")}
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
                      </div> */}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Technical Skills section */}
              {currentSection === 2 && (
                <Collapsible defaultOpen className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                    <h2 className="text-lg font-semibold text-white">Skills and Interests</h2>
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="programming_languages" className="text-white">Programming Languages</Label>
                      <ItemSelect
                        itemList={technologies_options.map(lang => ({
                          id: lang,
                          label: lang
                        }))}
                        selectedItems={formData.technologies}
                        onItemAdd={(langId) => {
                          setFormData(prev => ({
                            ...prev,
                            technologies: [...prev.technologies, langId]
                          }));
                        }}
                        onItemRemove={(langId) => {
                          setFormData(prev => ({
                            ...prev,
                            technologies: prev.technologies.filter(id => id !== langId)
                          }));
                        }}
                        placeholder="Search languages..."
                        maxItems={10}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category_experience" className="text-white">Category Experience</Label>
                      <ItemSelect
                        itemList={category_experience_options.map(item => ({
                          id: item,
                          label: item
                        }))}
                        selectedItems={formData.category_experience}
                        onItemAdd={(itemId) => {
                          setFormData(prev => ({
                            ...prev,
                            category_experience: [...prev.category_experience, itemId]
                          }));
                        }}
                        onItemRemove={(itemId) => {
                          setFormData(prev => ({
                            ...prev,
                            category_experience: prev.category_experience.filter(id => id !== itemId)
                          }));
                        }}
                        placeholder="Search categories..."
                        maxItems={10}
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="interests" className="text-white">Interests</Label>
                      <ItemSelect
                        itemList={interests_options.map(interest => ({
                          id: interest,
                          label: interest
                        }))}
                        selectedItems={formData.interests}
                        onItemAdd={(interestId) => {
                          setFormData(prev => ({
                            ...prev,
                            interests: [...prev.interests, interestId]
                          }));
                        }}
                        onItemRemove={(interestId) => {
                          setFormData(prev => ({
                            ...prev,
                            interests: prev.interests.filter(id => id !== interestId)
                          }));
                        }}
                        placeholder="Search interests..."
                        maxItems={10}
                      />
                    </div> */}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Online Profiles section */}
              {currentSection === 3 && (
                <Collapsible defaultOpen className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                    <h2 className="text-lg font-semibold text-white">Online Profiles</h2>
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-rows-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="devpost">Devpost Link</Label>
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
                        <Label htmlFor="github">GitHub Link</Label>
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
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Link</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/yourusername"
                          required
                          className="bg-zinc-700 border-amber-500/50"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Hackathon Experience section */}
              {currentSection === 4 && (
                <Collapsible defaultOpen className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                    <h2 className="text-lg font-semibold text-white">Hackathon Experience</h2>
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hackathonsAttended">Number of Hackathons Attended</Label>
                        <Select
                          name="hackathonsAttended"
                          value={formData.number_of_hackathons}
                          onValueChange={handleSelectChange("number_of_hackathons")}
                        >
                          <SelectTrigger className="bg-zinc-700 border-amber-500/50">
                            <SelectValue placeholder="Select number of hackathons" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-700 border-amber-500/50 text-white">
                            {['0', '1', '2', '3', '4', '5+'].map((num) => (
                              <SelectItem key={num} value={num}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center w-full">
                        <h3 className="flex w-1/5 text-sm text-zinc-400">Rate your experience level in each role</h3>
                        <div className="flex flex-row space-x-1 justify-evenly flex-1 text-sm text-zinc-400">
                          <span>Beginner</span>
                          <span>Intermediate</span>
                          <span>Advanced</span>
                        </div>
                      </div>
                      <div className="border-t border-zinc-700 my-4"></div>

                      <SkillsSection formData={formData} handleSliderChange={handleSliderChange}/>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

            </CardContent>
            <CardFooter>
              {/* Navigation Buttons */}
              <div className="flex justify-between w-full">
                {currentSection > 0 && (
                  <Button
                    type="button"
                    className="bg-zinc-700 hover:bg-zinc-600"
                    onClick={() => setCurrentSection(currentSection - 1)}
                  >
                    Back
                  </Button>
                )}
                <div className={currentSection === 0 ? "w-full flex justify-end" : ""}>
                  <Button
                    type="submit" 
                    className="bg-amber-500 hover:bg-amber-600"
                    disabled={
                      currentSection === 4 && (
                      !formData.firstName || 
                      !formData.lastName ||
                      // !formData.phone ||
                      !formData.school ||
                      !formData.major ||
                      // !formData.gradYear ||
                      !formData.number_of_hackathons ||
                      !formData.devpost ||
                      !formData.github ||
                      !formData.technologies.length ||
                      !formData.category_experience.length ||
                      !formData.role_experience ||
                      Object.values(formData.role_experience || {}).some(value => value === -1)
                    )
                  }
                  >
                    {currentSection === 4 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </CardFooter>
            </form>
          ) : (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500"></div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
