// "use client";

// import React, { useRef } from "react";
// import { motion, useTransform, useScroll } from "framer-motion";
// import { ArrowRight } from "lucide-react";
// // import { CardWithEffect } from "./CardWithEffect"; // Ensure CardWithEffect is correctly imported

// const cardData = [
//   {
//     id: 1,
//     name: "Alice",
//     skill: "Frontend Developer",
//     url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
//   },
//   {
//     id: 2,
//     name: "Bob",
//     skill: "Backend Developer",
//     url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
//   },
//   {
//     id: 3,
//     name: "Charlie",
//     skill: "UI/UX Designer",
//     url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
//   },
//   {
//     id: 4,
//     name: "Diana",
//     skill: "Data Scientist",
//     url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
//   },
//   {
//     id: 5,
//     name: "Ethan",
//     skill: "DevOps Engineer",
//     url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
//   },
// ];

// export function LandingPageComponent() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
//       <header className="container mx-auto px-4 py-6">
//         <nav className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-primary">Synergy</h1>
//           <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
//             Sign Up
//           </button>
//         </nav>
//       </header>

//       <main>
//         <section className="hero container mx-auto py-20 text-center">
//           <h2 className="text-4xl md:text-6xl font-bold mb-6">
//             Find Your Perfect Hackathon Teammate
//           </h2>
//           <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
//             Swipe right to connect, swipe left to pass. It's that simple!
//           </p>
//           <a
//             href="#demo" // Updated href to link to the demo section
//             className="inline-flex items-center bg-secondary text-secondary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:bg-secondary/90 transition-colors"
//           >
//             Get on the list! <ArrowRight className="ml-2 h-5 w-5" />
//           </a>
//         </section>

//         <section id="demo" className="container mx-auto py-20">
//           <ScrollControlledSwipeCards />
//         </section>
//       </main>

//       <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
//         <p>&copy; 2024 Synergy. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// const ScrollControlledSwipeCards = () => {
//   const scrollRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: scrollRef,
//     offset: ["start start", "end start"],
//   });

//   // Define transformations for each card based on scroll progress
//   const cardTransforms = cardData.map((card, index) => {
//     const start = index * 0.15;
//     const end = start + 0.2;

//     const y = useTransform(scrollYProgress, [start, end], [0, -300]);
//     const x = useTransform(
//       scrollYProgress,
//       [start, end],
//       [0, index % 2 === 0 ? -300 : 300]
//     );
//     const opacity = useTransform(
//       scrollYProgress,
//       [(start + end) / 2, end],
//       [1, 0]
//     );
//     const rotate = useTransform(
//       scrollYProgress,
//       [start, end],
//       [0, index % 2 === 0 ? -45 : 45]
//     );

//     return { y, x, opacity, rotate };
//   });

//   return (
//     <div ref={scrollRef} className="relative h-[300vh]">
//       <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
//         <motion.div className="relative w-full h-full flex items-center justify-center">
//           {cardData.map((card, index) => (
//             <CardWithEffect
//               key={card.id}
//               card={card}
//               transforms={cardTransforms[index]}
//               zIndex={50 - index * 10}
//             />
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// };
