import React from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Course } from '@/lib/actions/courses.action';

interface EnhancedCourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

const EnhancedCourseCard: React.FC<EnhancedCourseCardProps> = ({ course, onEnroll }) => {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case "Beginner": 
        return { 
          variant: 'success' as const, 
          icon: '🌱',
          description: 'Perfect for beginners'
        };
      case "Intermediate": 
        return { 
          variant: 'info' as const, 
          icon: '📈',
          description: 'Build on your basics'
        };
      case "Advanced": 
        return { 
          variant: 'destructive' as const, 
          icon: '🚀',
          description: 'Master level content'
        };
      default: 
        return { 
          variant: 'outline' as const, 
          icon: '📚',
          description: 'Learn something new'
        };
    }
  };

  const getSourceConfig = (source: string) => {
    const configs = {
      'freeCodeCamp': { variant: 'success' as const, text: 'freeCodeCamp', icon: '🆓' },
      'edX': { variant: 'info' as const, text: 'edX', icon: '🎓' },
      'coursera': { variant: 'info' as const, text: 'Coursera', icon: '📘' },
      'udemy': { variant: 'secondary' as const, text: 'Udemy', icon: '💻' },
      'internal': { variant: 'gradient' as const, text: 'PrepifyAI', icon: '🤖' }
    };
    
    return configs[source as keyof typeof configs] || configs.internal;
  };

  const formatStudentCount = (count?: number) => {
    if (!count) return '';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const levelConfig = getLevelConfig(course.level);
  const sourceConfig = getSourceConfig(course.source);

  return (
    <Card 
      variant="interactive" 
      className="h-full group hover-lift hover-glow animate-fadeIn"
    >
      <CardHeader className="pb-4">
        {/* Header with icon and source badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-5xl group-hover:scale-110 transition-transform duration-200">
            {course.image}
          </div>
          <Badge variant={sourceConfig.variant} size="sm">
            <span className="mr-1">{sourceConfig.icon}</span>
            {sourceConfig.text}
          </Badge>
        </div>

        {/* Level and Category */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={levelConfig.variant} size="sm">
            <span className="mr-1">{levelConfig.icon}</span>
            {course.level}
          </Badge>
          <span className="text-light-400 text-sm font-medium px-2 py-1 bg-dark-300/50 rounded-md">
            {course.category}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="text-xl font-semibold text-primary-100 group-hover:text-primary-200 transition-colors line-clamp-2 leading-tight">
          {course.title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Instructor */}
        {course.instructor && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {course.instructor.charAt(0).toUpperCase()}
            </div>
            <p className="text-primary-200 text-sm font-medium">
              {course.instructor}
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-light-400 text-sm leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* Rating and Students */}
          {course.rating && (
            <div className="flex items-center gap-2 p-2 bg-dark-300/30 rounded-lg">
              <span className="text-yellow-400">⭐</span>
              <div className="flex flex-col">
                <span className="text-light-300 text-sm font-medium">{course.rating}</span>
                <span className="text-xs text-light-500">Rating</span>
              </div>
            </div>
          )}
          
          {course.students && (
            <div className="flex items-center gap-2 p-2 bg-dark-300/30 rounded-lg">
              <span className="text-blue-400">👥</span>
              <div className="flex flex-col">
                <span className="text-light-300 text-sm font-medium">{formatStudentCount(course.students)}</span>
                <span className="text-xs text-light-500">Students</span>
              </div>
            </div>
          )}
        </div>

        {/* Course Details */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-dark-300/20 to-dark-200/20 rounded-lg border border-dark-300/30">
          <div className="flex items-center gap-1 text-sm text-light-400">
            <span className="text-primary-300">⏱️</span>
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-light-400">
            <span className="text-primary-300">📚</span>
            <span>{course.lessons} lessons</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="space-y-3 pt-2">
          {course.price && (
            <div className="text-center">
              <span className="text-2xl font-bold text-primary-200">{course.price}</span>
            </div>
          )}

          <EnhancedButton
            onClick={() => onEnroll?.(course.id)}
            variant="gradient"
            size="lg"
            className="w-full"
            leftIcon={<span>🚀</span>}
          >
            {course.price === 'Free' ? 'Start Learning' : 'Enroll Now'}
          </EnhancedButton>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-light-500">
              {levelConfig.description} • Access on all devices
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCourseCard;