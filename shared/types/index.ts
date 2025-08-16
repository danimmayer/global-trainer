export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
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
}

export interface Order {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  payment_method: 'pix' | 'credit_card' | 'boleto';
  mercadopago_payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  order_id: string;
  status: 'active' | 'inactive' | 'completed';
  progress: number;
  enrolled_at: string;
  completed_at?: string;
}

export interface PaymentData {
  courseId: string;
  userId: string;
  amount: number;
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  userEmail: string;
  userName: string;
}

export interface MercadoPagoWebhook {
  id: number;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: number;
  user_id: number;
  version: number;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}