export interface Wedding {
  wedding_id?: string;
  couple_name: string;
  date: string; // ISO String
  venue: string;
  story: string;
  cover_photo: string;
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
