'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import SearchBar from '@/components/SearchBar';
import { 
  Course, 
  fetchCoursesByCategory, 
  getFeaturedCourses, 
  searchCourses,
  getTrendingCourses 
} from '@/lib/actions/courses.action';

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [trendingCourses, setTrendingCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const categories = ["All", "Technical", "Behavioral", "System Design", "Leadership", "Career", "Negotiation"];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [coursesData, featuredData, trendingData] = await Promise.all([
        fetchCoursesByCategory('All'),
        getFeaturedCourses(),
        getTrendingCourses()
      ]);

      setCourses(coursesData);
      setFeaturedCourses(featuredData);
      setTrendingCourses(trendingData);
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setIsLoading(true);
    
    try {
      const coursesData = await fetchCoursesByCategory(category);
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses by category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      handleCategoryChange(selectedCategory);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchCourses(query);
      setCourses(searchResults);
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEnroll = (courseId: string) => {
    console.log('Enrolling in course:', courseId);
  };

  if (isLoading && !courses.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-[#c0fe72] mx-auto"></div>
          <p className="text-gray-300 text-sm sm:text-base">Loading amazing courses for you... 📚</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#9cd052]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#7cb342]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#c0fe72]/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#c0fe72]/10 border border-[#c0fe72]/30 rounded-full px-4 py-2">
                <span className="text-[#c0fe72]">⭐</span>
                <span className="text-[#c0fe72] font-bold text-sm uppercase tracking-wide">Expert-Led Courses</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                <span className="text-white">Master Interview Skills with </span>
                <span className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">Top Courses</span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
                Learn from industry experts and master every aspect of the interview process with comprehensive courses
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#c0fe72]">✓</span>
                  <span>Expert Instructors</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#c0fe72]">✓</span>
                  <span>Hands-on Practice</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#c0fe72]">✓</span>
                  <span>Certificates</span>
                </div>
              </div>
            </div>
            {/* Animated Graduation Cap & Books */}
            <div className="hidden md:block relative w-64 h-64 flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Outer glow rings */}
                  <div className="absolute inset-0 rounded-full bg-[#c0fe72]/5 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-[#9cd052]/5 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute inset-8 rounded-full bg-[#7cb342]/5 animate-pulse" style={{animationDelay: '1s'}}></div>
                  
                  {/* Books Stack */}
                  <div className="absolute inset-0 flex items-end justify-center pb-12">
                    <div className="relative">
                      {/* Book 1 - Bottom */}
                      <div className="w-20 h-6 bg-gradient-to-r from-[#c0fe72]/30 to-[#9cd052]/40 rounded border-2 border-[#c0fe72]/40 mb-1 transform hover:scale-105 transition-transform"></div>
                      {/* Book 2 - Middle */}
                      <div className="w-20 h-6 bg-gradient-to-r from-[#9cd052]/30 to-[#7cb342]/40 rounded border-2 border-[#9cd052]/40 mb-1 transform hover:scale-105 transition-transform"></div>
                      {/* Book 3 - Top */}
                      <div className="w-20 h-6 bg-gradient-to-r from-[#7cb342]/30 to-[#c0fe72]/40 rounded border-2 border-[#7cb342]/40 transform hover:scale-105 transition-transform"></div>
                    </div>
                  </div>
                  
                  {/* Graduation Cap - Floating */}
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 animate-bounce" style={{animationDuration: '3s'}}>
                    <div className="relative">
                      {/* Cap top */}
                      <div className="w-24 h-2 bg-gradient-to-r from-[#c0fe72]/40 to-[#9cd052]/50 rounded border-2 border-[#c0fe72]/50 shadow-lg shadow-[#c0fe72]/30"></div>
                      {/* Cap base */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-[#c0fe72]/30 to-[#9cd052]/40 rounded-b border-2 border-[#c0fe72]/40"></div>
                      {/* Tassel */}
                      <div className="absolute -right-2 top-0 w-1 h-8 bg-[#c0fe72]/60 animate-pulse">
                        <div className="absolute bottom-0 w-3 h-3 bg-[#c0fe72]/80 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-4 sm:p-6 shadow-xl shadow-[#c0fe72]/10">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="🔍 Search courses, skills, or topics..."
            isLoading={isSearching}
          />
        </div>


        {/* Featured Courses Section */}
        {!searchQuery && featuredCourses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#c0fe72] flex items-center gap-2">
              <span>⭐</span>
              <span>Featured Courses</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          </div>
        )}

        {/* Trending Courses Section */}
        {!searchQuery && trendingCourses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#9cd052] flex items-center gap-2">
              <span>🔥</span>
              <span>Trending Now</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {trendingCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filter Categories */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-4 sm:p-6 shadow-xl shadow-[#c0fe72]/10">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                className={`rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black hover:shadow-lg hover:shadow-[#c0fe72]/40 border-0'
                    : 'bg-gray-800/50 text-gray-300 border-[#c0fe72]/20 hover:border-[#c0fe72]/40 hover:bg-gray-800'
                }`}
                onClick={() => handleCategoryChange(category)}
                disabled={isLoading}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Results Header */}
        {searchQuery && (
          <div className="text-center bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
              Search Results for "<span className="text-[#c0fe72]">{searchQuery}</span>"
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">Found <span className="text-[#c0fe72] font-bold">{courses.length}</span> courses</p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="space-y-4">
          {!searchQuery && (
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <span>📚</span>
              <span>{selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}</span>
            </h2>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-6 animate-pulse">
                  <div className="h-12 bg-gray-800 rounded mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded mb-4 w-3/4"></div>
                  <div className="h-8 bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">📚</div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#c0fe72] mb-2">
                {searchQuery ? 'No courses found' : 'No courses available'}
              </h3>
              <p className="text-gray-400 mb-6 text-sm sm:text-base">
                {searchQuery 
                  ? `Try adjusting your search terms or browse all courses.`
                  : `Check back later for new courses in this category.`
                }
              </p>
              {searchQuery && (
                <Button onClick={() => handleSearch('')} className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold hover:shadow-lg hover:shadow-[#c0fe72]/40 border-0">
                  View All Courses
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 sm:p-8 border-2 border-[#c0fe72]/30 shadow-2xl shadow-[#c0fe72]/20 text-center">
          <div className="text-4xl sm:text-5xl mb-4">🎯</div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent mb-3">Ready to Start Your Journey?</h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-2xl mx-auto">
            Join thousands of students who have successfully landed their dream jobs with our courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold hover:shadow-lg hover:shadow-[#c0fe72]/40 border-0">
              <Link href="/dashboard">← Back to Dashboard</Link>
            </Button>
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-gray-800/50 text-white border-[#c0fe72]/30 hover:bg-gray-700 hover:border-[#c0fe72]/50">
              ↑ Browse More Courses
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
