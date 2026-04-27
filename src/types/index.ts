export interface Wedding {
  wedding_id?: string;
  couple_name: string; // Used as an overarching title if needed
  bride_name?: string;
  bride_parents?: string;
  bride_ig?: string;
  groom_name?: string;
  groom_parents?: string;
  groom_ig?: string;
  date: string; // ISO String
  venue: string;
  story: string;
  cover_photo: string;
  gallery_photos?: string; // Stored as comma-separated URLs or JSON string
  music_url?: string;
  digital_gifts?: string; // Stored as JSON string
  user_email: string;
  template_theme: 'classic' | 'modern' | string;
  guest_password?: string;
  created_at?: string;
  is_published?: boolean | string; // GAS sometimes returns string "TRUE"
}

export interface Guest {
  guest_id?: string;
  wedding_id: string;
  name: string;
  phone?: string;
  attendance_status: 'pending' | 'confirm' | 'decline';
  number_of_guests: number;
  message?: string;
  confirmed_at?: string;
}

export interface Wish {
  wish_id?: string;
  wedding_id: string;
  guest_name: string;
  message: string;
  created_at?: string;
  is_private?: boolean | string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
