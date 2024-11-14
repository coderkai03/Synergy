"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useUser,
  SignInButton,
  // SignUpButton,
  SignOutButton,
  // useAuth,
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ArrowRight, ClipboardList, Users, UserPlus, Rocket, Zap } from "lucide-react";
import betaPrev from "@/public/img/betapreview.png";
import homeBg from "@/public/img/homepage.png";

export default function SynergyLanding() {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/alpha/hackathons");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen fglw-full bg-[#111119]">
      <div className="min-h-screen w-full bg-cover bg-center" 
        style={{
          backgroundImage:`url(${homeBg.src})`}}>

        {isSignedIn && (
          // <header className="p-10 flex items-center justify-between w-full max-w-6xl mx-auto">
          //   <nav>{/* Future navigation links can be added here */}</nav>
          //   <div className="flex items-center gap-4">
          //         <Button
          //           variant="outline"
          //           size="sm"
          //           onClick={() => router.push("/alpha/account-setup")}
          //         >
          //           Edit Profile
          //         </Button>
          //         <span className="text-sm">{user?.fullName || "John Doe"}</span>
          //         <SignOutButton>
          //           <Button variant="outline" size="sm">
          //             Sign Out
          //           </Button>
          //         </SignOutButton>
          //   </div>
          // </header>
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
            </div>
          </header>
        )}
        {/* <Toaster position="top-center" /> */}
        

        <main className="flex items-center justify-start min-h-screen p-20">
          <div className="w-1/2 px-4 py-16 flex flex-col items-start overflow-hidden"> 
            <div className="flex items-center text-white">
              <svg
                className="h-12 w-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="text-5xl font-light tracking-wide"> ynergy </span>
            </div>
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl font-extrabold mb-6 text-blue-600">
                Synergy
              </h1> */}
              <div className="flex items-center justify-center mt-8 text-white">
                <p className="text-xl font-light leading-relaxed">
                  Connect with like-minded individuals and form the perfect teams for
                  your next hackathon. Boost your productivity and make meaningful
                  collaborations effortlessly.
                </p>
              </div>
              
              <SignInButton
                fallbackRedirectUrl="/alpha/hackathons"
                mode="modal"
              >
                <Button
                  className="group mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-xl font-medium text-white transition-all hover:bg-white hover:text-gray-900"
                >
                  Apply Now
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
              </SignInButton>
              
            {/* </motion.div> */}

            {/* {!isSignedIn && (
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
            )} */}
            </div>
        </main>
      </div>

      <section className="min--screen bg-[#111119] py-24 px-20">
          <div className="container px-4 mx-auto">
            <h2 className="text-center mb-16 text-4xl text-white">
              What can <span className="italic">Synergy</span> bring to you...
            </h2>
          </div>
      
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-24 grid md:grid-cols-3 gap-8 bg-[#111119]"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-orange-600 rounded-lg opacity-100 group-hover:blur-lg"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-gradient-to-r from-pink-600 to-orange-600">
                <Users className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-semibold text-white">Find Your Dream Team</h3>
                <p className="text-gray-300">
                  Connect with like-minded developers, designers, and innovators to form the perfect hackathon team.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-green-600 rounded-lg opacity-100 group-hover:blur-lg"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent">
                <Zap className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-semibold text-white">Boost Your Productivity</h3>
                <p className="text-gray-300">
                  Collaborate with your team members effortlessly and boost your productivity with our intuitive platform.
                </p>
              </div>
            </div>

            <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-yellow-600 rounded-lg opacity-100 group-hover:blur"></div>
            <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent">
              <Zap className="h-12 w-12 text-white mb-4" />
              <h3 className="text-2xl font-semibold text-white">Accelerate Your Growth</h3>
              <p className="text-gray-300">
                Learn from peers, gain new skills, and expand your network in the tech community.
              </p>
            </div>
          </div>
          </motion.div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 items-start p-20 text-white">
          <div className="space-y-8">
            <div className="rounded-lg p-6 backdrop-blur hover:bg-zinc-900/50">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    Complete the <span className="text-amber-500">sign up form</span>
                  </h2>
                  <p className="text-zinc-400">
                    Create your profile and tell us about your interests, skills, and what you're looking to learn
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-6 backdrop-blur hover:bg-zinc-900/50">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    Select Hackathon to <span className="text-amber-500">find team</span>
                  </h2>
                  <p className="text-zinc-400">
                    Browse through upcoming hackathons and choose the ones that match your interests and schedule
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-6 backdrop-blur hover:bg-zinc-900/50">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <UserPlus className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    Wait to <span className="text-amber-500">get matched</span>
                  </h2>
                  <p className="text-zinc-400">
                    Our matching algorithm will help you find the perfect teammates based on skills and interests
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-amber-500 absolute -inset-1.5 rounded-xl" />
            <div className="relative bg-zinc-900 p-2 rounded-xl overflow-hidden">
              <Image
                src={betaPrev}
                width={400}
                height={200}
                alt="Platform interface showing hackathon selection and team matching"
                className="rounded-lg w-full transition-transform duration-300 transform hover:scale-105"
              />
            </div>
          </div>
        </div>

      <footer className="mt-24 py-5 bg-[#111119]">
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
