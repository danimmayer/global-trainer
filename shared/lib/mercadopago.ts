import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('MERCADOPAGO_ACCESS_TOKEN is required');
}

export const mercadopago = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
});

export const payment = new Payment(mercadopago);
export const preference = new Preference(mercadopago);

export const MERCADOPAGO_PUBLIC_KEY = process.env.MERCADOPAGO_PUBLIC_KEY;