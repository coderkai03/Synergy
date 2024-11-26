"use client";

import {
  useUser,
  SignInButton,
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardList, Users, UserPlus, Zap } from "lucide-react";
import betaPrev from "@/public/img/betapreview.png";
import SynergyLogo from "@/components/synergy-logo";

export default function SynergyLanding() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="min-h-screen fglw-full bg-[#111119]">
      <div className="min-h-screen w-full bg-cover bg-center">
        {/* <Toaster position="top-center" /> */}
        

        <main className="flex items-center justify-center min-h-screen p-20">
          <div className="w-1/2 px-4 py-16 flex flex-col items-center overflow-hidden"> 
            <div className="scale-150">
              <SynergyLogo/>
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
                  Hackathon team matching done for you.
                </p>
              </div>
              
              {isLoaded && !isSignedIn ? (
                <SignInButton
                fallbackRedirectUrl="/alpha/account-setup"
                mode="modal"
              >
                <Button
                  className="group mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-xl font-medium text-white transition-all hover:bg-white hover:text-gray-900"
                >
                  Get Started
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
              </SignInButton>
              ) : (
                <Link
                  href='/alpha/hackathons'
                  className="group mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-xl font-medium text-white transition-all hover:bg-white hover:text-gray-900"
                >
                  Get Started
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
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
            <div className="relative group mb-4 h-72">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-zinc-600 rounded-lg opacity-100 group-hover:blur-lg"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-gradient-to-r from-pink-600 to-orange-600 h-full">
                <Users className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-semibold text-white">Find Your Dream Team</h3>
                <p className="text-gray-300">
                  Connect with like-minded developers\, designers\, and innovators to form the perfect hackathon team.
                </p>
              </div>
            </div>
            
            <div className="relative group mb-4 h-72">
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-zinc-600 rounded-lg opacity-100 group-hover:blur-lg"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent h-full">
                <Zap className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-semibold text-white">Boost Your Productivity</h3>
                <p className="text-gray-300">
                  Collaborate with your team members effortlessly and boost your productivity with our intuitive platform.
                </p>
              </div>
            </div>

            <div className="relative group mb-4 h-72">
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-yellow-600 rounded-lg opacity-100 group-hover:blur"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent h-full">
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
