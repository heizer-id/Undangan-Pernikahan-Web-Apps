"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { weddingApi } from "@/lib/api";
import { Wedding } from "@/types";
import { useToast } from "@/hooks/useToast";
import { Plus, Edit, ExternalLink, Calendar, Users, Copy } from "lucide-react";

export default function AdminDashboard() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) fetchWeddings(email);
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/wedding/${id}`;
    navigator.clipboard.writeText(url);
    toast("Link disalin ke clipboard", "success");
  };

  if (loading && email) {
    return <div className="flex items-center justify-center h-full">Memuat dashboard...</div>;
  }

  if (!email || (weddings.length === 0 && !loading)) {
    return (
      <div className="max-w-md mx-auto mt-20 space-y-6">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Masuk ke Dashboard</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-slate-600">Masukkan email Anda untuk melihat website yang pernah Anda buat.</p>
            <form onSubmit={handleLogin} className="flex gap-2">
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@anda.com"
                className="flex-1 flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <Button type="submit">Lanjut</Button>
            </form>
          </CardContent>
        </Card>

        {email && (
          <div className="text-center mt-10 space-y-4">
            <p className="text-slate-600">Anda belum memiliki website undangan.</p>
            <Link href={`/admin/create?email=${encodeURIComponent(email)}`}>
              <Button size="lg" className="rounded-full"><Plus className="w-4 h-4 mr-2" /> Buat Website Baru</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8" suppressHydrationWarning>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800">Wedding Website Anda</h1>
          <p className="text-slate-500">Login sebagai: {email}</p>
        </div>
        <Link href={`/admin/create?email=${encodeURIComponent(email)}`}>
          <Button><Plus className="w-4 h-4 mr-2" /> Buat Baru</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weddings.map(w => (
          <Card key={w.wedding_id} className="overflow-hidden hover:shadow-md transition">
            <div 
              className="h-32 bg-slate-200 bg-cover bg-center"
              style={{ backgroundImage: `url('${w.cover_photo || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400'}')` }}
            />
            <CardContent className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-lg font-serif">{w.couple_name}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" /> <span suppressHydrationWarning>{new Date(w.date).toLocaleDateString("id-ID")}</span>
                </p>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${w.is_published === 'TRUE' || w.is_published === true ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                  {w.is_published === 'TRUE' || w.is_published === true ? 'Published' : 'Draft'}
                </span>
                <span className="text-slate-500 capitalize">{w.template_theme}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                <Link href={`/admin/edit/${w.wedding_id}`} className="col-span-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Edit className="w-3 h-3 mr-1" /> Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="col-span-1 text-xs" onClick={() => copyLink(w.wedding_id!)}>
                  <Copy className="w-3 h-3 mr-1" /> Link
                </Button>
                <Link href={`/wedding/${w.wedding_id}`} target="_blank" className="col-span-1">
                  <Button variant="outline" size="sm" className="w-full text-xs bg-slate-50">
                    <ExternalLink className="w-3 h-3 mr-1" /> View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
