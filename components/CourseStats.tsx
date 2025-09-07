import React from 'react';

interface CourseStatsProps {
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  categoryCounts: Record<string, number>;
}

const CourseStats: React.FC<CourseStatsProps> = ({
  totalCourses,
  totalStudents,
  averageRating,
  categoryCounts
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="bg-gradient-to-r from-dark-200 to-dark-300 rounded-lg p-6 border border-dark-300">
      <h2 className="text-2xl font-bold text-primary-100 mb-6 text-center">Course Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-200">{totalCourses}</div>
          <div className="text-light-400 text-sm">Total Courses</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{formatNumber(totalStudents)}</div>
          <div className="text-light-400 text-sm">Students Enrolled</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">{averageRating.toFixed(1)}</div>
          <div className="text-light-400 text-sm">Avg Rating</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{topCategories.length}</div>
          <div className="text-light-400 text-sm">Categories</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary-100 mb-3">Popular Categories</h3>
        {topCategories.map(([category, count]) => (
          <div key={category} className="flex justify-between items-center">
            <span className="text-light-300">{category}</span>
            <span className="text-primary-200 font-medium">{count} courses</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseStats;
