"use client";

import { useState, useEffect, useRef } from "react";
import { MailOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CoverPageProps {
  brideName: string;
  groomName: string;
  date: string;
  musicUrl?: string;
  bgClassName?: string;
}

export function CoverPage({ brideName, groomName, date, musicUrl, bgClassName }: CoverPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio error:', e));
    }
  };

  return (
    <>
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}
      <AnimatePresence>
      {!isOpen && (
        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${bgClassName || 'bg-slate-900 text-white'}`}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center space-y-8 max-w-[80vw] sm:max-w-md mx-auto p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
            <p className="text-sm tracking-widest uppercase opacity-80">The Wedding Of</p>
            <h1 className="text-5xl font-serif">
              {brideName || "Bride"} 
              <br/><span className="text-3xl my-2 inline-block">&</span><br/> 
              {groomName || "Groom"}
            </h1>
            <p className="text-sm font-medium tracking-widest opacity-90" suppressHydrationWarning>
              {new Date(date).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <div className="pt-8">
              <button 
                onClick={handleOpen}
                className="flex items-center justify-center gap-2 w-full py-4 px-8 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors shadow-lg"
              >
                <MailOpen className="w-5 h-5" /> Buka Undangan
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
