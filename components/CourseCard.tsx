import React from 'react';
import { Button } from '@/components/ui/button';
import { Course } from '@/lib/actions/courses.action';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "text-green-400 bg-green-400/10";
      case "Intermediate": return "text-blue-400 bg-blue-400/10";
      case "Advanced": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getSourceBadge = (source: string) => {
    const badges = {
      'freeCodeCamp': { color: 'bg-green-600', text: 'freeCodeCamp' },
      'edX': { color: 'bg-blue-600', text: 'edX' },
      'coursera': { color: 'bg-blue-500', text: 'Coursera' },
      'udemy': { color: 'bg-purple-600', text: 'Udemy' },
      'internal': { color: 'bg-primary-200', text: 'PrepifyAI' }
    };
    
    const badge = badges[source as keyof typeof badges] || badges.internal;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const formatStudentCount = (count?: number) => {
    if (!count) return '';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6 hover:border-primary-200 transition-all duration-200 group hover:shadow-lg">
      {/* Header with source badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="text-4xl">{course.image}</div>
        {getSourceBadge(course.source)}
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
          <span className="text-light-400 text-sm">{course.category}</span>
        </div>

        <h3 className="text-xl font-semibold text-primary-100 group-hover:text-primary-200 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {course.instructor && (
          <p className="text-primary-200 text-sm font-medium">
            by {course.instructor}
          </p>
        )}

        <p className="text-light-400 text-sm leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* Rating and Students */}
        {(course.rating || course.students) && (
          <div className="flex items-center gap-4 text-sm">
            {course.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-light-300">{course.rating}</span>
              </div>
            )}
            {course.students && (
              <div className="flex items-center gap-1">
                <span className="text-light-400">👥</span>
                <span className="text-light-300">{formatStudentCount(course.students)} students</span>
              </div>
            )}
          </div>
        )}

        {/* Course Details */}
        <div className="flex items-center justify-between text-sm text-light-400">
          <span>⏱️ {course.duration}</span>
          <span>📚 {course.lessons} lessons</span>
        </div>

        {/* Price */}
        {course.price && (
          <div className="text-lg font-semibold text-green-400">
            {course.price}
          </div>
        )}

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-dark-300 text-light-300 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-light-400 text-xs">+{course.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {course.url ? (
            <Button 
              className="flex-1" 
              variant="default"
              onClick={() => window.open(course.url, '_blank')}
            >
              View Course
            </Button>
          ) : (
            <Button 
              className="flex-1" 
              variant="default"
              onClick={() => onEnroll?.(course.id)}
            >
              Start Course
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            className="px-3"
            title="Add to Wishlist"
          >
            ❤️
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
