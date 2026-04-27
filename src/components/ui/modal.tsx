"use client";

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-lg relative p-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
