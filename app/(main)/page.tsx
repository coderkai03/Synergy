"use client";

import { motion } from "framer-motion";
import {Zap, Search, User } from "lucide-react";
import GetStarted from "./get-started";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { schools } from "@/constants/schoollist";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full bg-[#111119]">
      <div className="h-[100vh] w-full bg-cover bg-center flex flex-col items-center justify-center space-y-12 text-center">
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

      <section className="min--screen bg-[#111119] py-24 px-20">
          <div className="container px-4 mx-auto">
            <h2 className="text-center mb-16 text-4xl text-white">
              Match with teams that synergize with you.
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
                <User className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-semibold text-white">Build your profile</h3>
                <p className="text-gray-300">
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

            <div className="relative group mb-4 h-72">
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-zinc-600 rounded-lg opacity-100 group-hover:blur-lg"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent h-full">
                <Search className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-semibold text-white">Apply for teams</h3>
                <p className="text-gray-300">
                  Browse through hackathons and apply for teams.
                </p>
              </div>
            </div>

            <div className="relative group mb-4 h-72">
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-yellow-600 rounded-lg opacity-100 group-hover:blur"></div>
              <div className="relative bg-black rounded-lg p-8 space-y-6 border-2 border-transparent group-hover:border-transparent h-full">
                <Zap className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-semibold text-white">Sit back and relax!</h3>
                <p className="text-gray-300">
                  Our matching algorithm will find the perfect team for you.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="mt-10 mb-20">
          <GetStarted/>
        </div>

        {/* TODO: BETA VERSION */}
        {/* <div className="grid lg:grid-cols-2 gap-8 items-start p-20 text-white">
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
                    Create your profile and tell us about your interests, skills, and what you&apos;re looking to learn
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
        </div> */}
    </div>
  );
}
