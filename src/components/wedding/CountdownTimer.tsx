"use client";

import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";

interface CountdownProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      
      const days = differenceInDays(target, now);
      const hours = differenceInHours(target, now) % 24;
      const minutes = differenceInMinutes(target, now) % 60;
      const seconds = differenceInSeconds(target, now) % 60;

      if (target.getTime() <= now.getTime()) {
        clearInterval(interval);
      } else {
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <div className="flex justify-center gap-4 text-center mt-8">
      {[
        { label: "Hari", value: timeLeft.days },
        { label: "Jam", value: timeLeft.hours },
        { label: "Menit", value: timeLeft.minutes },
        { label: "Detik", value: timeLeft.seconds }
      ].map((item, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          key={item.label}
          className="flex flex-col items-center p-3 bg-white/40 backdrop-blur-md rounded-xl w-20 shadow-sm border border-white/50"
        >
          <span className="text-2xl font-serif font-bold text-slate-800">{item.value}</span>
          <span className="text-xs uppercase tracking-wider text-slate-600 mt-1">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
