"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { defaultUser, User } from "@/types/User";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import NotFound from "./not-found";
import { testLog } from "@/hooks/useCollection";

export function ProfileBuilder() {
  const router = useRouter();
  const { user } = useUser();
  const { getUserData, createUser, loading: userLoading } = useFirebaseUser();

  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<User>({
    ...defaultUser,
    email: user?.primaryEmailAddress?.emailAddress || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userData = await getUserData(user.id);
      
      if (!userData) return;
      setUserData(userData);
    };
    fetchUserData();
  }, [user]);

  const getHackerProfile = async (link: string) => {
    setIsLoading(true);
    try {
      const username = link.split("/")[3];
      testLog("Attempting to fetch for username:", username);
      
      const response = await fetch('/backend/api/generate-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ github_username: username })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      testLog("Generated Profile:", data);
      return data;
    } catch (error) {
      console.error("Error generating profile:", error);
      // Handle the error appropriately in your UI
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    try {
      const data = await getHackerProfile(formData.github);
      setFormData({...formData, ...data});
      const success = await createUser(formData, userData);
      if (success) {
        router.push("/home");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Add user feedback here (e.g., toast notification)
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  if (!userData && !userLoading && !userData) {
    return <NotFound />;
  }

  return (
    <div className="flex items-start justify-center min-h-screen bg-[#111119] p-4 pt-24">
      <div className="w-full max-w-2xl">
        {userData ? (
          <Card className="items-center space-y-6 w-full bg-[#111119] text-white border-none pt-5">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 text-white">
                <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-white">Online Profile</h2>
                  <div className="space-y-2">
                    <Label htmlFor="github">Github Link</Label>
                    <Input
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={(e) => setFormData({...formData, github: e.target.value})}
                      placeholder="https://github.com/yourusername"
                      required
                      className="bg-zinc-700 border-amber-500/50"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-end">
                  <Button
                    type="submit" 
                    className="bg-amber-500 hover:bg-amber-600"
                    disabled={!formData.github || isLoading}
                  >
                    Finish
                  </Button>
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
