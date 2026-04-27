"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { weddingSchema, WeddingFormValues } from "@/lib/validations";
import { weddingApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import { ArrowLeft, Layout } from "lucide-react";

import { Suspense } from "react";

function CreateWeddingForm() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params?.get("email") || "";
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<WeddingFormValues>({
    resolver: zodResolver(weddingSchema),
    defaultValues: {
      template_theme: "classic",
      is_published: false
    }
  });

  const onSubmit = async (data: WeddingFormValues) => {
    try {
      setLoading(true);
      const res = await weddingApi.createWedding({
        ...data,
        user_email: email,
      });

      if (res.success) {
        toast("Website undangan berhasil dibuat!", "success");
        router.push("/dashboard");
      } else {
        toast(res.message || "Terjadi kesalahan", "error");
      }
    } catch(err) {
      toast("Koneksi gagal", "error");
    } finally {
      setLoading(false);
    }
  };

  if(!email) return <div className="p-8 text-center text-red-500">Akses ditolak. Email tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
       <nav className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
           <Link href="/dashboard" className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Layout className="text-white w-4 h-4" />
              </div>
              Dashboard
           </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6 pb-20">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-8">
            <CardTitle className="text-3xl font-serif">Buat Undangan Baru</CardTitle>
            <p className="text-slate-400 text-sm mt-1">Lengkapi data pernikahan Anda di bawah ini.</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold border-b pb-2 uppercase text-[10px] tracking-widest text-slate-400">Informasi Dasar</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-600">Nama Pasangan</Label>
                    <Input {...register("couple_name")} placeholder="Romeo & Juliet" className="rounded-xl h-11" />
                    {errors.couple_name && <p className="text-red-500 text-xs">{errors.couple_name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-600">Tanggal Pernikahan</Label>
                    <Input type="datetime-local" {...register("date")} className="rounded-xl h-11" />
                    {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-600">Lokasi / Venue</Label>
                  <textarea 
                    {...register("venue")} 
                    className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                    placeholder="Gedung Pernikahan..."
                  />
                  {errors.venue && <p className="text-red-500 text-xs">{errors.venue.message}</p>}
                </div>
              </div>

              {/* Mempelai Wanita */}
              <div className="space-y-4 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                <h3 className="font-bold border-b border-emerald-200 pb-2 uppercase text-[10px] tracking-widest text-emerald-600">Detail Mempelai Wanita</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-emerald-900">Nama Lengkap / Panggilan</Label>
                    <Input {...register("bride_name")} placeholder="Putri Juliet" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-emerald-900">Nama Orang Tua</Label>
                    <Input {...register("bride_parents")} placeholder="Putri dari Bapak A & Ibu B" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-emerald-900">Username Instagram</Label>
                    <Input {...register("bride_ig")} placeholder="@juliet_capulet" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-emerald-900">URL Foto (Profil)</Label>
                    <Input {...register("bride_photo")} placeholder="Link Foto Profil Mempelai Wanita" className="rounded-xl h-11" />
                  </div>
                </div>
              </div>

              {/* Mempelai Pria */}
              <div className="space-y-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold border-b border-blue-200 pb-2 uppercase text-[10px] tracking-widest text-blue-600">Detail Mempelai Pria</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-blue-900">Nama Lengkap / Panggilan</Label>
                    <Input {...register("groom_name")} placeholder="Pangeran Romeo" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-900">Nama Orang Tua</Label>
                    <Input {...register("groom_parents")} placeholder="Putra dari Bapak C & Ibu D" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-900">Username Instagram</Label>
                    <Input {...register("groom_ig")} placeholder="@romeo_montague" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-900">URL Foto (Profil)</Label>
                    <Input {...register("groom_photo")} placeholder="Link Foto Profil Mempelai Pria" className="rounded-xl h-11" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6 border border-slate-200 rounded-2xl">
                <h3 className="font-bold border-b pb-2 uppercase text-[10px] tracking-widest text-slate-400">Desain & Media</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tema Desain</Label>
                    <select {...register("template_theme")} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                      <option value="classic">Classic (Rose Gold / Coklat)</option>
                      <option value="modern">Modern (Monochrome / Modern Minimalist)</option>
                      <option value="botanical">Botanical (Emerald Green / Elegan)</option>
                      <option value="elegant">Elegant (Dark Mode / Zinc Gold)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>URL Foto Cover (Opsional)</Label>
                    <Input {...register("cover_photo")} placeholder="Link Unsplash atau Google Drive" className="rounded-xl h-11" />
                    <p className="text-[10px] text-slate-500 italic">Mendukung link Google Drive (Setting: Anyone with link).</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Kisah Cinta (Opsional)</Label>
                  <textarea 
                    {...register("story")} 
                    className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Ceritakan awal mula pertemuan kalian hingga memutuskan untuk menikah..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>URL Musik Latar (Opsional)</Label>
                  <Input {...register("music_url")} placeholder="https://contoh.com/musik.mp3" className="rounded-xl h-11" />
                </div>

                <div className="space-y-2">
                  <Label>Galeri Foto (Pisahkan koma)</Label>
                  <textarea 
                    {...register("gallery_photos")} 
                    className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="https://img1.com/a.jpg, https://img2.com/b.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rekening Amplop Digital (Format: Bank-No-Nama)</Label>
                  <textarea 
                    {...register("digital_gifts")} 
                    className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder='BCA - 12345678 - Romeo | GoPay - 08123456 - Juliet'
                  />
                  <p className="text-[10px] text-slate-500">Pisahkan entri dengan tanda `|`. </p>
                </div>

                <div className="flex items-center gap-2 mt-4 p-4 bg-slate-50 rounded-xl">
                  <input type="checkbox" id="is_published" {...register("is_published")} className="rounded border-slate-300 w-5 h-5 accent-slate-900" />
                  <Label htmlFor="is_published" className="font-bold cursor-pointer">Langsung Publish Undangan</Label>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-14 rounded-2xl bg-slate-900 text-lg shadow-xl shadow-slate-200" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan & Buat Undangan Sekarang'}
              </Button>
              
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CreateWeddingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Memuat Form...</div>}>
      <CreateWeddingForm />
    </Suspense>
  );
}
