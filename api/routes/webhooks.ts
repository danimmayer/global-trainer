import express from 'express';
import { payment } from '../../shared/lib/mercadopago.js';
import { supabaseAdmin } from '../../shared/lib/supabase.js';
import { EmailService } from '../../shared/services/email.js';
import type { MercadoPagoWebhook } from '../../shared/types/index.js';

const router = express.Router();

router.post('/mercadopago', async (req, res) => {
  try {
    const webhook: MercadoPagoWebhook = req.body;
    
    console.log('Webhook recebido:', JSON.stringify(webhook, null, 2));

    // Verificar se é um evento de pagamento
    if (webhook.type !== 'payment') {
      console.log('Webhook ignorado - não é evento de pagamento');
      return res.status(200).json({ message: 'Webhook ignorado' });
    }

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured');
    }

    // Buscar detalhes do pagamento no Mercado Pago
    const paymentId = webhook.data.id;
    const paymentData = await payment.get({ id: paymentId });

    if (!paymentData) {
      console.error('Pagamento não encontrado no Mercado Pago:', paymentId);
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    console.log('Dados do pagamento:', JSON.stringify(paymentData, null, 2));

    const externalReference = paymentData.external_reference;
    const status = paymentData.status;

    if (!externalReference) {
      console.error('External reference não encontrada no pagamento');
      return res.status(400).json({ error: 'External reference não encontrada' });
    }

    // Buscar pedido no banco
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        users (*),
        courses (*)
      `)
      .eq('id', externalReference)
      .single();

    if (orderError || !order) {
      console.error('Pedido não encontrado:', externalReference, orderError);
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Mapear status do Mercado Pago para nosso sistema
    let orderStatus: 'pending' | 'approved' | 'rejected' | 'cancelled';
    
    switch (status) {
      case 'approved':
        orderStatus = 'approved';
        break;
      case 'rejected':
      case 'cancelled':
        orderStatus = 'rejected';
        break;
      case 'pending':
      case 'in_process':
      case 'in_mediation':
        orderStatus = 'pending';
        break;
      default:
        orderStatus = 'pending';
    }

    // Atualizar status do pedido
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: orderStatus,
        mercadopago_payment_id: paymentId
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Erro ao atualizar pedido:', updateError);
      return res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }

    // Se pagamento aprovado, criar matrícula e enviar email
    if (orderStatus === 'approved') {
      // Verificar se já existe matrícula
      const { data: existingEnrollment } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('user_id', order.user_id)
        .eq('course_id', order.course_id)
        .eq('order_id', order.id)
        .single();

      if (!existingEnrollment) {
        // Criar matrícula
        const { error: enrollmentError } = await supabaseAdmin
          .from('enrollments')
          .insert({
            user_id: order.user_id,
            course_id: order.course_id,
            order_id: order.id,
            status: 'active',
            progress: 0
          });

        if (enrollmentError) {
          console.error('Erro ao criar matrícula:', enrollmentError);
          // Não falhar o webhook por erro de matrícula
        } else {
          console.log('Matrícula criada com sucesso para:', order.user_id, order.course_id);
        }
      }

      // Enviar email de pagamento aprovado
      try {
        await EmailService.sendPaymentApproved({
          user: order.users,
          course: order.courses,
          order
        });
        console.log('Email de pagamento aprovado enviado para:', order.users.email);
      } catch (emailError) {
        console.error('Erro ao enviar email de pagamento aprovado:', emailError);
        // Não falhar o webhook por erro de email
      }
    }

    console.log(`Webhook processado com sucesso - Pedido: ${order.id}, Status: ${orderStatus}`);
    res.status(200).json({ message: 'Webhook processado com sucesso' });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;