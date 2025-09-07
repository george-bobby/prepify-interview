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
        <div className="bg-dark-300 rounded-lg p-6 border border-dark-400 hover:border-primary-300 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-light-100 font-semibold text-lg mb-2 line-clamp-2">
                        {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-light-300 text-sm mb-2 flex-wrap">
                        <span className="font-medium">{job.company}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        {job.via && (
                            <>
                                <span>•</span>
                                <span className="text-primary-200">via {job.via}</span>
                            </>
                        )}
                    </div>
                    {job.salary && (
                        <div className="text-green-400 font-medium text-sm mb-2">
                            {formatSalary(job.salary)}
                        </div>
                    )}
                    {job.employment_type && (
                        <span className="inline-block bg-primary-200/20 text-primary-200 px-2 py-1 rounded text-xs mr-2 mb-2">
                            {job.employment_type}
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
                <div className="text-light-300 text-sm mb-4 line-clamp-3">
                    {job.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </div>
            )}

            <div className="flex justify-between items-center">
                <div className="text-light-400 text-xs">
                    Job ID: {job.id.substring(0, 8)}...
                </div>
                {job.apply_link && (
                    <a
                        href={job.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-200 text-dark-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors duration-200 flex-shrink-0"
                    >
                        Apply Now
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-100">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-light-100 mb-2">
                        Job Search
                    </h1>
                    <p className="text-light-200">
                        Find your dream job with our comprehensive job search platform powered by SerpAPI
                    </p>
                    {apiConfigured === false && (
                        <div className="mt-4 text-sm text-light-400 bg-dark-200 p-3 rounded-lg">
                            <p className="mb-2">
                                <strong>Setup Required:</strong> To use job search functionality, add your SerpAPI key to environment variables:
                            </p>
                            <code className="text-primary-200 bg-dark-300 px-2 py-1 rounded text-xs">
                                SERPAPI_API_KEY=your_serpapi_key_here
                            </code>
                            <p className="mt-2">
                                Get your free API key at: <a href="https://serpapi.com" target="_blank" className="text-primary-200 hover:underline">serpapi.com</a>
                            </p>
                        </div>
                    )}
                </div>

                {/* Search Section */}
                <div className="bg-dark-200 rounded-lg p-6 mb-8">
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
                                className="w-full bg-primary-200 text-dark-100 px-6 py-3 rounded-lg font-semibold hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isLoading ? 'Searching...' : apiConfigured === false ? 'API Setup Required' : 'Search Jobs'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-dark-200 rounded-lg p-6 mb-8">
                    <h3 className="text-light-100 font-semibold mb-4">Filters</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-light-200 text-sm font-medium mb-2">
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
                <div className="bg-dark-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-light-100 font-semibold">Job Results</h3>
                        <span className="text-light-300 text-sm">
                            {jobs.length} jobs found
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200 mx-auto mb-4"></div>
                            <p className="text-light-300">Searching for jobs...</p>
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
                            <h3 className="text-light-100 text-xl mb-2">No Jobs Found</h3>
                            <p className="text-light-300 mb-4">
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
