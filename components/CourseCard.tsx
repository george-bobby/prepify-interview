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
      case "Beginner": return "text-[#c0fe72] bg-[#c0fe72]/10 border border-[#c0fe72]/30";
      case "Intermediate": return "text-[#9cd052] bg-[#9cd052]/10 border border-[#9cd052]/30";
      case "Advanced": return "text-[#7cb342] bg-[#7cb342]/10 border border-[#7cb342]/30";
      default: return "text-gray-400 bg-gray-400/10 border border-gray-400/30";
    }
  };

  const getSourceBadge = (source: string) => {
    const badges = {
      'freeCodeCamp': { color: 'bg-green-600', text: 'freeCodeCamp' },
      'edX': { color: 'bg-blue-600', text: 'edX' },
      'coursera': { color: 'bg-blue-500', text: 'Coursera' },
      'udemy': { color: 'bg-purple-600', text: 'Udemy' },
      'internal': { color: 'bg-gradient-to-r from-[#c0fe72] to-[#9cd052]', text: 'PrepifyAI' }
    };
    
    const badge = badges[source as keyof typeof badges] || badges.internal;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold text-black ${badge.color} shadow-lg`}>
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
    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 hover:border-[#c0fe72]/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 group shadow-xl shadow-[#c0fe72]/10 hover:shadow-[#c0fe72]/20 hover:scale-[1.02]">
      {/* Header with source badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="text-4xl sm:text-5xl">{course.image}</div>
        {getSourceBadge(course.source)}
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
          <span className="text-gray-400 text-xs sm:text-sm font-semibold">{course.category}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#c0fe72] transition-colors line-clamp-2">
          {course.title}
        </h3>

        {course.instructor && (
          <p className="text-[#9cd052] text-sm font-semibold flex items-center gap-1">
            <span>👨‍🏫</span>
            <span>by {course.instructor}</span>
          </p>
        )}

        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* Rating and Students */}
        {(course.rating || course.students) && (
          <div className="flex items-center gap-4 text-sm">
            {course.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-white font-semibold">{course.rating}</span>
              </div>
            )}
            {course.students && (
              <div className="flex items-center gap-1">
                <span className="text-[#c0fe72]">👥</span>
                <span className="text-gray-300">{formatStudentCount(course.students)} students</span>
              </div>
            )}
          </div>
        )}

        {/* Course Details */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300 flex items-center gap-1">
            <span className="text-[#9cd052]">⏱️</span>
            <span>{course.duration}</span>
          </span>
          <span className="text-gray-300 flex items-center gap-1">
            <span className="text-[#9cd052]">📚</span>
            <span>{course.lessons} lessons</span>
          </span>
        </div>

        {/* Price */}
        {course.price && (
          <div className="text-lg font-bold text-[#c0fe72]">
            {course.price}
          </div>
        )}

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#c0fe72]/10 text-[#c0fe72] text-xs rounded-lg font-semibold border border-[#c0fe72]/30"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-gray-400 text-xs font-semibold">+{course.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {course.url ? (
            <Button 
              className="flex-1 bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold hover:shadow-lg hover:shadow-[#c0fe72]/40 border-0" 
              onClick={() => window.open(course.url, '_blank')}
            >
              View Course
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold hover:shadow-lg hover:shadow-[#c0fe72]/40 border-0" 
              onClick={() => onEnroll?.(course.id)}
            >
              Start Course
            </Button>
          )}
          <Button 
            className="px-3 bg-gray-800/50 border-[#c0fe72]/30 hover:bg-gray-700 hover:border-[#c0fe72]/50 text-xl"
            size="sm"
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
