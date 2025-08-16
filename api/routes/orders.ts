import express from 'express';
import { preference } from '../../shared/lib/mercadopago.js';
import { supabaseAdmin } from '../../shared/lib/supabase.js';
import { EmailService } from '../../shared/services/email.js';
import type { PaymentData } from '../../shared/types/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const paymentData: PaymentData = req.body;
    const { courseId, userId, amount, paymentMethod, userEmail, userName } = paymentData;

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured');
    }

    // Buscar dados do curso
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    // Verificar se o usuário existe, se não, criar
    let { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // Usuário não existe, criar
      const { data: newUser, error: createUserError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email: userEmail,
          name: userName
        })
        .select()
        .single();

      if (createUserError) {
        console.error('Erro ao criar usuário:', createUserError);
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }

      user = newUser;
    } else if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }

    // Criar pedido no banco
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        course_id: courseId,
        amount,
        payment_method: paymentMethod,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Erro ao criar pedido:', orderError);
      return res.status(500).json({ error: 'Erro ao criar pedido' });
    }

    // Criar preferência no Mercado Pago
    const preferenceData = {
      items: [
        {
          id: course.id,
          title: course.title,
          description: `Curso: ${course.title} - Instrutor: ${course.instructor}`,
          quantity: 1,
          unit_price: amount / 100,
          currency_id: 'BRL'
        }
      ],
      payer: {
        name: userName,
        email: userEmail
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: paymentMethod === 'credit_card' ? 12 : 1
      },
      back_urls: {
        success: `${process.env.VITE_APP_URL}/checkout/success?order_id=${order.id}`,
        failure: `${process.env.VITE_APP_URL}/checkout/failure?order_id=${order.id}`,
        pending: `${process.env.VITE_APP_URL}/checkout/pending?order_id=${order.id}`
      },
      auto_return: 'approved',
      external_reference: order.id,
      notification_url: `${process.env.API_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'GLOBAL TRAINER',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
    };

    const mpPreference = await preference.create({ body: preferenceData });

    if (!mpPreference.id) {
      throw new Error('Erro ao criar preferência no Mercado Pago');
    }

    // Atualizar pedido com ID da preferência
    await supabaseAdmin
      .from('orders')
      .update({ mercadopago_payment_id: mpPreference.id })
      .eq('id', order.id);

    // Enviar email de confirmação
    try {
      await EmailService.sendOrderConfirmation({
        user: user!,
        course,
        order
      });
    } catch (emailError) {
      console.error('Erro ao enviar email de confirmação:', emailError);
      // Não falhar a requisição por erro de email
    }

    res.json({
      orderId: order.id,
      preferenceId: mpPreference.id,
      initPoint: mpPreference.init_point,
      sandboxInitPoint: mpPreference.sandbox_init_point
    });

  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;