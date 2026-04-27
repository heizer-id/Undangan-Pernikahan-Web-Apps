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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMasterWeddings();
  }, []);

  const fetchMasterWeddings = async () => {
    try {
      setLoading(true);
      const res = await weddingApi.getAllWeddingsMaster();
      if (res.success) {
        setWeddings(res.data || []);
      } else {
        toast("Gagal memuat data master", "error");
      }
    } catch (err: any) {
      toast("Error memuat data master", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/wedding/${id}`;
    navigator.clipboard.writeText(url);
    toast("Link disalin ke clipboard", "success");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Memuat data master...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8" suppressHydrationWarning>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-800">Master Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Melihat semua undangan dari seluruh user</p>
        </div>
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
                <Link href={`/dashboard/edit/${w.wedding_id}`} className="w-full">
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
