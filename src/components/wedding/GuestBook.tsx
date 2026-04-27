"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wishSchema, WishFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { wishApi } from "@/lib/api";
import { Wish } from "@/types";
import { formatDate } from "@/lib/utils";

export function GuestBook({ weddingId, initialWishes = [] }: { weddingId: string, initialWishes?: Wish[] }) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [wishes, setWishes] = React.useState<Wish[]>(initialWishes);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WishFormValues>({
    resolver: zodResolver(wishSchema),
  });

  const fetchWishes = async () => {
    try {
      const res = await wishApi.getWishes(weddingId);
      if (res.success && res.data) {
        setWishes(res.data);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: WishFormValues) => {
    try {
      setLoading(true);
      const res = await wishApi.addWish({ ...data, wedding_id: weddingId });
      if (res.success) {
        toast("Doa berhasil dikirim!", "success");
        reset();
        fetchWishes();
      } else {
        toast(res.message || "Gagal mengirim doa", "error");
      }
    } catch (error: any) {
      toast("Error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-serif text-center mb-6">Kirim Ucapan & Doa</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guest_name">Nama Pengirim</Label>
              <Input id="guest_name" {...register("guest_name")} placeholder="Nama Anda" />
              {errors.guest_name && <p className="text-red-500 text-xs">{errors.guest_name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Ucapan / Doa</Label>
              <textarea
                id="message"
                {...register("message")}
                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900"
                placeholder="Tuliskan ucapan dan doa untuk kedua mempelai..."
              />
              {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
            </div>
            
            <Button isLoading={loading} type="submit" className="w-full bg-slate-800 hover:bg-slate-700">
              Kirim Ucapan
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="text-xl font-serif text-center sticky top-0 bg-white/90 py-2 backdrop-blur z-10 rounded-md">
          Buku Tamu ({wishes.length})
        </h3>
        {wishes.map((w, idx) => (
          <Card key={w.wish_id || idx} className="bg-white/60 backdrop-blur-sm border-0 border-l-4 border-slate-800 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{w.guest_name}</h4>
                <span className="text-xs text-slate-500">{w.created_at ? formatDate(w.created_at) : ''}</span>
              </div>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">{w.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
