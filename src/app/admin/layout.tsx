"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, LayoutDashboard, Lock } from "lucide-react";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [inputPassword, setInputPassword] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    setIsAuthenticated(auth === "true");
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    if (inputPassword === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      toast("Login berhasil", "success");
    } else {
      toast("Password salah!", "error");
    }
  };

  if (isAuthenticated === null) return null; // Avoid flicker

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Lock className="text-slate-400 w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-800">Admin Area</h2>
            <p className="text-slate-500 text-sm italic">Silakan masukkan password untuk melanjutkan.</p>
          </div>
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardContent className="pt-8 space-y-4">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input 
                  type="password" 
                  required 
                  autoFocus
                  value={inputPassword}
                  onChange={e => setInputPassword(e.target.value)}
                  placeholder="Password Admin"
                  className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition"
                />
                <Button type="submit" className="w-full h-12 rounded-xl text-md font-medium shadow-lg shadow-slate-200">
                  Masuk Sekarang
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" suppressHydrationWarning>
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2 text-slate-800 font-bold font-serif text-xl">
            <Heart className="text-pink-500 w-6 h-6" />
            Eternity
          </Link>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium transition-all shadow-md shadow-slate-200">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
        </nav>
        <div className="p-6 border-t border-slate-100 mt-auto">
           <button 
             onClick={() => { localStorage.removeItem("admin_auth"); window.location.reload(); }}
             className="text-xs text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest font-bold"
           >
             Keluar / Logout
           </button>
        </div>
        <div className="px-6 pb-6 text-[10px] text-slate-400 uppercase tracking-tighter" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} Eternity Builder 1.0
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 md:hidden">
          <Link href="/" className="flex items-center gap-2 text-slate-800 font-bold font-serif text-xl">
            <Heart className="text-pink-500 w-6 h-6" />
            Eternity
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
