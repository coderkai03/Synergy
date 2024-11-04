"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useUser,
  SignInButton,
  SignUpButton,
  SignOutButton,
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Users, Rocket, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function SynergyLanding() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/alpha/hackathons");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-100">
      <Toaster position="top-center" />
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/">
            <Image
              src="/assets/logoSize.png"
              alt="Synergy Logo"
              className="h-10 w-10"
              width={40}
              height={40}
            />
          </a>
          <span className="ml-2 font-bold text-2xl text-gray-800">Synergy</span>
        </div>
        <nav>{/* Future navigation links can be added here */}</nav>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/alpha/account-setup")}
              >
                Edit Profile
              </Button>
              <span className="text-sm">{user?.fullName || "John Doe"}</span>
              <SignOutButton>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </SignOutButton>
            </>
          ) : null}
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold mb-6 text-blue-600">
            Synergy
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Connect with like-minded individuals and form the perfect teams for
            your next hackathon. Boost your productivity and make meaningful
            collaborations effortlessly.
          </p>
        </motion.div>

        {!isSignedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl"
          >
            <div className="space-y-6">
              <SignInButton
                fallbackRedirectUrl="/alpha/hackathons"
                mode="modal"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton
                fallbackRedirectUrl="/alpha/account-setup"
                mode="modal"
              >
                <Button
                  variant="outline"
                  className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 grid md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <Users className="h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Find Your Dream Team
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Connect with like-minded developers, designers, and innovators to
              form the perfect hackathon team.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <Rocket className="h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Boost Your Projects
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Leverage diverse skills and perspectives to take your hackathon
              projects to new heights.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <Zap className="h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Accelerate Your Growth
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Learn from peers, gain new skills, and expand your network in the
              tech community.
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="mt-24 py-12 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            &copy; 2024 Synergy. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-gray-600 hover:underline">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
