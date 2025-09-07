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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200 mx-auto"></div>
          <p className="text-light-400">Loading amazing courses for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary-100">Interview Preparation Courses</h1>
        <p className="text-light-400 text-lg max-w-2xl mx-auto">
          Master every aspect of the interview process with our comprehensive courses from top educational platforms.
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="Search courses, skills, or topics..."
        isLoading={isSearching}
      />


      {/* Featured Courses Section */}
      {!searchQuery && featuredCourses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary-100">⭐ Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h2 className="text-2xl font-bold text-primary-100">🔥 Trending Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="rounded-full"
            onClick={() => handleCategoryChange(category)}
            disabled={isLoading}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-primary-100">
            Search Results for "{searchQuery}"
          </h2>
          <p className="text-light-400">Found {courses.length} courses</p>
        </div>
      )}

      {/* Courses Grid */}
      <div className="space-y-4">
        {!searchQuery && (
          <h2 className="text-2xl font-bold text-primary-100">
            {selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}
          </h2>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-dark-200 border border-dark-300 rounded-lg p-6 animate-pulse">
                <div className="h-12 bg-dark-300 rounded mb-4"></div>
                <div className="h-4 bg-dark-300 rounded mb-2"></div>
                <div className="h-4 bg-dark-300 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-dark-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-primary-100 mb-2">
              {searchQuery ? 'No courses found' : 'No courses available'}
            </h3>
            <p className="text-light-400 mb-4">
              {searchQuery 
                ? `Try adjusting your search terms or browse all courses.`
                : `Check back later for new courses in this category.`
              }
            </p>
            {searchQuery && (
              <Button onClick={() => handleSearch('')} variant="outline">
                View All Courses
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-200/10 to-primary-100/10 rounded-lg p-8 border border-primary-200/20 text-center">
        <h2 className="text-2xl font-bold text-primary-100 mb-2">Ready to Start Your Journey?</h2>
        <p className="text-light-400 mb-4">
          Join thousands of students who have successfully landed their dream jobs with our courses.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Browse More Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
