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
import { ArrowLeft } from "lucide-react";

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
        router.push("/admin");
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
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Buat Undangan Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold border-b pb-2">Informasi Dasar</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Pasangan</Label>
                  <Input {...register("couple_name")} placeholder="Romeo & Juliet" />
                  {errors.couple_name && <p className="text-red-500 text-xs">{errors.couple_name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Tanggal Pernikahan</Label>
                  <Input type="datetime-local" {...register("date")} />
                  {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lokasi / Venue</Label>
                <textarea 
                  {...register("venue")} 
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="Gedung Pernikahan..."
                />
                {errors.venue && <p className="text-red-500 text-xs">{errors.venue.message}</p>}
              </div>
            </div>

            <div className="space-y-4 bg-rose-50 p-6 rounded-xl border border-rose-100">
              <h3 className="font-bold border-b border-rose-200 pb-2 text-rose-950">Detail Mempelai Wanita</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap / Panggilan</Label>
                  <Input {...register("bride_name")} placeholder="Putri Juliet" />
                </div>
                <div className="space-y-2">
                  <Label>Nama Orang Tua</Label>
                  <Input {...register("bride_parents")} placeholder="Putri dari Bapak A & Ibu B" />
                </div>
                <div className="space-y-2">
                  <Label>Username Instagram</Label>
                  <Input {...register("bride_ig")} placeholder="@juliet_capulet" />
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-100 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold border-b border-slate-300 pb-2 text-slate-800">Detail Mempelai Pria</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap / Panggilan</Label>
                  <Input {...register("groom_name")} placeholder="Pangeran Romeo" />
                </div>
                <div className="space-y-2">
                  <Label>Nama Orang Tua</Label>
                  <Input {...register("groom_parents")} placeholder="Putra dari Bapak C & Ibu D" />
                </div>
                <div className="space-y-2">
                  <Label>Username Instagram</Label>
                  <Input {...register("groom_ig")} placeholder="@romeo_montague" />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6 border border-slate-200 rounded-xl">
              <h3 className="font-bold border-b pb-2">Desain & Konten Tambahan</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tema Desain</Label>
                  <select {...register("template_theme")} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900">
                    <option value="classic">Classic (Rose Gold / Coklat)</option>
                    <option value="modern">Modern (Monochrome / Modern Minimalist)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>URL Foto Cover (Opsional)</Label>
                  <Input {...register("cover_photo")} placeholder="https://..." />
                  <p className="text-xs text-slate-500">Anda dapat menggunakan URL gambar dari Unsplash / ImgBB.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kisah Cinta (Opsional)</Label>
                <textarea 
                  {...register("story")} 
                  className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="Ceritakan awal mula pertemuan kalian hingga memutuskan untuk menikah..."
                />
              </div>

              <div className="space-y-2">
                <Label>URL Musik Latar / Backsound (Opsional)</Label>
                <Input {...register("music_url")} placeholder="https://contoh.com/musik.mp3" />
                <p className="text-xs text-slate-500">Masukkan link file audio yang valid untuk diputar otomatis.</p>
              </div>

              <div className="space-y-2">
                <Label>URL Galeri Foto (Opsional, pisahkan dengan koma)</Label>
                <textarea 
                  {...register("gallery_photos")} 
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="https://img1.com/a.jpg, https://img2.com/b.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label>Rekening Amplop Digital (Opsional)</Label>
                <textarea 
                  {...register("digital_gifts")} 
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder='BCA - 12345678 - Romeo | GoPay - 08123456 - Juliet'
                />
                <p className="text-xs text-slate-500">Pisahkan entri dengan tanda `|`. Format: Bank - Rekening - Nama.</p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="is_published" {...register("is_published")} className="rounded border-slate-300 w-4 h-4" />
                <Label htmlFor="is_published">Langsung Publish Undangan</Label>
              </div>
            </div>

            <Button isLoading={loading} type="submit" size="lg" className="w-full">
              Simpan & Buat Undangan
            </Button>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreateWeddingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CreateWeddingForm />
    </Suspense>
  );
}
