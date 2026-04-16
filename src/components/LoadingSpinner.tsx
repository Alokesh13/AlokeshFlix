import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated Logo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-16 h-16 rounded-full border-2 border-[#c9a227]/20 border-t-[#c9a227] border-r-[#e8c84a]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-[#c9a227]" />
        </div>
      </motion.div>

      {/* Logo text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <span className="font-black text-2xl">
          <span className="gold-text">Alokesh</span>
          <span className="text-white">Flix</span>
        </span>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#c9a227]"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#080810] flex items-center justify-center z-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a227]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  );
};

export default LoadingSpinner;
