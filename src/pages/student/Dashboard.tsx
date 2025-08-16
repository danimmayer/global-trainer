import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play, Calendar } from 'lucide-react';
import { supabase } from '@/shared/lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Course, Enrollment } from '@/shared/types';

interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0
  });

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      const enrollmentsData = data as EnrollmentWithCourse[];
      setEnrollments(enrollmentsData);

      // Calculate stats
      const totalCourses = enrollmentsData.length;
      const completedCourses = enrollmentsData.filter(e => e.progress === 100).length;
      const totalHours = enrollmentsData.reduce((acc, e) => acc + (e.course?.duration_hours || 0), 0);
      const certificates = completedCourses; // Assuming certificates are given for completed courses

      setStats({
        totalCourses,
        completedCourses,
        totalHours,
        certificates
      });
    } catch (error) {
      console.error('Erro ao buscar matrículas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {user?.user_metadata?.name || 'Aluno'}! 👋
          </h1>
          <p className="text-gray-600">
            Continue sua jornada de aprendizado
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cursos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Horas de Estudo</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Continue Aprendendo</h2>
                <Link
                  to="/student/courses"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todos
                </Link>
              </div>

              {enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum curso encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Você ainda não está matriculado em nenhum curso.
                  </p>
                  <Link to="/courses" className="btn btn-primary">
                    Explorar Cursos
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.slice(0, 3).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <img
                        src={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=60&fit=crop'}
                        alt={enrollment.course.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {enrollment.course.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progresso</span>
                              <span>{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/student/courses/${enrollment.course.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Continuar
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Atividade Recente</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Play className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Aula concluída
                    </p>
                    <p className="text-xs text-gray-600">
                      "Introdução ao React" - há 2 horas
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Certificado obtido
                    </p>
                    <p className="text-xs text-gray-600">
                      "JavaScript Fundamentals" - ontem
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Novo curso iniciado
                    </p>
                    <p className="text-xs text-gray-600">
                      "TypeScript Avançado" - há 3 dias
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              
              <div className="space-y-3">
                <Link
                  to="/courses"
                  className="w-full btn btn-secondary flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explorar Cursos
                </Link>
                
                <Link
                  to="/student/certificates"
                  className="w-full btn btn-secondary flex items-center justify-center"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Meus Certificados
                </Link>
                
                <button className="w-full btn btn-secondary flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Estudo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}