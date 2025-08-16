import { resend, FROM_EMAIL } from '../lib/resend.js';
import { Course, Order, User } from '../types/index.js';

interface OrderConfirmationData {
  user: User;
  course: Course;
  order: Order;
}

interface PixInstructionsData {
  user: User;
  course: Course;
  order: Order;
  pixCode: string;
  pixQrCode: string;
}

interface PaymentApprovedData {
  user: User;
  course: Course;
  order: Order;
}

export class EmailService {
  static async sendOrderConfirmation(data: OrderConfirmationData) {
    const { user, course, order } = data;

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmação de Pedido - Global Trainer</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .order-details { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
        .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        @media (max-width: 600px) { .container { width: 100% !important; } .content { padding: 20px !important; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Global Trainer</h1>
          <h2>Confirmação de Pedido</h2>
        </div>
        
        <div class="content">
          <p>Olá <strong>${user.name}</strong>,</p>
          
          <p>Recebemos seu pedido com sucesso! Aqui estão os detalhes:</p>
          
          <div class="order-details">
            <h3>📋 Detalhes do Pedido</h3>
            <p><strong>Pedido:</strong> #${order.id.slice(-8).toUpperCase()}</p>
            <p><strong>Curso:</strong> ${course.title}</p>
            <p><strong>Instrutor:</strong> ${course.instructor}</p>
            <p><strong>Valor:</strong> R$ ${(order.amount / 100).toFixed(2).replace('.', ',')}</p>
            <p><strong>Método de Pagamento:</strong> ${order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'credit_card' ? 'Cartão de Crédito' : 'Boleto Bancário'}</p>
            <p><strong>Status:</strong> Aguardando Pagamento</p>
          </div>
          
          ${order.payment_method === 'pix' ? `
            <p>📱 <strong>Próximos passos para PIX:</strong></p>
            <p>Você receberá em breve um e-mail com o código PIX e QR Code para realizar o pagamento.</p>
          ` : order.payment_method === 'boleto' ? `
            <p>🏦 <strong>Próximos passos para Boleto:</strong></p>
            <p>Você receberá em breve um e-mail com o boleto bancário para pagamento.</p>
          ` : `
            <p>💳 <strong>Pagamento com Cartão:</strong></p>
            <p>Seu pagamento está sendo processado. Você receberá uma confirmação em breve.</p>
          `}
          
          <p>Assim que o pagamento for confirmado, você receberá acesso imediato ao curso!</p>
          
          <a href="${process.env.VITE_APP_URL}/student/dashboard" class="button">Acessar Minha Área</a>
        </div>
        
        <div class="footer">
          <p>© 2024 Global Trainer. Todos os direitos reservados.</p>
          <p>Dúvidas? Entre em contato: suporte@globaltrainer.com.br</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: `Confirmação de Pedido - ${course.title}`,
        html
      });

      console.log('Email de confirmação enviado:', result.data?.id);
      return result;
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
      throw error;
    }
  }

