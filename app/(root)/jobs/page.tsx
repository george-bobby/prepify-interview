'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import AutocompleteInput from '@/components/AutocompleteInput';

const JobsPage = () => {
    const [searchParams, setSearchParams] = useState({
        query: '',
        location: '',
        jobType: '',
        experienceLevel: '',
        datePosted: '',
        salaryRange: ''
    });
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);

    // Check if SerpAPI is configured on component mount
    useEffect(() => {
        const checkApiConfig = async () => {
            try {
                const response = await fetch('/api/jobs/config');
                const data = await response.json();
                setApiConfigured(data.configured);
            } catch (error) {
                console.error('Error checking API configuration:', error);
                setApiConfigured(false);
            }
        };

        checkApiConfig();
    }, []);

    const handleInputChange = useCallback((field: string, value: string) => {
        setSearchParams(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const searchJobs = async () => {
        if (!searchParams.query.trim()) {
            toast.error('Please enter a job title to search');
            return;
        }

        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            Object.entries(searchParams).forEach(([key, value]) => {
                if (value.trim()) {
                    queryParams.append(key === 'query' ? 'q' : key, value);
                }
            });

            const response = await fetch(`/api/jobs/search?${queryParams}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to search jobs');
            }

            setJobs(data.jobs);
            setHasSearched(true);

            if (data.cached) {
                toast.success(`Found ${data.jobs.length} cached jobs`);
            } else {
                toast.success(`Found ${data.jobs.length} jobs`);
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to search jobs');
            setJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            searchJobs();
        }
    };

    const formatSalary = (salary: string | undefined) => {
        if (!salary) return null;
        return salary.replace(/\s+/g, ' ').trim();
    };

    const getTimeAgo = (dateString: string | undefined) => {
        if (!dateString) return '';

        // Try to parse various date formats
        let date: Date;
        try {
            // Handle relative dates like "3 days ago"
            if (dateString.includes('ago')) {
                return dateString;
            }
            date = new Date(dateString);
        } catch {
            return dateString;
        }

        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return '1 day ago';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return `${Math.floor(diffInDays / 30)} months ago`;
    };

    const JobCard = ({ job }: { job: Job }) => (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-[#c0fe72]/30 hover:border-[#c0fe72]/50 hover:shadow-lg hover:shadow-[#c0fe72]/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                        {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <span className="font-medium">{job.company}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        {job.via && (
                            <>
                                <span>•</span>
                                <span className="text-[#c0fe72]">via {job.via}</span>
                            </>
                        )}
                    </div>
                    {job.salary && (
                        <div className="text-[#c0fe72] font-bold text-sm mb-2 bg-[#c0fe72]/10 px-2 py-1 rounded inline-block">
                            💰 {formatSalary(job.salary)}
                        </div>
                    )}
                    {job.employment_type && (
                        <span className="inline-block bg-[#c0fe72]/20 text-[#c0fe72] border border-[#c0fe72]/30 px-2 py-1 rounded text-xs font-semibold mr-2 mb-2">\n                            {job.employment_type}
                        </span>
                    )}
                    {job.posted_at && (
                        <div className="text-light-400 text-xs">
                            {getTimeAgo(job.posted_at)}
                        </div>
                    )}
                </div>
                {job.thumbnail && (
                    <img
                        src={job.thumbnail}
                        alt={`${job.company} logo`}
                        className="w-12 h-12 rounded-lg object-cover ml-4 flex-shrink-0"
                    />
                )}
            </div>

            {job.description && (
                <div className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {job.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </div>
            )}

            <div className="flex justify-between items-center">
                <div className="text-gray-500 text-xs">
                    Job ID: {job.id.substring(0, 8)}...
                </div>
                {job.apply_link && (
                    <a
                        href={job.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-[#c0fe72]/30 transition-all duration-200 flex-shrink-0"
                    >
                        🚀 Apply Now
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#9cd052]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#7cb342]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            
            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="mb-8 bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-8 shadow-2xl shadow-[#c0fe72]/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 bg-[#c0fe72]/10 border border-[#c0fe72]/30 rounded-full px-4 py-2">
                                <span className="text-[#c0fe72]">⭐</span>
                                <span className="text-[#c0fe72] font-bold text-sm uppercase tracking-wide">AI-Powered Job Search</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                <span className="text-white">Find Your Dream Job with </span>
                                <span className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">AI Precision</span>
                            </h1>
                            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl">
                                Discover opportunities from top companies, get personalized recommendations, and apply with confidence
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-[#c0fe72]">✓</span>
                                    <span>Real-time Listings</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-[#c0fe72]">✓</span>
                                    <span>Smart Filters</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-[#c0fe72]">✓</span>
                                    <span>Salary Insights</span>
                                </div>
                            </div>
                            {apiConfigured === false && (
                                <div className="mt-4 text-sm text-gray-300 bg-gradient-to-r from-[#c0fe72]/10 to-[#9cd052]/10 border border-[#c0fe72]/30 p-4 rounded-xl">
                                    <p className="mb-2 font-semibold">
                                        <span className="text-[#c0fe72]">⚙️ Setup Required:</span> To use job search functionality, add your SerpAPI key to environment variables:
                                    </p>
                                    <code className="text-[#c0fe72] bg-black/50 px-3 py-1.5 rounded text-xs font-mono border border-[#c0fe72]/20">
                                        SERPAPI_API_KEY=your_serpapi_key_here
                                    </code>
                                    <p className="mt-2">
                                        Get your free API key at: <a href="https://serpapi.com" target="_blank" className="text-[#c0fe72] hover:text-[#9cd052] font-semibold underline">serpapi.com</a>
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* Animated Briefcase Stack */}
                        <div className="hidden md:block relative w-64 h-64 flex-shrink-0">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-48 h-48">
                                    {/* Outer glow rings */}
                                    <div className="absolute inset-0 rounded-full bg-[#c0fe72]/5 animate-pulse"></div>
                                    <div className="absolute inset-4 rounded-full bg-[#9cd052]/5 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                    <div className="absolute inset-8 rounded-full bg-[#7cb342]/5 animate-pulse" style={{animationDelay: '1s'}}></div>
                                    
                                    {/* Briefcase stack */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            {/* Bottom briefcase */}
                                            <div className="w-24 h-16 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/30 rounded-lg border-2 border-[#c0fe72]/40 relative mb-2 transform hover:scale-110 transition-transform">
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-[#c0fe72]/60 rounded"></div>
                                                <div className="absolute top-2 left-2 right-2 h-1 bg-[#c0fe72]/30 rounded"></div>
                                            </div>
                                            {/* Middle briefcase */}
                                            <div className="w-24 h-16 bg-gradient-to-br from-[#9cd052]/20 to-[#7cb342]/30 rounded-lg border-2 border-[#9cd052]/40 relative mb-2 transform hover:scale-110 transition-transform" style={{animationDelay: '0.3s'}}>
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-[#9cd052]/60 rounded"></div>
                                                <div className="absolute top-2 left-2 right-2 h-1 bg-[#9cd052]/30 rounded"></div>
                                            </div>
                                            {/* Top briefcase with bounce animation */}
                                            <div className="w-24 h-16 bg-gradient-to-br from-[#7cb342]/20 to-[#c0fe72]/30 rounded-lg border-2 border-[#7cb342]/40 relative animate-bounce">
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-[#7cb342]/60 rounded"></div>
                                                <div className="absolute top-2 left-2 right-2 h-1 bg-[#7cb342]/30 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-6 mb-8 shadow-xl shadow-[#c0fe72]/10">
                    <div className="grid md:grid-cols-3 gap-4">
                        <AutocompleteInput
                            value={searchParams.query}
                            onChange={(value) => handleInputChange('query', value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g. Software Engineer, Product Manager"
                            label="Job Title"
                            apiEndpoint="/api/jobs/suggestions/titles"
                            required={true}
                        />
                        <AutocompleteInput
                            value={searchParams.location}
                            onChange={(value) => handleInputChange('location', value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g. San Francisco, CA"
                            label="Location"
                            apiEndpoint="/api/jobs/suggestions/locations"
                        />
                        <div className="flex items-end">
                            <button
                                onClick={searchJobs}
                                disabled={isLoading || !searchParams.query.trim() || apiConfigured === false}
                                className="w-full bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-[#c0fe72]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? '🔍 Searching...' : apiConfigured === false ? '⚙️ API Setup Required' : '🚀 Search Jobs'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#9cd052]/30 rounded-3xl p-6 mb-8 shadow-xl shadow-[#9cd052]/10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🎛️</span>
                        <h3 className="text-[#9cd052] font-bold text-lg">Filters</h3>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2">
                                Job Type
                            </label>
                            <select
                                value={searchParams.jobType}
                                onChange={(e) => handleInputChange('jobType', e.target.value)}
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-light-100 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200"
                            >
                                <option value="">All Types</option>
                                <option value="FULLTIME">Full Time</option>
                                <option value="PARTTIME">Part Time</option>
                                <option value="CONTRACTOR">Contract</option>
                                <option value="INTERN">Internship</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-light-200 text-sm font-medium mb-2">
                                Experience Level
                            </label>
                            <select
                                value={searchParams.experienceLevel}
                                onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-light-100 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200"
                            >
                                <option value="">All Levels</option>
                                <option value="entry_level">Entry Level</option>
                                <option value="mid_level">Mid Level</option>
                                <option value="senior_level">Senior Level</option>
                                <option value="executive">Executive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-light-200 text-sm font-medium mb-2">
                                Salary Range
                            </label>
                            <select
                                value={searchParams.salaryRange}
                                onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-light-100 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200"
                            >
                                <option value="">Any Salary</option>
                                <option value="0-50000">$0 - $50K</option>
                                <option value="50000-100000">$50K - $100K</option>
                                <option value="100000-150000">$100K - $150K</option>
                                <option value="150000+">$150K+</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-light-200 text-sm font-medium mb-2">
                                Date Posted
                            </label>
                            <select
                                value={searchParams.datePosted}
                                onChange={(e) => handleInputChange('datePosted', e.target.value)}
                                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-light-100 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200"
                            >
                                <option value="">Any Time</option>
                                <option value="today">Today</option>
                                <option value="3days">Last 3 days</option>
                                <option value="week">Last week</option>
                                <option value="month">Last month</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#7cb342]/30 rounded-3xl p-6 shadow-xl shadow-[#7cb342]/10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📋</span>
                            <h3 className="text-[#7cb342] font-bold text-lg">Job Results</h3>
                        </div>
                        <span className="text-[#c0fe72] text-sm font-semibold bg-[#c0fe72]/10 px-3 py-1 rounded-full border border-[#c0fe72]/30">
                            {jobs.length} jobs found
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c0fe72] mx-auto mb-4"></div>
                            <p className="text-gray-300">🔍 Searching for jobs...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    ) : hasSearched ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">😔</div>
                            <h3 className="text-white font-bold text-xl mb-2">No Jobs Found</h3>
                            <p className="text-gray-300 mb-4">
                                Try adjusting your search terms or filters to find more results
                            </p>
                            <div className="text-light-400 text-sm">
                                <p>Search tips:</p>
                                <ul className="mt-2 space-y-1">
                                    <li>• Try broader job titles (e.g., "developer" instead of "senior full-stack developer")</li>
                                    <li>• Check spelling and try variations</li>
                                    <li>• Use different location formats (city, state vs. city only)</li>
                                    <li>• Remove filters to see more results</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-light-100 text-xl mb-2">Start Your Job Search</h3>
                            <p className="text-light-300">
                                Enter a job title and location to find available positions
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobsPage;
