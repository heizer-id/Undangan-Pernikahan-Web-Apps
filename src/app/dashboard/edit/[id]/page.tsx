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
import { ArrowLeft, Users, MessageSquare, Layout } from "lucide-react";
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
            template_theme: wRes.data.template_theme as any,
            is_published: wRes.data.is_published === 'TRUE' || wRes.data.is_published === true,
            bride_name: wRes.data.bride_name || "",
            bride_parents: wRes.data.bride_parents || "",
            bride_ig: wRes.data.bride_ig || "",
            groom_name: wRes.data.groom_name || "",
            groom_parents: wRes.data.groom_parents || "",
            groom_ig: wRes.data.groom_ig || "",
            music_url: wRes.data.music_url || "",
            gallery_photos: wRes.data.gallery_photos || "",
            digital_gifts: wRes.data.digital_gifts || "",
            bride_photo: wRes.data.bride_photo || "",
            groom_photo: wRes.data.groom_photo || ""
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
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-30 mb-8">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
           <Link href="/dashboard" className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layout className="text-white w-4 h-4" />
              </div>
              Dashboard
           </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Editor Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-2xl font-serif">Update Undangan: {wedding.couple_name}</CardTitle>
                <p className="text-slate-400 text-sm">Sesuaikan detail undangan Anda di sini.</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-500">Nama Pasangan (Judul Utama)</Label>
                    <Input {...register("couple_name")} className="rounded-xl h-11" />
                    {errors.couple_name && <p className="text-red-500 text-xs">{errors.couple_name.message}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                      <h3 className="font-bold border-b border-emerald-200 pb-2 uppercase text-[10px] tracking-widest text-emerald-600">Mempelai Wanita</h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold">Nama Lengkap</Label>
                          <Input {...register("bride_name")} className="rounded-lg h-9 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold">Orang Tua</Label>
                          <Input {...register("bride_parents")} className="rounded-lg h-9 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold">Instagram</Label>
                          <Input {...register("bride_ig")} className="rounded-lg h-9 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold">URL Foto (Profil)</Label>
                          <Input {...register("bride_photo")} className="rounded-lg h-9 text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                      <h3 className="font-bold border-b border-blue-200 pb-2 uppercase text-[10px] tracking-widest text-blue-600">Mempelai Pria</h3>
                       <div className="space-y-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold">Nama Lengkap</Label>
                          <Input {...register("groom_name")} className="rounded-lg h-9 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold">Orang Tua</Label>
                          <Input {...register("groom_parents")} className="rounded-lg h-9 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold">Instagram</Label>
                          <Input {...register("groom_ig")} className="rounded-lg h-9 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold">URL Foto (Profil)</Label>
                          <Input {...register("groom_photo")} className="rounded-lg h-9 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-500">Tanggal Pernikahan</Label>
                      <Input type="datetime-local" {...register("date")} className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-500">Tema Desain</Label>
                      <select {...register("template_theme")} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 outline-none">
                        <option value="classic">Classic</option>
                        <option value="modern">Modern</option>
                        <option value="botanical">Botanical</option>
                        <option value="elegant">Elegant</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">Lokasi / Venue</Label>
                    <textarea {...register("venue")} className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">URL Foto Cover</Label>
                    <Input {...register("cover_photo")} placeholder="Link Unsplash atau Google Drive" className="rounded-xl h-11" />
                    <p className="text-[10px] text-slate-500 italic">Mendukung link Google Drive.</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">Kisah Cinta</Label>
                    <textarea {...register("story")} className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-500">URL Musik</Label>
                      <Input {...register("music_url")} className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-2 flex flex-col justify-center">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl mt-4">
                        <input type="checkbox" id="is_published" {...register("is_published")} className="rounded border-slate-300 w-5 h-5 accent-slate-900" />
                        <Label htmlFor="is_published" className="font-bold cursor-pointer">Status Live</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">Galeri Foto (Pisahkan koma)</Label>
                    <textarea {...register("gallery_photos")} className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="URL1, URL2" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-500">Rekening Amplop Digital</Label>
                    <textarea {...register("digital_gifts")} className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Bank - Rekening - Nama" />
                  </div>

                  <Button type="submit" size="lg" className="w-full h-14 rounded-2xl bg-slate-900 shadow-xl shadow-slate-200" disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Responses */}
          <div className="space-y-8">
            <Card className="border-none shadow-lg shadow-slate-200/50 rounded-3xl">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800"><Users className="w-5 h-5 text-blue-500"/> Daftar Tamu (RSVP)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-bold text-slate-900">{guests.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Total</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-bold text-emerald-600">{guests.filter(g => g.attendance_status === 'confirm').length}</div>
                    <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest mt-1">Hadir</div>
                  </div>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {guests.map((g, i) => (
                    <div key={i} className="text-sm p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                      <div className="font-bold flex justify-between items-center">
                        <span className="text-slate-800">{g.name}</span>
                        <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${g.attendance_status === 'confirm' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {g.attendance_status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex gap-2">
                        <span>📞 {g.phone || '-'}</span>
                        <span>• 👥 {g.number_of_guests} orang</span>
                      </div>
                    </div>
                  ))}
                  {guests.length === 0 && <p className="text-center text-slate-400 text-sm py-10">Belum ada RSVP</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg shadow-slate-200/50 rounded-3xl">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800"><MessageSquare className="w-5 h-5 text-amber-500"/> Ucapan & Doa</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {wishes.map((w, i) => (
                    <div key={i} className="text-sm border-b border-slate-50 pb-4">
                      <span className="font-bold block text-slate-800">{w.guest_name}</span>
                      <p className="text-slate-500 mt-1 text-xs leading-relaxed italic">"{w.message}"</p>
                    </div>
                  ))}
                  {wishes.length === 0 && <p className="text-center text-slate-400 text-sm py-10">Belum ada ucapan</p>}
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
