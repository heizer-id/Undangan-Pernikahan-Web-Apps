"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  coupleName: string;
  theme: string;
  date: string;
  coverPhoto?: string;
}

export function HeroSection({ coupleName, theme, date, coverPhoto }: HeroSectionProps) {
  const isModern = theme === "modern";
  const defaultBg = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000";
  const bgImage = coverPhoto && coverPhoto.startsWith('http') ? coverPhoto : defaultBg;

  const names = coupleName.split('&').map(n => n.trim());
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-black/40 z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-20 text-center text-white px-4 max-w-4xl"
      >
        <span className="uppercase tracking-[0.3em] text-sm md:text-base font-light mb-6 block">
          The Wedding Of
        </span>
        
        {isModern ? (
          <h1 className="text-6xl md:text-8xl font-sans font-bold tracking-tighter mb-4">
            {names[0]} <span className="text-pink-400">&amp;</span> {names[1] || names[0]}
          </h1>
        ) : (
          <h1 className="text-6xl md:text-8xl font-serif italic mb-4">
            {names[0]} &amp; {names[1] || names[0]}
          </h1>
        )}

        <div className="w-16 h-[1px] bg-white/60 mx-auto my-8" />
        
        <p className="text-xl md:text-2xl font-light tracking-wide" suppressHydrationWarning>
          {formattedDate}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-white/80">
          <span className="text-sm tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
}
