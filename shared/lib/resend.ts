import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error('RESEND_API_KEY is required');
}

export const resend = new Resend(apiKey);

export const FROM_EMAIL = 'Global Trainer <noreply@globaltrainer.com.br>';
export const SUPPORT_EMAIL = 'suporte@globaltrainer.com.br';