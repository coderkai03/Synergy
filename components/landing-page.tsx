"use client";

import { motion } from "framer-motion";
import {Zap, Search, User } from "lucide-react";
import GetStarted from "@/components/get-started";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { schools } from "@/types/Schools";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-[#111119]">
      <div className="h-[100vh] w-full bg-cover bg-center flex flex-col items-center justify-center space-y-5 text-center -mt-10">
        <p className="text-2xl md:text-4xl font-bold leading-relaxed text-white">
          Find your dream team<br/>for any hackathon.
        </p>
        <p className="text-zinc-400 text-xl">
          Used by students at
        </p>
        <InfiniteMovingCards
          items={schools}
        />
        <GetStarted/>
      </div>

      <section className="min--screen bg-[#111119] py-24 px-5 md:px-20">
          <div className="container px-5 mx-auto">
            <h2 className="text-center mb-16 text-2xl md:text-4xl text-white">
              Match with teams that synergize with you.
            </h2>
          </div>
      
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 w-[90%] mx-auto gap-8 bg-[#111119] mb-4"
          >
            <div className="relative group h-64">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-zinc-600 rounded-lg opacity-100 group-hover:blur-lg"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent h-full">
                <User className="h-8 w-8 md:h-12 md:w-12 text-white mb-4" />
                <h3 className="text-lg md:text-2xl font-semibold text-white">Build your profile</h3>
                <p className="text-sm md:text-base text-gray-300">
                  Create a hacker profile that flexes your skills and interests.
                </p>
              </div>
            </div>
            
            {/* TODO: BETA VERSION */}
            {/* <div className="relative group mb-4 h-72">
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-zinc-600 rounded-lg opacity-100 group-hover:blur-lg"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent h-full">
                <Users className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-semibold text-white">Swipe through teams</h3>
                <p className="text-gray-300">
                  Browse hundreds of hackers and teams for your next hackathon.
                </p>
              </div>
            </div> */}

            <div className="relative group h-64">
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-zinc-600 rounded-lg opacity-100 group-hover:blur-lg"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent h-full">
                <Search className="h-8 w-8 md:h-12 md:w-12 text-white mb-4" />
                <h3 className="text-lg md:text-2xl font-semibold text-white">Apply for teams</h3>
                <p className="text-sm md:text-base text-gray-300">
                  Browse through hackathons and apply for teams.
                </p>
              </div>
            </div>

            <div className="relative group h-64">
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-yellow-600 rounded-lg opacity-100 group-hover:blur"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent h-full">
                <Zap className="h-8 w-8 md:h-12 md:w-12 text-white mb-4" />
                <h3 className="text-lg md:text-2xl font-semibold text-white">Find matches using AI</h3>
                <p className="text-sm md:text-base text-gray-300">
                  Can&apos;t find a team? Our matching algorithm will find the perfect teams for you!
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="mt-10 mb-20">
          <GetStarted/>
        </div>
    </div>
  );
}
