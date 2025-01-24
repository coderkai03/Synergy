"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadFeedback } from "@/hooks/useCollection";
import { useUser } from "@clerk/nextjs";

export function Feedback() {
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    uploadFeedback(feedback, user?.id);
    setFeedback("");
    setIsOpen(false);
  };

  // Close feedback when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={handleClickOutside}
        >
          <Card className="absolute bottom-20 left-4 w-80 bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Thoughts? Let us know!</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full h-32 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-gray-500"
                placeholder="Enter feedback..."
              />
              <Button 
                onClick={handleSubmit}
                disabled={!feedback}
                className="mt-4 bg-white text-black hover:bg-zinc-200"
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white hover:bg-gray-700 border border-gray-600 focus:outline-none focus:border-gray-500"
      >
        Feedback
      </Button>
    </div>
  );
}
