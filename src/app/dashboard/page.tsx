"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { weddingApi, authApi } from "@/lib/api";
import { Wedding } from "@/types";
import { useToast } from "@/hooks/useToast";
import { Plus, Edit, ExternalLink, Calendar, Users, Copy, Link as LinkIcon, LogOut, Layout } from "lucide-react";

export default function UserDashboard() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedEmail = localStorage.getItem("user_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      fetchWeddings(savedEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWeddings = async (userEmail: string) => {
    try {
      setLoading(true);
      const res = await weddingApi.getAllWeddings(userEmail);
      if (res.success) {
        setWeddings(res.data || []);
      }
    } catch (err) {
      toast("Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success) {
        localStorage.setItem("user_email", email);
        setIsLoggedIn(true);
        fetchWeddings(email);
        toast("Selamat datang kembali!", "success");
      } else {
        toast(res.message, "error");
      }
    } catch (err) {
      toast("Terjadi kesalahan login", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register(email, password);
      if (res.success) {
        localStorage.setItem("user_email", email);
        setIsLoggedIn(true);
        fetchWeddings(email);
        toast("Pendaftaran berhasil!", "success");
      } else {
        toast(res.message, "error");
      }
    } catch (err) {
      toast("Gagal mendaftar", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setWeddings([]);
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/wedding/${id}`;
    navigator.clipboard.writeText(url);
    toast("Link disalin!", "success");
  };

  if (loading && !isLoggedIn) {
     return <div className="flex items-center justify-center min-h-screen">Memuat halaman...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
             <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 scale-110">
                <Layout className="text-white w-6 h-6" />
             </div>
             <h1 className="text-3xl font-serif font-bold text-slate-800">Wedding Dashboard</h1>
             <p className="text-slate-500 text-sm">Kelola undangan pernikahan Anda dengan mudah.</p>
          </div>

          <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="flex border-b border-slate-100">
               <button 
                onClick={() => setIsRegistering(false)} 
                className={`flex-1 py-4 text-sm font-medium transition ${!isRegistering ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Masuk
               </button>
               <button 
                onClick={() => setIsRegistering(true)} 
                className={`flex-1 py-4 text-sm font-medium transition ${isRegistering ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Daftar
               </button>
            </div>
            <CardContent className="p-8">
              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition"
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl text-md font-medium mt-4 shadow-lg shadow-slate-200" disabled={loading}>
                  {loading ? 'Proses...' : (isRegistering ? 'Buat Akun' : 'Masuk Dashboard')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* User Header */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
           <Link href="/dashboard" className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layout className="text-white w-4 h-4" />
              </div>
              Dashboard
           </Link>
           <div className="flex items-center gap-6">
              <span className="hidden md:block text-xs text-slate-400 font-medium">{email}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 text-sm font-bold hover:opacity-80 transition">
                <LogOut className="w-4 h-4" /> 
                <span className="hidden sm:inline">Logout</span>
              </button>
           </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900">Selamat Datang</h1>
            <p className="text-slate-500 mt-2">Anda memiliki {weddings.length} undangan aktif.</p>
          </div>
          <Link href={`/admin/create?email=${encodeURIComponent(email)}`}>
            <Button size="lg" className="rounded-2xl h-14 px-8 shadow-xl shadow-slate-200">
               <Plus className="w-5 h-5 mr-2" /> Buat Undangan Baru
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">Memuat data...</div>
        ) : weddings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Plus className="w-10 h-10" />
             </div>
             <p className="text-slate-500">Anda belum membuat undangan apapun.</p>
             <Link href={`/admin/create?email=${encodeURIComponent(email)}`}>
                <Button variant="outline" className="rounded-full">Mulai Sekarang</Button>
             </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddings.map(w => (
              <Card key={w.wedding_id} className="overflow-hidden border-none shadow-lg shadow-slate-200/60 group hover:-translate-y-1 transition-transform">
                <div 
                  className="h-48 bg-slate-200 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${w.cover_photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600'}')` }}
                >
                   <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${w.is_published === 'TRUE' || w.is_published === true ? 'bg-green-500 text-white' : 'bg-white text-slate-800'}`}>
                        {w.is_published === 'TRUE' || w.is_published === true ? 'Status: Live' : 'Status: Draft'}
                      </span>
                   </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-2xl font-serif text-slate-800 line-clamp-1">{w.couple_name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                       <p className="text-xs text-slate-400 flex items-center gap-1.5 uppercase font-medium">
                        <Calendar className="w-3.5 h-3.5" /> <span suppressHydrationWarning>{new Date(w.date).toLocaleDateString("id-ID")}</span>
                      </p>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{w.template_theme}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/admin/edit/${w.wedding_id}`}>
                      <Button className="w-full rounded-xl bg-slate-900 border-none h-11">
                        <Edit className="w-4 h-4 mr-2" /> Kelola
                      </Button>
                    </Link>
                    <Link href={`/wedding/${w.wedding_id}`} target="_blank">
                      <Button variant="outline" className="w-full rounded-xl border-slate-200 h-11 text-slate-600">
                        <ExternalLink className="w-4 h-4 mr-2" /> Lihat
                      </Button>
                    </Link>
                  </div>
                  
                  <button 
                    className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-900 transition flex items-center justify-center gap-2 pt-2 border-t border-slate-50"
                    onClick={() => copyLink(w.wedding_id!)}
                  >
                    <LinkIcon className="w-3 h-3" /> SALIN LINK UNDANGAN
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
