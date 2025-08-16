import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, BookOpen, Award, Play, CheckCircle } from 'lucide-react';

const featuredCourses = [
  {
    id: 1,
    title: 'React Avançado com TypeScript',
    instructor: 'João Silva',
    rating: 4.9,
    students: 1250,
    price: 199.90,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    category: 'Desenvolvimento'
  },
  {
    id: 2,
    title: 'Marketing Digital Completo',
    instructor: 'Maria Santos',
    rating: 4.8,
    students: 980,
    price: 149.90,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    category: 'Marketing'
  },
  {
    id: 3,
    title: 'Design UX/UI Profissional',
    instructor: 'Pedro Costa',
    rating: 4.9,
    students: 750,
    price: 179.90,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    category: 'Design'
  }
];

const testimonials = [
  {
    name: 'Ana Carolina',
    role: 'Desenvolvedora Frontend',
    content: 'Os cursos da Global Trainer transformaram minha carreira. Consegui uma promoção em apenas 6 meses!',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face'
  },
  {
    name: 'Carlos Mendes',
    role: 'Gerente de Marketing',
    content: 'Conteúdo de altíssima qualidade e professores experientes. Recomendo para todos os profissionais.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
  },
  {
    name: 'Juliana Oliveira',
    role: 'UX Designer',
    content: 'A metodologia de ensino é excelente. Aprendi na prática e já estou aplicando no meu trabalho.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Transforme sua
                <span className="block text-yellow-400">carreira hoje</span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Aprenda com os melhores profissionais do mercado e desenvolva 
                as habilidades mais demandadas pelas empresas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/courses"
                  className="inline-flex items-center px-8 py-4 bg-yellow-400 text-primary-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  Explorar Cursos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                  <Play className="mr-2 w-5 h-5" />
                  Assistir Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Estudantes aprendendo"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-primary-600 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-lg">50.000+</div>
                    <div className="text-sm text-gray-600">Alunos ativos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">200+</div>
              <div className="text-gray-600">Cursos Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50k+</div>
              <div className="text-gray-600">Alunos Formados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">4.9</div>
              <div className="text-gray-600">Avaliação Média</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Taxa de Conclusão</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cursos em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra os cursos mais populares e bem avaliados pelos nossos alunos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4">Por {course.instructor}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{course.students} alunos</span>
                    </div>
                    <div className="text-2xl font-bold text-primary-600">
                      R$ {course.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="mt-4 w-full btn btn-primary flex items-center justify-center"
                  >
                    Ver Detalhes
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/courses" className="btn btn-primary">
              Ver Todos os Cursos
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a Global Trainer?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Conteúdo Atualizado
              </h3>
              <p className="text-gray-600">
                Cursos sempre atualizados com as últimas tendências e tecnologias do mercado.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Professores Especialistas
              </h3>
              <p className="text-gray-600">
                Aprenda com profissionais experientes e reconhecidos no mercado.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Certificação
              </h3>
              <p className="text-gray-600">
                Receba certificados reconhecidos pelo mercado ao concluir os cursos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Suporte Completo
              </h3>
              <p className="text-gray-600">
                Tire suas dúvidas com nosso time de suporte especializado.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Acesso Vitalício
              </h3>
              <p className="text-gray-600">
                Acesse seus cursos quando quiser, quantas vezes precisar.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Qualidade Garantida
              </h3>
              <p className="text-gray-600">
                Satisfação garantida ou seu dinheiro de volta em 30 dias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos alunos dizem
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para transformar sua carreira?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Junte-se a milhares de profissionais que já mudaram suas vidas com nossos cursos.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center px-8 py-4 bg-yellow-400 text-primary-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Começar Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}