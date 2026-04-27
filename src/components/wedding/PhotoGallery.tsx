"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getGoogleDriveDirectLink } from "@/lib/utils";

export function PhotoGallery({ photos }: { photos?: string }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!photos) return null;

  const photoUrls = photos.split(',').map(p => getGoogleDriveDirectLink(p.trim())).filter(Boolean);

  if (photoUrls.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-white/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto space-y-12">
        <h2 className="text-4xl font-serif text-center">Galeri Foto</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {photoUrls.map((url, i) => (
            <motion.div 
              key={i} 
              className="relative aspect-[4/5] cursor-pointer overflow-hidden rounded-xl bg-slate-200 group"
              whileHover={{ scale: 0.98 }}
              onClick={() => setSelectedPhoto(url)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Gallery ${i}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            <button className="absolute top-6 right-6 text-white hover:text-gray-300 z-50" onClick={() => setSelectedPhoto(null)}>
              <X className="w-8 h-8" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedPhoto} 
              alt="Viewed image" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
