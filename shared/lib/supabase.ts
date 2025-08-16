import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente público (frontend)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente administrativo (backend)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number;
          image_url: string;
          instructor: string;
          duration: string;
          level: 'beginner' | 'intermediate' | 'advanced';
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          image_url: string;
          instructor: string;
          duration: string;
          level: 'beginner' | 'intermediate' | 'advanced';
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          image_url?: string;
          instructor?: string;
          duration?: string;
          level?: 'beginner' | 'intermediate' | 'advanced';
          category?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          amount: number;
          status: 'pending' | 'approved' | 'rejected' | 'cancelled';
          payment_method: 'pix' | 'credit_card' | 'boleto';
          mercadopago_payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          amount: number;
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
          payment_method: 'pix' | 'credit_card' | 'boleto';
          mercadopago_payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          amount?: number;
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
          payment_method?: 'pix' | 'credit_card' | 'boleto';
          mercadopago_payment_id?: string | null;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          order_id: string;
          status: 'active' | 'inactive' | 'completed';
          progress: number;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          order_id: string;
          status?: 'active' | 'inactive' | 'completed';
          progress?: number;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          order_id?: string;
          status?: 'active' | 'inactive' | 'completed';
          progress?: number;
          completed_at?: string | null;
        };
      };
    };
  };
};