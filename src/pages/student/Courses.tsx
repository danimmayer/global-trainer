import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Play, Clock, Award, BookOpen } from 'lucide-react';
import { supabase } from '@/shared/lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Course, Enrollment } from '@/shared/types';

interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export default function StudentCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'completed', label: 'Concluídos' },
    { value: 'not_started', label: 'Não Iniciados' }
  ];

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
        .eq('status', 'active')
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data as EnrollmentWithCourse[]);
    } catch (error) {
      console.error('Erro ao buscar matrículas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressStatus = (progress: number) => {
    if (progress === 0) return 'not_started';
    if (progress === 100) return 'completed';
    return 'in_progress';
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const progressStatus = getProgressStatus(enrollment.progress);
    const matchesStatus = statusFilter === 'all' || progressStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Meus Cursos</h1>
          <p className="text-gray-600">Gerencie e continue seus estudos</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input pl-10 appearance-none"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-gray-600">
              <span className="font-medium">{filteredEnrollments.length}</span>
              <span className="ml-1">cursos encontrados</span>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {enrollments.length === 0 ? 'Nenhum curso encontrado' : 'Nenhum curso corresponde aos filtros'}
            </h3>
            <p className="text-gray-600 mb-4">
              {enrollments.length === 0 
                ? 'Você ainda não está matriculado em nenhum curso.'
                : 'Tente ajustar os filtros ou buscar por outros termos.'
              }
            </p>
            {enrollments.length === 0 && (
              <Link to="/courses" className="btn btn-primary">
                Explorar Cursos
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => {
              const progressStatus = getProgressStatus(enrollment.progress);
              
              return (
                <div key={enrollment.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
                      alt={enrollment.course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {progressStatus === 'completed' && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          Concluído
                        </div>
                      )}
                      {progressStatus === 'in_progress' && (
                        <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Em Progresso
                        </div>
                      )}
                      {progressStatus === 'not_started' && (
                        <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Não Iniciado
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded capitalize">
                        {enrollment.course.category}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{enrollment.course.duration_hours}h</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {enrollment.course.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {enrollment.course.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progresso</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Matriculado em {new Date(enrollment.enrolled_at).toLocaleDateString('pt-BR')}
                      </div>
                      <Link
                        to={`/student/courses/${enrollment.course.id}`}
                        className="btn btn-primary btn-sm flex items-center"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        {progressStatus === 'not_started' ? 'Iniciar' : 'Continuar'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}