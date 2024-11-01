"use client";

import React from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const cardData = [
  {
    id: 1,
    name: "Alice",
    skill: "Frontend Developer",
    url: "/placeholder.svg?height=384&width=288",
  },
  {
    id: 2,
    name: "Bob",
    skill: "Backend Developer",
    url: "/placeholder.svg?height=384&width=288",
  },
  {
    id: 3,
    name: "Charlie",
    skill: "UI/UX Designer",
    url: "/placeholder.svg?height=384&width=288",
  },
  {
    id: 4,
    name: "Diana",
    skill: "Data Scientist",
    url: "/placeholder.svg?height=384&width=288",
  },
  {
    id: 5,
    name: "Ethan",
    skill: "DevOps Engineer",
    url: "/placeholder.svg?height=384&width=288",
  },
];

export function LandingPageComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">TeamMatcher</h1>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
            Sign Up
          </button>
        </nav>
      </header>

      <main>
        <section className="hero container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Hackathon Teammate
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Swipe right to connect, swipe left to pass. It's that simple!
          </p>
          <a
            href="#demo"
            className="inline-flex items-center bg-secondary text-secondary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:bg-secondary/90 transition-colors"
          >
            Try it out <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </section>

        <section id="demo" className="container mx-auto px-4 py-20">
          <h3 className="text-2xl md:text-4xl font-bold mb-10 text-center">
            Experience the Swipe
          </h3>
          <ScrollControlledSwipeCards />
        </section>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; 2024 TeamMatcher. All rights reserved.</p>
      </footer>
    </div>
  );
}

const ScrollControlledSwipeCards = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  });

  // Define transformations for each card based on scroll progress
  const cardTransforms = cardData.map((card, index) => {
    // Each card will start to swipe out at different scroll progress points
    const start = index * 0.1; // Adjust the multiplier as needed
    const end = start + 0.3;

    // Translate Y and X based on scroll progress
    const y = useTransform(
      scrollYProgress,
      [start, end],
      [0, -300] // Adjust values for desired movement
    );

    const x = useTransform(
      scrollYProgress,
      [start, end],
      [0, index % 2 === 0 ? -300 : 300] // Alternate directions
    );

    const opacity = useTransform(scrollYProgress, [start, end], [1, 0]);

    const rotate = useTransform(
      scrollYProgress,
      [start, end],
      [0, index % 2 === 0 ? -45 : 45] // Alternate rotation
    );

    return { y, x, opacity, rotate };
  });

  return (
    <div ref={scrollRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div className="relative w-full h-full">
          {cardData.map((card, index) => (
            <motion.div
              key={card.id}
              style={{
                y: cardTransforms[index].y,
                x: cardTransforms[index].x,
                opacity: cardTransforms[index].opacity,
                rotate: cardTransforms[index].rotate,
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Card card={card} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const Card = ({ card }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200 rounded-lg shadow-lg"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-6xl font-black uppercase text-white backdrop-blur-lg">
          {card.name}
        </p>
      </div>
    </div>
  );
};
