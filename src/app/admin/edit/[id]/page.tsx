"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { weddingSchema, WeddingFormValues } from "@/lib/validations";
import { weddingApi, guestApi, wishApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import { ArrowLeft, Users, MessageSquare } from "lucide-react";
import { Wedding, Guest, Wish } from "@/types";

export default function EditWeddingPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingSchema),
  });

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [wRes, gRes, wishRes] = await Promise.all([
          weddingApi.getWedding(unwrappedParams.id),
          guestApi.getGuests(unwrappedParams.id),
          wishApi.getWishes(unwrappedParams.id)
        ]);

        if (!isMounted) return;

        if (wRes.success && wRes.data) {
          setWedding(wRes.data);
          reset({
            couple_name: wRes.data.couple_name,
            date: new Date(wRes.data.date).toISOString().slice(0, 16),
            venue: wRes.data.venue,
            story: wRes.data.story,
            cover_photo: wRes.data.cover_photo,
            template_theme: wRes.data.template_theme as "classic" | "modern",
            is_published: wRes.data.is_published === 'TRUE' || wRes.data.is_published === true
          });
        }
        if (gRes.success) setGuests(gRes.data);
        if (wishRes.success) setWishes(wishRes.data);

      } catch (err) {
        toast("Gagal memuat data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; }
  }, [unwrappedParams.id, reset, toast]);

  const onSubmit = async (data: WeddingFormValues) => {
    try {
      setSaving(true);
      const res = await weddingApi.updateWedding({
        wedding_id: unwrappedParams.id,
        ...data,
      });

      if (res.success) {
        toast("Perubahan berhasil disimpan!", "success");
      } else {
        toast(res.message || "Gagal menyimpan", "error");
      }
    } catch(err) {
      toast("Error koneksi", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;
  if (!wedding) return <div className="p-8 text-center text-red-500">Data tidak ditemukan.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Edit Undangan</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama Pasangan</Label>
                  <Input {...register("couple_name")} />
                  {errors.couple_name && <p className="text-red-500 text-xs">{errors.couple_name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Tanggal Pernikahan</Label>
                  <Input type="datetime-local" {...register("date")} />
                </div>

                <div className="space-y-2">
                  <Label>Lokasi / Venue</Label>
                  <textarea {...register("venue")} className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900" />
                </div>

                <div className="space-y-2">
                  <Label>Tema Desain</Label>
                  <select {...register("template_theme")} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900">
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>URL Foto Cover</Label>
                  <Input {...register("cover_photo")} />
                </div>

                <div className="space-y-2">
                  <Label>Kisah Cinta</Label>
                  <textarea {...register("story")} className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm" />
                </div>

                <div className="flex items-center gap-2 mt-4 pb-4">
                  <input type="checkbox" id="is_published" {...register("is_published")} className="rounded border-slate-300 w-4 h-4" />
                  <Label htmlFor="is_published">Status Publish</Label>
                </div>

                <Button isLoading={saving} type="submit" className="w-full">
                  Simpan Perubahan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Responses */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5"/> Daftar Tamu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold">{guests.length} RSVP</div>
                <div className="text-xs text-slate-500">
                  {guests.filter(g => g.attendance_status === 'confirm').length} Hadir
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {guests.map((g, i) => (
                  <div key={i} className="text-sm p-3 border border-slate-100 rounded-md bg-slate-50">
                    <div className="font-bold flex justify-between">
                      {g.name}
                      <span className={`text-[10px] uppercase px-1 py-0.5 rounded ${g.attendance_status === 'confirm' ? 'bg-green-100 text-green-700' : g.attendance_status === 'decline' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>
                        {g.attendance_status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 drop-shadow-none">📞 {g.phone || '-'} | 👥 {g.number_of_guests} org</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5"/> Ucapan</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {wishes.map((w, i) => (
                  <div key={i} className="text-sm border-b border-slate-100 pb-2">
                    <span className="font-bold block">{w.guest_name}</span>
                    <span className="text-slate-600 block line-clamp-3">{w.message}</span>
                  </div>
                ))}
                {wishes.length === 0 && <p className="text-sm text-slate-500">Belum ada ucapan</p>}
               </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
