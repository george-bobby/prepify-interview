"use client";

import React, { useState, useEffect } from 'react';
import { 
    fetchLeetCodeProblems, 
    fetchDailyChallenge, 
    fetchRandomProblem, 
    fetchProblemsByDifficulty,
    searchProblems,
    getLeetCodeProblemUrl,
    LeetCodeProblem, 
    DailyChallenge 
} from '@/lib/actions/leetcode.action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CodingProblems = () => {
    const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
    const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const [currentView, setCurrentView] = useState<'all' | 'daily' | 'random'>('all');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [problemsData, dailyData] = await Promise.all([
                fetchLeetCodeProblems(50),
                fetchDailyChallenge()
            ]);
            
            setProblems(problemsData.problems);
            setDailyChallenge(dailyData);
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadInitialData();
            return;
        }

        try {
            setLoading(true);
            const searchResults = await searchProblems(searchQuery);
            setProblems(searchResults);
            setCurrentView('all');
        } catch (error) {
            console.error('Error searching problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDifficultyFilter = async (difficulty: 'All' | 'Easy' | 'Medium' | 'Hard') => {
        setSelectedDifficulty(difficulty);
        
        if (difficulty === 'All') {
            loadInitialData();
            return;
        }

        try {
            setLoading(true);
            const filteredProblems = await fetchProblemsByDifficulty(difficulty, 30);
            setProblems(filteredProblems);
            setCurrentView('all');
        } catch (error) {
            console.error('Error filtering problems:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRandomProblem = async () => {
        try {
            setLoading(true);
            const randomProblem = await fetchRandomProblem();
            setProblems([randomProblem]);
            setCurrentView('random');
        } catch (error) {
            console.error('Error fetching random problem:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Medium':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Hard':
                return 'text-red-400 bg-red-400/10 border-red-400/20';
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const ProblemCard = ({ problem }: { problem: LeetCodeProblem }) => (
        <div className="bg-dark-200 rounded-lg p-6 border border-dark-300 hover:border-primary-200/30 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-light-100 mb-2 hover:text-primary-200 transition-colors">
                        {problem.id}. {problem.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                        </span>
                        <span className="text-light-300 text-sm">
                            Acceptance: {problem.acceptance}
                        </span>
                        <div className="flex items-center gap-2 text-light-300 text-sm">
                            <span className="text-green-400">👍 {problem.likes}</span>
                            <span className="text-red-400">👎 {problem.dislikes}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {problem.topicTags && problem.topicTags.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {problem.topicTags.slice(0, 5).map((tag, index) => (
                            <span 
                                key={index}
                                className="px-2 py-1 bg-primary-100/10 text-primary-200 text-xs rounded border border-primary-200/20"
                            >
                                {tag}
                            </span>
                        ))}
                        {problem.topicTags.length > 5 && (
                            <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded">
                                +{problem.topicTags.length - 5} more
                            </span>
                        )}
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center">
                <Button
                    onClick={() => window.open(getLeetCodeProblemUrl(problem.titleSlug), '_blank')}
                    className="bg-primary-200 hover:bg-primary-100 text-dark-100 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    Solve on LeetCode →
                </Button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Daily Challenge Section */}
            {dailyChallenge && currentView !== 'random' && (
                <div className="bg-gradient-to-r from-primary-200/10 to-primary-100/10 rounded-lg p-6 border border-primary-200/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                            <span className="text-dark-100 font-bold text-lg">🏆</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-light-100">Daily Challenge</h2>
                            <p className="text-light-300 text-sm">{dailyChallenge.date}</p>
                        </div>
                    </div>
                    <ProblemCard problem={dailyChallenge.problem} />
                </div>
            )}

            {/* Controls Section */}
            <div className="bg-dark-200 rounded-lg p-6 border border-dark-300">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Search */}
                    <div className="flex gap-2 flex-1 max-w-md">
                        <Input
                            type="text"
                            placeholder="Search problems..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="bg-dark-100 border-dark-300 text-light-100 placeholder-light-300"
                        />
                        <Button 
                            onClick={handleSearch}
                            className="bg-primary-200 hover:bg-primary-100 text-dark-100"
                        >
                            Search
                        </Button>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="flex gap-2">
                        {(['All', 'Easy', 'Medium', 'Hard'] as const).map((difficulty) => (
                            <Button
                                key={difficulty}
                                onClick={() => handleDifficultyFilter(difficulty)}
                                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                                className={selectedDifficulty === difficulty 
                                    ? "bg-primary-200 text-dark-100 hover:bg-primary-100" 
                                    : "border-dark-300 text-light-200 hover:bg-dark-300"
                                }
                            >
                                {difficulty}
                            </Button>
                        ))}
                    </div>

                    {/* Random Problem */}
                    <Button
                        onClick={handleRandomProblem}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                        🎲 Random Problem
                    </Button>
                </div>
            </div>

            {/* Problems Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-light-100">
                        {currentView === 'random' ? 'Random Problem' : 
                         currentView === 'daily' ? 'Daily Challenge' : 
                         `Problems (${problems.length})`}
                    </h2>
                    {currentView !== 'all' && (
                        <Button
                            onClick={() => {
                                setCurrentView('all');
                                loadInitialData();
                            }}
                            variant="outline"
                            className="border-dark-300 text-light-200 hover:bg-dark-300"
                        >
                            View All Problems
                        </Button>
                    )}
                </div>

                {problems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-light-100 mb-2">No problems found</h3>
                        <p className="text-light-300">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {problems.map((problem) => (
                            <ProblemCard key={problem.id} problem={problem} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodingProblems;