  static async sendPixInstructions(data: PixInstructionsData) {
    const { user, course, order, pixCode, pixQrCode } = data;

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Instruções PIX - Global Trainer</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .pix-details { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .pix-code { background-color: #f9fafb; padding: 15px; border-radius: 6px; font-family: monospace; word-break: break-all; margin: 10px 0; }
        .footer { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
        .qr-code { text-align: center; margin: 20px 0; }
        @media (max-width: 600px) { .container { width: 100% !important; } .content { padding: 20px !important; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Global Trainer</h1>
          <h2>📱 Instruções para Pagamento PIX</h2>
        </div>
        
        <div class="content">
          <p>Olá <strong>${user.name}</strong>,</p>
          
          <p>Seu PIX está pronto! Siga as instruções abaixo para finalizar o pagamento:</p>
          
          <div class="pix-details">
            <h3>💰 Detalhes do Pagamento</h3>
            <p><strong>Valor:</strong> R$ ${(order.amount / 100).toFixed(2).replace('.', ',')}</p>
            <p><strong>Curso:</strong> ${course.title}</p>
            <p><strong>Pedido:</strong> #${order.id.slice(-8).toUpperCase()}</p>
          </div>
          
          <h3>📱 Como pagar:</h3>
          <ol>
            <li><strong>Pelo QR Code:</strong> Abra o app do seu banco e escaneie o código abaixo</li>
            <li><strong>Pelo código PIX:</strong> Copie e cole o código no seu app bancário</li>
          </ol>
          
          <div class="qr-code">
            <img src="${pixQrCode}" alt="QR Code PIX" style="max-width: 200px; height: auto;" />
          </div>
          
          <h4>🔑 Código PIX (Copia e Cola):</h4>
          <div class="pix-code">
            ${pixCode}
          </div>
          
          <p><strong>⏰ Importante:</strong> O PIX expira em 30 minutos. Após o pagamento, você receberá acesso imediato ao curso!</p>
          
          <p>💡 <strong>Dica:</strong> Mantenha este e-mail aberto para facilitar o pagamento.</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Global Trainer. Todos os direitos reservados.</p>
          <p>Dúvidas? Entre em contato: suporte@globaltrainer.com.br</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: `PIX Pronto - ${course.title} - R$ ${(order.amount / 100).toFixed(2).replace('.', ',')}`,
        html
      });

      console.log('Email PIX enviado:', result.data?.id);
      return result;
    } catch (error) {
      console.error('Erro ao enviar email PIX:', error);
      throw error;
    }
  }

  static async sendPaymentApproved(data: PaymentApprovedData) {
    const { user, course, order } = data;

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pagamento Aprovado - Global Trainer</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .success-box { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
        .course-access { background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
        .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        @media (max-width: 600px) { .container { width: 100% !important; } .content { padding: 20px !important; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Global Trainer</h1>
          <h2>✅ Pagamento Aprovado!</h2>
        </div>
        
        <div class="content">
          <p>Parabéns <strong>${user.name}</strong>! 🎉</p>
          
          <div class="success-box">
            <h3>✅ Pagamento Confirmado</h3>
            <p>Seu pagamento foi aprovado com sucesso!</p>
            <p><strong>Valor pago:</strong> R$ ${(order.amount / 100).toFixed(2).replace('.', ',')}</p>
            <p><strong>Pedido:</strong> #${order.id.slice(-8).toUpperCase()}</p>
          </div>
          
          <div class="course-access">
            <h3>🚀 Acesso Liberado</h3>
            <p><strong>Curso:</strong> ${course.title}</p>
            <p><strong>Instrutor:</strong> ${course.instructor}</p>
            <p><strong>Duração:</strong> ${course.duration}</p>
            <p><strong>Nível:</strong> ${course.level === 'beginner' ? 'Iniciante' : course.level === 'intermediate' ? 'Intermediário' : 'Avançado'}</p>
            
            <p>🎯 <strong>Você já pode começar a estudar!</strong></p>
          </div>
          
          <a href="${process.env.VITE_APP_URL}/student/courses/${course.id}" class="button">🎓 Acessar Curso Agora</a>
          
          <p>📚 Você também pode acessar todos os seus cursos na sua área do aluno.</p>
          
          <a href="${process.env.VITE_APP_URL}/student/dashboard" class="button" style="background-color: #3b82f6;">📊 Minha Área do Aluno</a>
          
          <p><strong>💡 Dicas para aproveitar melhor:</strong></p>
          <ul>
            <li>📱 Acesse de qualquer dispositivo</li>
            <li>⏰ Estude no seu próprio ritmo</li>
            <li>📝 Faça anotações durante as aulas</li>
            <li>🤝 Participe dos fóruns de discussão</li>
            <li>🏆 Complete todos os exercícios</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>© 2024 Global Trainer. Todos os direitos reservados.</p>
          <p>Dúvidas? Entre em contato: suporte@globaltrainer.com.br</p>
          <p>📱 Siga-nos nas redes sociais para dicas e novidades!</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject: `🎉 Acesso Liberado - ${course.title}`,
        html
      });

      console.log('Email de pagamento aprovado enviado:', result.data?.id);
      return result;
    } catch (error) {
      console.error('Erro ao enviar email de pagamento aprovado:', error);
      throw error;
    }
  }
}