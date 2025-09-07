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
                return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Medium':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Hard':
                return 'text-red-400 bg-red-400/10 border-red-400/20';
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const ProblemCard = ({ problem }: { problem: LeetCodeProblem }) => {
        console.log('ProblemCard received:', problem);

        return (
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
            <div className="bg-dark-200 rounded-lg p-6 border border-dark-300 hover:border-primary-200/30 transition-all duration-200">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-white p-2 flex items-center justify-center">
                        <img
                            src={getCompanyLogo(company.company)}
                            alt={`${company.company} logo`}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/building.svg';
                            }}
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-light-100">{company.company}</h3>
                        <p className="text-light-300 text-sm">Top Interview Questions</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {questionsToShow.map((question, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-dark-300/50 rounded-lg hover:bg-dark-300 transition-colors group cursor-pointer"
                            onClick={() => window.open(question.link, '_blank')}
                        >
                            <span className="text-light-200 group-hover:text-primary-200 transition-colors">
                                {question.title}
                            </span>
                            <svg
                                className="w-4 h-4 text-light-400 group-hover:text-primary-200 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                    ))}

                    {company.questions.length > 5 && (
                        <div className="text-center pt-2">
                            <button
                                onClick={toggleExpanded}
                                className="text-primary-200 hover:text-primary-100 text-sm font-medium transition-colors"
                            >
                                {isExpanded ? 'Show Less' : `+${company.questions.length - 5} more questions`}
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200"></div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Daily Challenge and Random Problem Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Challenge */}
                {dailyChallenge && (
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

                {/* Random Problem */}
                {randomProblem && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">🎲</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-light-100">Random Problem</h2>
                                    <p className="text-light-300 text-sm">Challenge yourself</p>
                                </div>
                            </div>
                            <Button
                                onClick={generateNewRandomProblem}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2"
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
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-light-100 mb-2">Company-Specific Questions</h2>
                    <p className="text-light-300">Popular coding questions asked by top tech companies</p>
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
