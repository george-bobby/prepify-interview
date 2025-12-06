"use client";

import React, { useState, useEffect } from 'react';
import {
    fetchDailyChallenge,
    fetchRandomProblem,
    getCompanyQuestions,
    LeetCodeProblem,
    DailyChallenge,
    CompanyQuestions
} from '@/lib/actions/leetcode.action';
import { getLeetCodeProblemUrl } from '@/lib/leetcode-utils';
import { getCompanyLogo } from '@/lib/company-utils';
import { Button } from '@/components/ui/button';

const CodingProblems = () => {
    const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
    const [randomProblem, setRandomProblem] = useState<LeetCodeProblem | null>(null);
    const [companyQuestions, setCompanyQuestions] = useState<CompanyQuestions[]>([]);
    const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [dailyData, randomData, companyData] = await Promise.all([
                fetchDailyChallenge(),
                fetchRandomProblem(),
                getCompanyQuestions()
            ]);

            console.log('Daily Challenge Data:', dailyData);
            console.log('Random Problem Data:', randomData);

            setDailyChallenge(dailyData);
            setRandomProblem(randomData);
            setCompanyQuestions(companyData);
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateNewRandomProblem = async () => {
        try {
            setLoading(true);
            const newRandomProblem = await fetchRandomProblem();
            setRandomProblem(newRandomProblem);
        } catch (error) {
            console.error('Error fetching new random problem:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-[#c0fe72] bg-[#c0fe72]/20 border-[#c0fe72]/40';
            case 'Medium':
                return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/40';
            case 'Hard':
                return 'text-red-400 bg-red-400/20 border-red-400/40';
            default:
                return 'text-gray-400 bg-gray-400/20 border-gray-400/40';
        }
    };

    const ProblemCard = ({ problem }: { problem: LeetCodeProblem }) => {
        console.log('ProblemCard received:', problem);

        return (
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-5 md:p-6 border-2 border-gray-700/50 hover:border-[#c0fe72]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#c0fe72]/10 group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-base md:text-lg font-bold text-white mb-3 group-hover:text-[#c0fe72] transition-colors">
                            {problem.id}. {problem.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 ${getDifficultyColor(problem.difficulty)} w-fit shadow-lg`}>
                                {problem.difficulty}
                            </span>
                            <span className="text-gray-300 text-xs sm:text-sm font-medium">
                                ✓ {problem.acceptance}
                            </span>
                            <div className="flex items-center gap-3 text-xs sm:text-sm">
                                <span className="flex items-center gap-1 text-green-400 font-medium">👍 {problem.likes}</span>
                                <span className="flex items-center gap-1 text-red-400 font-medium">👎 {problem.dislikes}</span>
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
                                    className="px-3 py-1 bg-[#c0fe72]/10 text-[#c0fe72] text-xs rounded-lg border border-[#c0fe72]/30 font-medium hover:bg-[#c0fe72]/20 transition-colors"
                                >
                                    {tag}
                                </span>
                            ))}
                            {problem.topicTags.length > 5 && (
                                <span className="px-3 py-1 bg-gray-700/30 text-gray-400 text-xs rounded-lg border border-gray-600/30">
                                    +{problem.topicTags.length - 5} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-start items-center">
                    <Button
                        onClick={() => window.open(getLeetCodeProblemUrl(problem.titleSlug), '_blank')}
                        className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] hover:from-[#d4ff8f] hover:to-[#a8dc5f] text-black font-bold px-6 py-3 rounded-xl transition-all duration-200 text-sm md:text-base w-full sm:w-auto shadow-lg shadow-[#c0fe72]/30 hover:shadow-[#c0fe72]/50 hover:scale-[1.02]"
                    >
                        Solve on LeetCode →
                    </Button>
                </div>
            </div>
        );
    };

    const CompanyQuestionCard = ({ company }: { company: CompanyQuestions }) => {
        const isExpanded = expandedCompanies.has(company.company);
        const questionsToShow = isExpanded ? company.questions : company.questions.slice(0, 5);

        const toggleExpanded = () => {
            const newExpanded = new Set(expandedCompanies);
            if (isExpanded) {
                newExpanded.delete(company.company);
            } else {
                newExpanded.add(company.company);
            }
            setExpandedCompanies(newExpanded);
        };

        return (
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl p-5 md:p-6 border-2 border-gray-700/50 hover:border-[#c0fe72]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#c0fe72]/10 group">
                <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-white to-gray-100 p-2.5 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <img
                            src={getCompanyLogo(company.company)}
                            alt={`${company.company} logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/building.svg';
                            }}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-white truncate group-hover:text-[#c0fe72] transition-colors">{company.company}</h3>
                        <p className="text-gray-400 text-xs md:text-sm font-medium">Top Interview Questions</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {questionsToShow.map((question, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 md:p-4 bg-black/40 border border-gray-700/30 rounded-xl hover:bg-black/60 hover:border-[#c0fe72]/40 transition-all duration-200 group cursor-pointer"
                            onClick={() => window.open(question.link, '_blank')}
                        >
                            <span className="text-gray-300 group-hover:text-[#c0fe72] transition-colors font-medium text-sm">
                                {question.title}
                            </span>
                            <svg
                                className="w-5 h-5 text-gray-500 group-hover:text-[#c0fe72] transition-all duration-200 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                    ))}

                    {company.questions.length > 5 && (
                        <div className="text-center pt-3">
                            <button
                                onClick={toggleExpanded}
                                className="text-[#c0fe72] hover:text-[#d4ff8f] text-sm font-bold transition-colors px-4 py-2 rounded-lg hover:bg-[#c0fe72]/10"
                            >
                                {isExpanded ? '↑ Show Less' : `↓ +${company.questions.length - 5} more questions`}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#c0fe72] absolute top-0 left-0"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-10 relative z-10">
            {/* Daily Challenge and Random Problem Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Challenge */}
                {dailyChallenge && (
                    <div className="bg-gradient-to-br from-[#c0fe72]/10 via-black to-black rounded-2xl p-5 md:p-6 border-2 border-[#c0fe72]/30 shadow-2xl shadow-[#c0fe72]/20 hover:shadow-[#c0fe72]/30 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <span className="text-black font-bold text-2xl">🏆</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-xl md:text-2xl font-bold text-white">Daily Challenge</h2>
                                <p className="text-gray-400 text-xs md:text-sm font-medium truncate">{dailyChallenge.date}</p>
                            </div>
                        </div>
                        <ProblemCard problem={dailyChallenge.problem} />
                    </div>
                )}

                {/* Random Problem */}
                {randomProblem && (
                    <div className="bg-gradient-to-br from-purple-500/10 via-black to-black rounded-2xl p-5 md:p-6 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <span className="text-white font-bold text-2xl">🎲</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-xl md:text-2xl font-bold text-white">Random Problem</h2>
                                    <p className="text-gray-400 text-xs md:text-sm font-medium">Challenge yourself</p>
                                </div>
                            </div>
                            <Button
                                onClick={generateNewRandomProblem}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-5 py-3 rounded-xl text-sm md:text-base w-full sm:w-auto flex-shrink-0 shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-all duration-200"
                            >
                                🎲 New Random
                            </Button>
                        </div>
                        <ProblemCard problem={randomProblem} />
                    </div>
                )}
            </div>

            {/* Company Specific Questions */}
            <div>
                <div className="mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Company-Specific Questions</h2>
                    <p className="text-gray-400 font-medium">Popular coding questions asked by top tech companies</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {companyQuestions.map((company) => (
                        <CompanyQuestionCard key={company.company} company={company} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CodingProblems;
