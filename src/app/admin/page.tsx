"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { weddingApi } from "@/lib/api";
import { Wedding } from "@/types";
import { useToast } from "@/hooks/useToast";
import { Plus, Edit, ExternalLink, Calendar, Users, Copy, Link as LinkIcon } from "lucide-react";

export default function AdminDashboard() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
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

  const fetchWeddings = async (userEmail: string) => {
    try {
      setLoading(true);
      const res = await weddingApi.getAllWeddings(userEmail);
      if (res.success) {
        setWeddings(res.data || []);
      } else {
        toast("Gagal memuat data", "error");
      }
    } catch (err: any) {
      toast("Error memuat data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setEmail("");
    setWeddings([]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem("admin_email", email);
      fetchWeddings(email);
    }
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/wedding/${id}`;
    navigator.clipboard.writeText(url);
    toast("Link disalin ke clipboard", "success");
  };

  if (loading && email && isAuthenticated) {
    return <div className="flex items-center justify-center min-h-[400px]">Memuat dashboard...</div>;
  }

  // Phase 1: Password Check
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 space-y-6">
        <h2 className="text-2xl font-serif font-bold text-slate-800 text-center">Dashboard Creator</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-xs text-slate-500 text-center uppercase tracking-widest">Akses Terbatas</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input 
                type="password" 
                required 
                value={inputPassword}
                onChange={e => setInputPassword(e.target.value)}
                placeholder="Masukkan Password Admin"
                className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition"
              />
              <Button type="submit" className="w-full h-12 rounded-xl">Buka Dashboard</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Phase 2: Email Search
  if (!email || (weddings.length === 0 && !loading)) {
    return (
      <div className="max-w-md mx-auto mt-20 space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-serif font-bold text-slate-800">Cari Undangan</h2>
          <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Logout</button>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-slate-600">Masukkan email Anda untuk mengelola undangan.</p>
            <form onSubmit={handleLogin} className="flex gap-2">
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@anda.com"
                className="flex-1 h-10 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-slate-900 outline-none"
              />
              <Button type="submit">Cari</Button>
            </form>
          </CardContent>
        </Card>

        {email && (
          <div className="text-center mt-10 space-y-4">
            <p className="text-slate-600 font-medium">Belum ada undangan untuk email ini.</p>
            <div className="p-6 bg-slate-100 rounded-2xl border border-dashed border-slate-300">
              <Link href={`/admin/create?email=${encodeURIComponent(email)}`}>
                <Button size="lg" className="rounded-full shadow-lg"><Plus className="w-4 h-4 mr-2" /> Buat Undangan Pertama</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Phase 3: Dashboard List
  return (
    <div className="max-w-5xl mx-auto space-y-8" suppressHydrationWarning>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800">Wedding Dashboard</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-slate-500 text-sm">Owner: {email}</p>
            <button onClick={() => setEmail("")} className="text-xs text-blue-500 hover:underline">Ganti Email</button>
            <span className="text-slate-300">|</span>
            <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Logout</button>
          </div>
        </div>
        <Link href={`/admin/create?email=${encodeURIComponent(email)}`}>
          <Button className="rounded-xl"><Plus className="w-4 h-4 mr-2" /> Buat Baru</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weddings.map(w => (
          <Card key={w.wedding_id} className="overflow-hidden hover:shadow-xl transition-shadow border-none shadow-sm bg-white/80 backdrop-blur">
            <div 
              className="h-40 bg-slate-200 bg-cover bg-center"
              style={{ backgroundImage: `url('${w.cover_photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400'}')` }}
            />
            <CardContent className="p-5 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl font-serif text-slate-800">{w.couple_name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> <span suppressHydrationWarning>{new Date(w.date).toLocaleDateString("id-ID")}</span>
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${w.is_published === 'TRUE' || w.is_published === true ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {w.is_published === 'TRUE' || w.is_published === true ? 'Live' : 'Draft'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href={`/admin/edit/${w.wedding_id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs rounded-lg border-slate-200">
                    <Edit className="w-3 h-3 mr-2" /> Manage
                  </Button>
                </Link>
                <Link href={`/wedding/${w.wedding_id}`} target="_blank" className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs rounded-lg bg-slate-50 border-slate-200">
                    <ExternalLink className="w-3 h-3 mr-2" /> Preview
                  </Button>
                </Link>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-[10px] text-slate-400 h-8 hover:bg-slate-50"
                onClick={() => copyLink(w.wedding_id!)}
              >
                <LinkIcon className="w-3 h-3 mr-2" /> SALIN LINK UNDANGAN
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
