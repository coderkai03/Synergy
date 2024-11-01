import React from "react";
import { motion } from "framer-motion";

const sparkleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: [1, 1.5, 1],
    // transition: { duration: 0.6 },
  },
};

export const SparkleEffect = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      variants={sparkleVariants}
      //   initial="hidden"
      //   animate="visible"
    >
      <svg
        className="w-16 h-16 text-yellow-300"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l2.39 7.26L22 9.27l-6 5.91L18.78 22 12 18.27 5.22 22 6 15.18 0 9.27l7.61-0.01L12 2z" />
      </svg>
    </motion.div>
  );
};
