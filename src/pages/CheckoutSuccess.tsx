import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Play } from 'lucide-react';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    // Simulate fetching order data
    setTimeout(() => {
      setOrderData({
        id: orderId,
        course: {
          title: 'React Avançado com TypeScript',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
        },
        amount: 199.90,
        paymentMethod: 'PIX',
        status: status || 'approved'
      });
      setLoading(false);
    }, 1000);
  }, [orderId, paymentId, status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compra Realizada com Sucesso!
          </h1>
          <p className="text-lg text-gray-600">
            Parabéns! Você já pode acessar seu curso.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes do Pedido</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Informações do Pagamento</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número do Pedido:</span>
                  <span className="font-medium">#{orderData?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Forma de Pagamento:</span>
                  <span className="font-medium">{orderData?.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Aprovado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor Total:</span>
                  <span className="font-medium text-lg">R$ {orderData?.amount.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Curso Adquirido</h3>
              <div className="flex items-start space-x-3">
                <img
                  src={orderData?.course.thumbnail}
                  alt={orderData?.course.title}
                  className="w-16 h-12 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{orderData?.course.title}</h4>
                  <p className="text-sm text-gray-600">Acesso vitalício</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Passos</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Acesse sua área do aluno</h3>
                <p className="text-gray-600 text-sm">Vá para sua área pessoal e comece a estudar imediatamente.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Baixe os materiais</h3>
                <p className="text-gray-600 text-sm">Faça download dos recursos complementares do curso.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Comece a aprender</h3>
                <p className="text-gray-600 text-sm">Assista às aulas e pratique com os exercícios propostos.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/student/dashboard"
            className="btn btn-primary flex items-center justify-center"
          >
            <Play className="w-5 h-5 mr-2" />
            Acessar Área do Aluno
          </Link>
          
          <button className="btn btn-secondary flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Baixar Comprovante
          </button>
        </div>

        {/* Support */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 mb-2">
            <strong>Precisa de ajuda?</strong>
          </p>
          <p className="text-blue-600 text-sm">
            Entre em contato conosco pelo email{' '}
            <a href="mailto:suporte@globaltrainer.com.br" className="underline">
              suporte@globaltrainer.com.br
            </a>
            {' '}ou WhatsApp (11) 99999-9999
          </p>
        </div>
      </div>
    </div>
  );
}