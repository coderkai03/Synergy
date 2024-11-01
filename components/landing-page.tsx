"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SparkleEffect } from "./SparkleEffect"; // Import the SparkleEffect component

const cardData = [
  {
    id: 1,
    name: "Alice",
    skill: "Frontend Developer",
    url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    id: 2,
    name: "Bob",
    skill: "Backend Developer",
    // url: "/placeholder.svg?height=384&width=288",
    url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    id: 3,
    name: "Charlie",
    skill: "UI/UX Designer",
    // url: "/placeholder.svg?height=384&width=288",
    url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    id: 4,
    name: "Diana",
    skill: "Data Scientist",
    // url: "/placeholder.svg?height=384&width=288",
    url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  },
  {
    id: 5,
    name: "Ethan",
    skill: "DevOps Engineer",
    url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    // url: "/placeholder.svg?height=384&width=288",
  },
];

export function LandingPageComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Synergy</h1>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
            Sign Up
          </button>
        </nav>
      </header>

      <main>
        <section className="hero container mx-auto py-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Hackathon Teammate
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Swipe right to connect, swipe left to pass. It's that simple!
          </p>
          <a
            href=""
            className="inline-flex items-center bg-secondary text-secondary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:bg-secondary/90 transition-colors"
          >
            Get on the list! <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </section>

        <section id="demo" className="container mx-auto py-20">
          <ScrollControlledSwipeCards />
        </section>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; 2024 Synergy. All rights reserved.</p>
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
    const start = index * 0.15;
    const end = start + 0.2;

    const y = useTransform(scrollYProgress, [start, end], [0, -300]);
    const x = useTransform(
      scrollYProgress,
      [start, end],
      [0, index % 2 === 0 ? -300 : 300]
    );
    const opacity = useTransform(
      scrollYProgress,
      [(start + end) / 2, end],
      [1, 0]
    );
    const rotate = useTransform(
      scrollYProgress,
      [start, end],
      [0, index % 2 === 0 ? -45 : 45]
    );

    return { y, x, opacity, rotate };
  });

  return (
    <div ref={scrollRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div className="relative w-full h-full flex items-center justify-center">
          {cardData.map((card, index) => (
            <CardWithEffect
              key={card.id}
              card={card}
              transforms={cardTransforms[index]}
              zIndex={50 - index * 10}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// New component to handle individual card with special effect
const CardWithEffect = ({
  card,
  transforms,
  zIndex,
}: {
  card: (typeof cardData)[0];
  transforms: {
    y: any;
    x: any;
    opacity: any;
    rotate: any;
  };
  zIndex: number;
}) => {
  const [showEffect, setShowEffect] = useState(false);

  // Comment out the useSpring
  // const springOpacity = useSpring(transforms.opacity, {
  //   stiffness: 100,
  //   damping: 30,
  // });

  useEffect(() => {
    // Use transforms.opacity directly instead of springOpacity
    const unsubscribe = transforms.opacity.onChange((latest) => {
      if (latest < 0.1 && !showEffect) {
        setShowEffect(true);
      } else if (latest >= 0.1 && showEffect) {
        setShowEffect(false);
      }
    });

    return () => unsubscribe();
  }, [transforms.opacity, showEffect]);

  return (
    <motion.div
      style={{
        y: transforms.y,
        x: transforms.x,
        opacity: transforms.opacity,
        rotate: transforms.rotate,
      }}
      className={`absolute z-${zIndex}`}
    >
      <Card card={card} />
      {showEffect && <SparkleEffect />}
    </motion.div>
  );
};

const Card = ({ card }) => {
  return (
    <div className="relative rounded-2xl bg-gray-800 px-8 py-10">
      <img
        alt=""
        src={card.url}
        className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
      />
      <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-white">
        {card.name}
      </h3>
      <p className="text-sm leading-6 text-gray-400">{card.skill}</p>
      <ul role="list" className="mt-6 flex justify-center gap-x-6">
        <li>
          <a href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">X</span>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
            </svg>
          </a>
        </li>
        <li>
          <a href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">LinkedIn</span>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                clipRule="evenodd"
                fillRule="evenodd"
              />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  );
};
