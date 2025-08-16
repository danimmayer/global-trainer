import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Settings, 
  Maximize, 
  ArrowLeft,
  CheckCircle,
  Lock,
  FileText,
  Download
} from 'lucide-react';
import { supabase } from '@/shared/lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Course, Enrollment } from '@/shared/types';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  completed: boolean;
  locked: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Mock data for modules and lessons
  const modules: Module[] = [
    {
      id: '1',
      title: 'Introdução e Fundamentos',
      lessons: [
        { id: '1', title: 'Bem-vindo ao curso', duration: '5:30', completed: true, locked: false },
        { id: '2', title: 'Configuração do ambiente', duration: '12:45', completed: true, locked: false },
        { id: '3', title: 'Conceitos básicos', duration: '18:20', completed: false, locked: false },
        { id: '4', title: 'Primeiro projeto', duration: '25:10', completed: false, locked: true }
      ]
    },
    {
      id: '2',
      title: 'Desenvolvimento Prático',
      lessons: [
        { id: '5', title: 'Estruturas de dados', duration: '22:15', completed: false, locked: true },
        { id: '6', title: 'Algoritmos fundamentais', duration: '28:30', completed: false, locked: true },
        { id: '7', title: 'Boas práticas', duration: '15:45', completed: false, locked: true }
      ]
    },
    {
      id: '3',
      title: 'Projetos Avançados',
      lessons: [
        { id: '8', title: 'Projeto real - Parte 1', duration: '35:20', completed: false, locked: true },
        { id: '9', title: 'Projeto real - Parte 2', duration: '40:15', completed: false, locked: true },
        { id: '10', title: 'Deploy e otimização', duration: '30:45', completed: false, locked: true }
      ]
    }
  ];

  useEffect(() => {
    if (courseId && user) {
      fetchCourseData();
    }
  }, [courseId, user]);

  useEffect(() => {
    // Set first available lesson as current
    if (modules.length > 0) {
      const firstAvailableLesson = modules[0].lessons.find(lesson => !lesson.locked);
      if (firstAvailableLesson) {
        setCurrentLesson(firstAvailableLesson);
      }
    }
  }, []);

  const fetchCourseData = async () => {
    if (!courseId || !user) return;

    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch enrollment
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single();

      if (enrollmentError) throw enrollmentError;
      setEnrollment(enrollmentData);
    } catch (error) {
      console.error('Erro ao buscar dados do curso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (!lesson.locked) {
      setCurrentLesson(lesson);
      setIsPlaying(false);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    // Update lesson completion status
    // This would typically update the database
    console.log('Marking lesson complete:', lessonId);
  };

  const getNextLesson = () => {
    if (!currentLesson) return null;
    
    for (const module of modules) {
      const currentIndex = module.lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex !== -1) {
        if (currentIndex < module.lessons.length - 1) {
          return module.lessons[currentIndex + 1];
        }
        // Look in next module
        const moduleIndex = modules.findIndex(m => m.id === module.id);
        if (moduleIndex < modules.length - 1) {
          return modules[moduleIndex + 1].lessons[0];
        }
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!currentLesson) return null;
    
    for (const module of modules) {
      const currentIndex = module.lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex !== -1) {
        if (currentIndex > 0) {
          return module.lessons[currentIndex - 1];
        }
        // Look in previous module
        const moduleIndex = modules.findIndex(m => m.id === module.id);
        if (moduleIndex > 0) {
          const prevModule = modules[moduleIndex - 1];
          return prevModule.lessons[prevModule.lessons.length - 1];
        }
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h2>
          <Link to="/student/courses" className="btn btn-primary">
            Voltar aos Meus Cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Main Video Area */}
      <div className={`flex-1 flex flex-col ${showSidebar ? 'mr-80' : ''}`}>
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={`/student/courses`}
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-semibold">{course.title}</h1>
              {currentLesson && (
                <p className="text-sm text-gray-300">{currentLesson.title}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-300 hover:text-white"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            {currentLesson ? (
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary-700"
                     onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
                <p className="text-gray-300">Duração: {currentLesson.duration}</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <p>Selecione uma aula para começar</p>
              </div>
            )}
          </div>
        </div>

        {/* Video Controls */}
        <div className="bg-gray-900 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const prevLesson = getPreviousLesson();
                  if (prevLesson && !prevLesson.locked) {
                    setCurrentLesson(prevLesson);
                  }
                }}
                className="text-gray-300 hover:text-white disabled:opacity-50"
                disabled={!getPreviousLesson() || getPreviousLesson()?.locked}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button
                onClick={() => {
                  const nextLesson = getNextLesson();
                  if (nextLesson && !nextLesson.locked) {
                    setCurrentLesson(nextLesson);
                  }
                }}
                className="text-gray-300 hover:text-white disabled:opacity-50"
                disabled={!getNextLesson() || getNextLesson()?.locked}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Volume2 className="w-5 h-5 text-gray-300" />
              <Settings className="w-5 h-5 text-gray-300" />
              <Maximize className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Conteúdo do Curso</h2>
            <div className="mt-2">
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
          
          <div className="flex-1 overflow-y-auto">
            {modules.map((module) => (
              <div key={module.id} className="border-b border-gray-200">
                <div className="p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-900">{module.title}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 flex items-center space-x-3 ${
                        currentLesson?.id === lesson.id ? 'bg-primary-50 border-r-2 border-primary-600' : ''
                      } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleLessonSelect(lesson)}
                    >
                      <div className="flex-shrink-0">
                        {lesson.locked ? (
                          <Lock className="w-4 h-4 text-gray-400" />
                        ) : lesson.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Play className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          currentLesson?.id === lesson.id ? 'text-primary-600' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500">{lesson.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Course Resources */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Recursos do Curso</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Material de apoio
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Exercícios práticos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}