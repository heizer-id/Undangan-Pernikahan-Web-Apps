import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().min(2, { message: "Nama terlalu pendek" }),
  phone: z.string().optional(),
  attendance_status: z.enum(["pending", "confirm", "decline"]),
  number_of_guests: z.number().min(0, "Jumlah tamu tidak valid").max(10, "Maksimal 10 tamu"),
  message: z.string().optional(),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;

export const wishSchema = z.object({
  guest_name: z.string().min(2, "Nama wajib diisi"),
  message: z.string().min(5, "Pesan/Doa terlalu pendek"),
});

export type WishFormValues = z.infer<typeof wishSchema>;

export const weddingSchema = z.object({
  couple_name: z.string().min(3, "Nama pasangan wajib diisi"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  venue: z.string().min(5, "Lokasi wajib diisi"),
  story: z.string().optional(),
  cover_photo: z.string().url("URL foto tidak valid").optional().or(z.literal('')),
  template_theme: z.enum(["classic", "modern"]),
  guest_password: z.string().optional(),
  is_published: z.boolean().optional(),
});

export type WeddingFormValues = z.infer<typeof weddingSchema>;
