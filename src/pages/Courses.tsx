import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Users, Clock } from 'lucide-react';
import { supabase } from '@/shared/lib/supabase';
import type { Course } from '@/shared/types';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'desenvolvimento', label: 'Desenvolvimento' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'negocios', label: 'Negócios' },
    { value: 'dados', label: 'Ciência de Dados' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Todos os Preços' },
    { value: '0-100', label: 'Até R$ 100' },
    { value: '100-200', label: 'R$ 100 - R$ 200' },
    { value: '200-300', label: 'R$ 200 - R$ 300' },
    { value: '300+', label: 'Acima de R$ 300' }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const price = course.price;
      switch (priceRange) {
        case '0-100':
          matchesPrice = price <= 100;
          break;
        case '100-200':
          matchesPrice = price > 100 && price <= 200;
          break;
        case '200-300':
          matchesPrice = price > 200 && price <= 300;
          break;
        case '300+':
          matchesPrice = price > 300;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Todos os Cursos</h1>
          <p className="text-gray-600">Descubra o curso perfeito para impulsionar sua carreira</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input pl-10 appearance-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="input"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-gray-600">
              <span className="font-medium">{filteredCourses.length}</span>
              <span className="ml-1">cursos encontrados</span>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded capitalize">
                    {course.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>1.2k alunos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_hours}h</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-600">
                    R$ {course.price.toFixed(2).replace('.', ',')}
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="btn btn-primary"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum curso encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}