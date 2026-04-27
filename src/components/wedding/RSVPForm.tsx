"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rsvpSchema, RsvpFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { guestApi } from "@/lib/api";

export function RSVPForm({ weddingId, onSuccess }: { weddingId: string, onSuccess?: () => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attendance_status: "pending",
      number_of_guests: 1,
    },
  });

  const onSubmit = async (data: RsvpFormValues) => {
    try {
      setLoading(true);
      const res = await guestApi.rsvp({ ...data, wedding_id: weddingId });
      if (res.success) {
        toast("RSVP berhasil dikirim!", "success");
        reset();
        if (onSuccess) onSuccess();
      } else {
        toast(res.message || "Gagal mengirim RSVP", "error");
      }
    } catch (error: any) {
      toast("Error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-center text-slate-800">RSVP</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" {...register("name")} placeholder="John Doe" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon (WhatsApp)</Label>
            <Input id="phone" {...register("phone")} placeholder="0812XXXXXXXX" />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Kehadiran</Label>
            <select
              {...register("attendance_status")}
              className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900"
            >
              <option value="pending">Belum Pasti</option>
              <option value="confirm">Ya, Saya Akan Hadir</option>
              <option value="decline">Maaf, Saya Tidak Bisa Hadir</option>
            </select>
            {errors.attendance_status && (
              <p className="text-red-500 text-xs">{errors.attendance_status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="number_of_guests">Jumlah Tamu</Label>
            <Input
              id="number_of_guests"
              type="number"
              min={0}
              max={10}
              {...register("number_of_guests", { valueAsNumber: true })}
            />
            {errors.number_of_guests && (
              <p className="text-red-500 text-xs">{errors.number_of_guests.message}</p>
            )}
          </div>

          <Button isLoading={loading} type="submit" className="w-full bg-slate-800 hover:bg-slate-700">
            Kirim RSVP
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
