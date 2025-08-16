import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Users, Clock, Play, CheckCircle, Award, ArrowLeft } from 'lucide-react';
import { supabase } from '@/shared/lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Course } from '@/shared/types';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse();
      if (user) {
        checkEnrollment();
      }
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Erro ao buscar curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', id)
        .eq('status', 'active')
        .single();

      if (data) {
        setIsEnrolled(true);
      }
    } catch (error) {
      // Enrollment not found, which is fine
    }
  };

  const handleEnroll = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    if (isEnrolled) {
      navigate(`/student/courses/${id}`);
      return;
    }

    navigate(`/checkout/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h2>
          <Link to="/courses" className="btn btn-primary">
            Voltar aos Cursos
          </Link>
        </div>
      </div>
    );
  }

  const modules = [
    {
      title: 'Introdução e Fundamentos',
      lessons: 8,
      duration: '2h 30min',
      topics: ['Conceitos básicos', 'Configuração do ambiente', 'Primeiro projeto']
    },
    {
      title: 'Desenvolvimento Prático',
      lessons: 12,
      duration: '4h 15min',
      topics: ['Estruturas de dados', 'Algoritmos', 'Boas práticas']
    },
    {
      title: 'Projetos Avançados',
      lessons: 10,
      duration: '3h 45min',
      topics: ['Projeto real', 'Deploy', 'Otimização']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/courses"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos cursos
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded capitalize">
                  {course.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-gray-500">(1,234 avaliações)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center space-x-6 text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-5 h-5" />
                  <span>1,234 alunos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration_hours} horas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Play className="w-5 h-5" />
                  <span>30 aulas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-5 h-5" />
                  <span>Certificado</span>
                </div>
              </div>
            </div>

            {/* Course Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview do Curso</h2>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                  <p className="text-gray-600">Clique para assistir o preview</p>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">O que você vai aprender</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Dominar os conceitos fundamentais',
                  'Desenvolver projetos práticos',
                  'Aplicar boas práticas da indústria',
                  'Criar um portfólio profissional',
                  'Preparar-se para o mercado de trabalho',
                  'Obter certificação reconhecida'
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conteúdo do Curso</h2>
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Módulo {index + 1}: {module.title}
                        </h3>
                        <div className="text-sm text-gray-500">
                          {module.lessons} aulas • {module.duration}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center space-x-2 text-gray-600">
                            <Play className="w-4 h-4" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                <Play className="w-12 h-12 text-primary-600" />
              </div>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  R$ {course.price.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-gray-600">Acesso vitalício</p>
              </div>
              
              <button
                onClick={handleEnroll}
                className="w-full btn btn-primary mb-4"
              >
                {isEnrolled ? 'Acessar Curso' : 'Inscrever-se Agora'}
              </button>
              
              <div className="text-center text-sm text-gray-600 mb-6">
                Garantia de 30 dias ou seu dinheiro de volta
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Acesso vitalício</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Certificado de conclusão</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Suporte direto com instrutor</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Acesso mobile e desktop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}