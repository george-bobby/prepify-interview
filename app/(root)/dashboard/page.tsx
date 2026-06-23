import React from 'react';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getDashboardStats, getUserProgress } from '@/lib/actions/general.action';

import { interviewService } from '@/lib/firebase/interview-service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    // Fetch data using both old and new services for comprehensive dashboard
    const [dashboardStats, userProgress, interviewStats] = await Promise.all([
        getDashboardStats(user.id),
        getUserProgress(user.id),
        interviewService.getUserInterviewStats(user.id)
    ]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-success-100';
        if (score >= 60) return 'text-primary-200';
        return 'text-destructive-100';
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Expert': return 'text-success-100';
            case 'Advanced': return 'text-primary-100';
            case 'Intermediate': return 'text-primary-200';
            default: return 'text-light-400';
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 right-10 w-64 h-64 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#9cd052]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-[#7cb342]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Welcome Section */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-4 md:p-6 shadow-2xl shadow-[#c0fe72]/20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#c0fe72]/5 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#9cd052]/5 rounded-full blur-2xl"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center border border-[#c0fe72]/30">
                            <span className="text-2xl md:text-3xl">👋</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-[#c0fe72]">
                            Welcome back, {user.name}!
                        </h1>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base ml-0 md:ml-14">
                        Ready to ace your next interview? Let's get you prepared.
                    </p>
                    {interviewStats.averageScore > 0 && (
                        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 ml-0 md:ml-14">
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#c0fe72]/10 rounded-xl border border-[#c0fe72]/30">
                                <span className="text-gray-300 text-sm">Overall Score:</span>
                                <span className={`text-base md:text-lg font-bold ${getScoreColor(interviewStats.averageScore)}`}>
                                    {interviewStats.averageScore}/100
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#9cd052]/10 rounded-xl border border-[#9cd052]/30">
                                <span className="text-gray-300 text-sm">Interviews:</span>
                                <span className="text-base font-semibold text-[#9cd052]">
                                    {interviewStats.completed} completed
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-3 md:p-4 shadow-lg shadow-[#c0fe72]/10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#c0fe72]/5 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-[#c0fe72]/20 rounded-lg flex items-center justify-center border border-[#c0fe72]/30">
                                <svg className="w-4 h-4 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-[#c0fe72] font-bold text-xs md:text-sm">Credits</h3>
                        </div>
                        <p className={`text-xl md:text-3xl font-bold text-white mb-1 ${user.isProSubscriber ? 'text-[1.2rem]' : ''}`}>{user.isProSubscriber ? 'Unlimited' : (user.credits || 0)}</p>
                        <p className="text-gray-400 text-xs">Available credits</p>
                    </div>
                </div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#9cd052]/30 rounded-2xl p-3 md:p-4 shadow-lg shadow-[#9cd052]/10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#9cd052]/5 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-[#9cd052]/20 rounded-lg flex items-center justify-center border border-[#9cd052]/30">
                                <svg className="w-4 h-4 text-[#9cd052]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-[#9cd052] font-bold text-xs md:text-sm">Total</h3>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-white mb-1">{interviewStats.total}</p>
                        <p className="text-gray-400 text-xs">{interviewStats.completed} done, {interviewStats.inProgress} pending</p>
                    </div>
                </div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#7cb342]/30 rounded-2xl p-3 md:p-4 shadow-lg shadow-[#7cb342]/10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#7cb342]/5 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-[#7cb342]/20 rounded-lg flex items-center justify-center border border-[#7cb342]/30">
                                <svg className="w-4 h-4 text-[#7cb342]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-[#7cb342] font-bold text-xs md:text-sm">This Month</h3>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-white mb-1">{dashboardStats.thisMonthInterviews}</p>
                        <p className="text-gray-400 text-xs">Interviews done</p>
                    </div>
                </div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-3 md:p-4 shadow-lg shadow-[#c0fe72]/10 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#c0fe72]/5 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-[#c0fe72]/20 rounded-lg flex items-center justify-center border border-[#c0fe72]/30">
                                <svg className="w-4 h-4 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <h3 className="text-[#c0fe72] font-bold text-xs md:text-sm">Avg Score</h3>
                        </div>
                        <p className={`text-2xl md:text-3xl font-bold mb-1 ${getScoreColor(interviewStats.averageScore)}`}>
                            {interviewStats.averageScore > 0 ? `${interviewStats.averageScore}` : '-'}
                        </p>
                        <p className="text-gray-400 text-xs">Overall performance</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <Link href="/interviews">
                    <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-3 md:p-4 shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center mb-3 border border-[#c0fe72]/30">
                            <svg className="w-5 h-5 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-[#c0fe72] font-bold mb-1 text-sm">Start Interview</h3>
                        <p className="text-gray-400 text-xs">Practice with AI interviewer</p>
                    </div>
                </Link>

                <Link href="/courses">
                    <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#9cd052]/30 rounded-2xl p-3 md:p-4 shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#9cd052]/20 to-[#7cb342]/20 rounded-xl flex items-center justify-center mb-3 border border-[#9cd052]/30">
                            <svg className="w-5 h-5 text-[#9cd052]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-[#9cd052] font-bold mb-1 text-sm">Browse Courses</h3>
                        <p className="text-gray-400 text-xs">Learn interview skills</p>
                    </div>
                </Link>

                <Link href="/roadmaps">
                    <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#7cb342]/30 rounded-2xl p-3 md:p-4 shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#7cb342]/20 to-[#689f38]/20 rounded-xl flex items-center justify-center mb-3 border border-[#7cb342]/30">
                            <svg className="w-5 h-5 text-[#7cb342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <h3 className="text-[#7cb342] font-bold mb-1 text-sm">Learning Paths</h3>
                        <p className="text-gray-400 text-xs">Structured roadmaps</p>
                    </div>
                </Link>

                <Link href="/resume">
                    <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-3 md:p-4 shadow-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center mb-3 border border-[#c0fe72]/30">
                            <svg className="w-5 h-5 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-[#c0fe72] font-bold mb-1 text-sm">Resume Feedback</h3>
                        <p className="text-gray-400 text-xs">AI-powered analysis</p>
                    </div>
                </Link>
            </div>

            {/* Progress Tracking */}
            {userProgress.overallProgress > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                    {/* Skill Breakdown */}
                    <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-4 md:p-5 shadow-lg overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c0fe72]/5 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3 md:mb-4">
                                <div className="w-8 h-8 bg-[#c0fe72]/20 rounded-lg flex items-center justify-center border border-[#c0fe72]/30">
                                    <svg className="w-4 h-4 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                                <h3 className="text-[#c0fe72] font-bold text-base md:text-lg">Skill Breakdown</h3>
                            </div>
                            <div className="space-y-3">
                                {Object.entries(userProgress.skillBreakdown).map(([skill, score]) => (
                                    <div key={skill} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300 text-sm font-medium">{skill}</span>
                                            <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                                                {score}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${score >= 80 ? 'bg-[#c0fe72]' :
                                                    score >= 60 ? 'bg-[#9cd052]' : 'bg-[#7cb342]'
                                                    }`}
                                                style={{ width: `${score}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#9cd052]/30 rounded-2xl p-4 md:p-5 shadow-lg overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#9cd052]/5 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3 md:mb-4">
                                <div className="w-8 h-8 bg-[#9cd052]/20 rounded-lg flex items-center justify-center border border-[#9cd052]/30">
                                    <svg className="w-4 h-4 text-[#9cd052]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-[#9cd052] font-bold text-base md:text-lg">Performance Insights</h3>
                            </div>
                            <div className="space-y-4">
                                {/* Strengths */}
                                {userProgress.strengths.length > 0 && (
                                    <div>
                                        <h4 className="text-[#c0fe72] font-bold mb-2 text-sm flex items-center gap-2">
                                            <span>✅</span> Your Strengths
                                        </h4>
                                        <div className="space-y-2">
                                            {userProgress.strengths.map((strength, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-[#c0fe72]/5 rounded-lg p-2 border border-[#c0fe72]/20">
                                                    <div className="w-1.5 h-1.5 bg-[#c0fe72] rounded-full flex-shrink-0"></div>
                                                    <span className="text-gray-300 text-sm">{strength}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Areas for Improvement */}
                                {userProgress.improvementAreas.length > 0 && (
                                    <div>
                                        <h4 className="text-[#9cd052] font-bold mb-2 text-sm flex items-center gap-2">
                                            <span>🎯</span> Focus Areas
                                        </h4>
                                        <div className="space-y-2">
                                            {userProgress.improvementAreas.map((area, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-[#9cd052]/5 rounded-lg p-2 border border-[#9cd052]/20">
                                                    <div className="w-1.5 h-1.5 bg-[#9cd052] rounded-full flex-shrink-0"></div>
                                                    <span className="text-gray-300 text-sm">{area}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Trends */}
            {dashboardStats.monthlyStats.length > 0 && (
                <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#7cb342]/30 rounded-2xl p-4 md:p-5 shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#7cb342]/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <div className="w-8 h-8 bg-[#7cb342]/20 rounded-lg flex items-center justify-center border border-[#7cb342]/30">
                                <svg className="w-4 h-4 text-[#7cb342]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-[#7cb342] font-bold text-base md:text-lg">Performance Trends</h3>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-3">
                            {dashboardStats.monthlyStats.map((stat, index) => (
                                <div key={index} className="text-center bg-white/5 rounded-xl p-2 md:p-3 border border-gray-700">
                                    <div className="text-gray-400 text-xs mb-1">{stat.month}</div>
                                    <div className="text-[#c0fe72] font-bold text-sm md:text-base mb-1">{stat.interviews}</div>
                                    <div className="text-xs text-gray-500">interviews</div>
                                    {stat.averageScore > 0 && (
                                        <div className={`text-xs font-semibold ${getScoreColor(stat.averageScore)} mt-1`}>
                                            {stat.averageScore}%
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-4 md:p-5 shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-[#c0fe72]/5 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <div className="w-8 h-8 bg-[#c0fe72]/20 rounded-lg flex items-center justify-center border border-[#c0fe72]/30">
                            <svg className="w-4 h-4 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-[#c0fe72] font-bold text-base md:text-lg">Recent Activity</h3>
                    </div>
                    {dashboardStats.recentInterviews.length > 0 ? (
                        <div className="space-y-2 md:space-y-3">
                            {dashboardStats.recentInterviews.map((interview) => (
                                <div key={interview.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white/5 rounded-xl border border-gray-700">
                                    <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#c0fe72]/30">
                                            <svg className="w-4 h-4 md:w-5 md:h-5 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-bold text-sm md:text-base truncate">{interview.role}</h4>
                                            <p className="text-gray-400 text-xs truncate">
                                                {interview.type} • {interview.level} • {interview.techstack.join(', ')}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {new Date(interview.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap border ${interview.finalized
                                            ? 'bg-[#c0fe72]/10 text-[#c0fe72] border-[#c0fe72]/30'
                                            : 'bg-[#9cd052]/10 text-[#9cd052] border-[#9cd052]/30'
                                            }`}>
                                            {interview.finalized ? '✅ Completed' : '⏳ In Progress'}
                                        </span>
                                        {interview.finalized && (
                                            <Button asChild size="sm" className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-semibold shadow-lg">
                                                <Link href={`/interviews/${interview.id}/feedback`}>👁️ View</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 md:py-8">
                            <div className="text-5xl mb-3">🚀</div>
                            <p className="text-gray-400 mb-4 text-sm md:text-base">No recent activity yet</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                <Button asChild className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold shadow-lg">
                                    <Link href="/interviews">Start Your First Interview</Link>
                                </Button>
                                <Button asChild className="bg-white/5 border-2 border-gray-700 text-gray-300 font-semibold">
                                    <Link href="/interviews/history">View History</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Performance Insights */}
            {interviewStats.completed > 0 && (
                <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#9cd052]/30 rounded-2xl p-4 md:p-5 shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#9cd052]/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <div className="w-8 h-8 bg-[#9cd052]/20 rounded-lg flex items-center justify-center border border-[#9cd052]/30">
                                <svg className="w-4 h-4 text-[#9cd052]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                            </div>
                            <h3 className="text-[#9cd052] font-bold text-base md:text-lg">Performance Insights</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-3">
                                <h4 className="text-[#c0fe72] font-bold text-sm flex items-center gap-2">
                                    <span>📊</span> Quick Stats
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center bg-white/5 rounded-lg p-2 border border-gray-700">
                                        <span className="text-gray-300 text-sm">Completion Rate</span>
                                        <span className="text-[#c0fe72] font-bold text-sm">
                                            {Math.round((interviewStats.completed / interviewStats.total) * 100)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 rounded-lg p-2 border border-gray-700">
                                        <span className="text-gray-300 text-sm">Best Score</span>
                                        <span className="text-[#9cd052] font-bold text-sm">
                                            {Math.max(...dashboardStats.recentInterviews
                                                .filter(i => i.finalScore)
                                                .map(i => i.finalScore || 0), 0) || '-'}/100
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[#c0fe72] font-bold text-sm flex items-center gap-2">
                                    <span>💡</span> Recommendations
                                </h4>
                                <div className="space-y-2">
                                    {interviewStats.averageScore < 70 && (
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                                            <p className="text-yellow-400 text-xs font-medium">
                                                💡 Focus on improving your interview skills with more practice.
                                            </p>
                                        </div>
                                    )}
                                    {interviewStats.inProgress > 0 && (
                                        <div className="bg-[#9cd052]/10 border border-[#9cd052]/30 rounded-lg p-2">
                                            <p className="text-[#9cd052] text-xs font-medium">
                                                🎯 Complete your {interviewStats.inProgress} in-progress interview{interviewStats.inProgress !== 1 ? 's' : ''}.
                                            </p>
                                        </div>
                                    )}
                                    {interviewStats.averageScore >= 80 && (
                                        <div className="bg-[#c0fe72]/10 border border-[#c0fe72]/30 rounded-lg p-2">
                                            <p className="text-[#c0fe72] text-xs font-medium">
                                                🌟 Excellent performance! Keep up the great work!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
