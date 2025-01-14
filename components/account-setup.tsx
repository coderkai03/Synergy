"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  defaultUser,
  technologies_options,
  category_experience_options,
  User
} from "@/types/User";
import SkillsSection from "./slider-section";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { ItemSelect } from "./item-select";
import { Textarea } from "./ui/textarea";
import NotFound from "./not-found";
import { testLog } from "@/hooks/useCollection";

export function AccountSetupComponent() {
  const router = useRouter();
  const { user } = useUser();
  const { userData, createUser, loading: userLoading } = useFirebaseUser();

  const [formData, setFormData] = useState<User>({
    ...defaultUser,
    email: user?.primaryEmailAddress?.emailAddress || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    role_experience: {
      product_management: -1,
      software: -1,
      hardware: -1,
      design: -1
    }
  });
  const [currentSection, setCurrentSection] = useState(0);
  
  useEffect(() => {
    testLog('Current userData:', userData);
    if (userData) {
      setFormData(prevFormData => ({
        ...userData,
        id: userData.id ?? "",
        firstName: userData.firstName ?? "",
        lastName: userData.lastName ?? "",
        email: userData.email ?? "",
        profilePicture: userData.profilePicture ?? "",
        bio: userData.bio ?? "",
        school: userData.school ?? "",
        major: userData.major ?? "",
        technologies: userData.technologies ?? [],
        category_experience: userData.category_experience ?? [],
        interests: userData.interests ?? [],
        linkedin: userData.linkedin ?? "",
        devpost: userData.devpost ?? "",
        github: userData.github ?? "",
        number_of_hackathons: userData.number_of_hackathons ?? "",
        role_experience: {
          ...prevFormData.role_experience,
          ...userData.role_experience,
          product_management: userData.role_experience?.product_management ?? -1,
          software: userData.role_experience?.software ?? -1,
          hardware: userData.role_experience?.hardware ?? -1,
          design: userData.role_experience?.design ?? -1
        },
        teams: userData.teams ?? [],
        invites: userData.invites ?? []
      }));
    }
  }, [userData]);

  useEffect(() => {
    testLog('Updated formData:', formData);
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
    testLog(`Role: ${role}, Value: ${value}`);
    setFormData({
      ...formData,
      role_experience: {
        ...formData.role_experience,
        [role]: value[0],
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createUser(formData);
    if (success) {
      router.push("/home");
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentSection(prev => prev + 1);
  };

  if (
    (!userData &&
    !userLoading) &&
    !userData
  ) {
    return <NotFound />;
  }

  return (
    <div className="flex items-start justify-center min-h-screen bg-[#111119] p-4 pt-24">
      <div className="w-full max-w-2xl">
        {userData ? (
          <Card className="items-center space-y-6 w-full bg-[#111119] text-white border-none pt-5">
            <form onSubmit={
                currentSection === 4 ? handleSubmit : handleNext
              }>
                <CardContent className="space-y-6 text-white">

                {/* Personal Information section */}
                {currentSection === 0 && (
                  <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Personal Information</h2>
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
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        className="bg-zinc-700 border-amber-500/50 min-h-[40px]" 
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Give us your best one-liner..."
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Educational Background section */}
                {currentSection === 1 && (
                  <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Education</h2>
                    <div className="grid grid-cols-1 md:grid-rows-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="school">School</Label>
                        <Input 
                          id="school" 
                          className="bg-zinc-700 border-amber-500/50" 
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
                    </div>
                  </div>
                )}

                {/* Technical Skills section */}
                {currentSection === 2 && (
                  <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Skills and Interests</h2>
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
                  </div>
                )}

                {/* Online Profiles section */}
                {currentSection === 3 && (
                  <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Online Profiles</h2>
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
                  </div>
                )}

                {/* Hackathon Experience section */}
                {currentSection === 4 && (
                  <div className="bg-zinc-800 rounded-lg p-4 space-y-6">
                    <h2 className="text-lg font-semibold text-white">Hackathon Experience</h2>
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
                  </div>
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
                        !formData.school ||
                        !formData.major ||
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
          </Card>
        ) : (
          <div className="flex items-center justify-center">
          </div>
        )}
      </div>
    </div>
  );
}
