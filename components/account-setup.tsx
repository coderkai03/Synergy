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
import { defaultUser, programming_languages, category_experience, User } from "@/types/User";
import SkillsSection from "./slider-section";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { ItemSelect } from "./item-select";

export function AccountSetupComponent() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { userData, loading: isFirebaseLoading } = useFirebaseUser(user?.id);
  const [formData, setFormData] = useState<User>({
    ...defaultUser,
    email: user?.primaryEmailAddress?.emailAddress || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  
  useEffect(() => {
    console.log('Current userData:', userData);
    setFormData({
      ...formData,
      ...userData,
    });
  }, [userData]);

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
      if (!user?.id) return;
      const userDoc = doc(db, 'users', user.id);
      await setDoc(userDoc, formData);
      console.log("User data updated successfully");

      // Navigate to the next page
      router.push("/hackathons");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      toast.error("Failed to save your profile. Please try again.");
    }
  };

  return (
    <div className="justify-center min-h-screen bg-[#111119] p-4">
      <div className="flex justify-center">
        <Card className="felx fex-col items-center space-y-6 w-3/4 bg-[#111119] text-white border-none pt-5">
          <CardHeader>
            <CardTitle>Account Setup</CardTitle>
            <CardDescription>
              Complete your profile to find the perfect hackathon partners and
              enhance your experience.
            </CardDescription>
          </CardHeader>

          {isLoaded && !isFirebaseLoading ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 text-white">

              {/* Personal Information section */}
              <Collapsible defaultOpen className="bg-zinc-800 rounded-lg">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
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
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      className="bg-zinc-700 border-amber-500/50" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Educational Background section */}
              <Collapsible className="bg-zinc-800 rounded-lg">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <h2 className="text-lg font-semibold text-white">Education</h2>
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
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

              {/* Technical Skills section */}
              <Collapsible className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                    <h2 className="text-lg font-semibold text-white">Technical Skills</h2>
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="programming_languages" className="text-white">Programming Languages</Label>
                    <ItemSelect
                      itemList={programming_languages.map(lang => ({
                        id: lang,
                        label: lang
                      }))}
                      selectedItems={formData.programming_languages}
                      onItemAdd={(langId) => {
                        setFormData(prev => ({
                          ...prev,
                          programming_languages: [...prev.programming_languages, langId]
                        }));
                      }}
                      onItemRemove={(langId) => {
                        setFormData(prev => ({
                          ...prev,
                          programming_languages: prev.programming_languages.filter(id => id !== langId)
                        }));
                      }}
                      placeholder="Search languages..."
                      maxItems={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category_experience" className="text-white">Category Experience</Label>
                    <ItemSelect
                      itemList={category_experience.map(item => ({
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
                  </CollapsibleContent>
                </Collapsible>

              {/* Online Profiles section */}
              <Collapsible className="bg-zinc-800 rounded-lg">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
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

            </CardContent>
            <CardFooter>
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit" 
                  className="bg-amber-500 hover:bg-amber-600"
                  disabled={
                    !formData.firstName || 
                    !formData.lastName ||
                    !formData.phone ||
                    !formData.school ||
                    !formData.degree ||
                    !formData.gradYear ||
                    !formData.number_of_hackathons ||
                    !formData.devpost ||
                    !formData.github ||
                    !formData.programming_languages.length ||
                    !formData.category_experience.length ||
                    !formData.role_experience ||
                    Object.values(formData.role_experience || {}).some(value => value === -1)
                  }
                >
                  Submit
                </Button>
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
