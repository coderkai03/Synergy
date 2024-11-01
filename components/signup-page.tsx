"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "react-hot-toast";
import { Users, Rocket, Zap, LucideIcon } from "lucide-react";

// FeatureCard Props Type
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <Tilt tiltEnable={true} className="w-full">
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      {Icon && <Icon className="w-12 h-12 text-blue-500 mb-4" />}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </Tilt>
);

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("entry.1851250729", name);
    formData.append("entry.1437308681", email);

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSe5x-nCJkXJsPnwn77qpDdK9fCI0-5D2lI_yU5Sk7qVMKLnpw/formResponse",
        {
          method: "POST",
          body: formData,
          mode: "no-cors",
        }
      );

      setName("");
      setEmail("");
      toast.success("Thank you for joining the waiting list!");
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <header className="text-center mb-12">
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-blue-600 mb-4"
          >
            Welcome to Synergy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl text-gray-600"
          >
            Find your perfect hackathon partners and create amazing projects
            together.
          </motion.p>
        </header>

        <div className="flex justify-center mb-12">
          <div
            id="signup-form"
            className="bg-white shadow-lg rounded-lg p-8 space-y-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-semibold text-center mb-4">
              Join the Waiting List
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Joining..." : "Join the Waiting List"}
              </Button>
            </form>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-center mb-8">
            Why Choose Synergy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Find Your Dream Team"
              description="Connect with like-minded developers, designers, and innovators to form the perfect hackathon team."
            />
            <FeatureCard
              icon={Rocket}
              title="Boost Your Projects"
              description="Leverage diverse skills and perspectives to take your hackathon projects to new heights."
            />
            <FeatureCard
              icon={Zap}
              title="Accelerate Your Growth"
              description="Learn from peers, gain new skills, and expand your network in the tech community."
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
