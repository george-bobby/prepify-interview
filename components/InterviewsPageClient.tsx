"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InterviewCreationModal } from '@/components/InterviewCreationModal';
import { InterviewConfig } from '@/lib/schemas/interview';
import { useRouter } from 'next/navigation';

interface InterviewsPageClientProps {
    user: any;
    userInterviews: any[];
    latestInterviews: any[];
}

export const InterviewsPageClient: React.FC<InterviewsPageClientProps> = ({
    user,
    userInterviews,
    latestInterviews,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleCreateInterview = async (config: InterviewConfig, questionCount: number) => {
        try {
            setIsCreating(true);
            setError(null);

            const response = await fetch('/api/interviews/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    config,
                    questionCount,
                    userId: user.id,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to create interview');
            }

            // Redirect to the new interview
            router.push(`/interviews/${data.interviewId}`);
        } catch (err) {
            console.error('Error creating interview:', err);
            setError(err instanceof Error ? err.message : 'Failed to create interview');
        } finally {
            setIsCreating(false);
        }
    };

    const getInterviewStats = () => {
        const completed = userInterviews.filter(interview =>
            interview.status === 'completed' || interview.feedback
        ).length;
        const inProgress = userInterviews.filter(interview =>
            interview.status === 'in_progress'
        ).length;
        const totalScore = userInterviews
            .filter(interview => interview.feedback?.totalScore)
            .reduce((sum, interview) => sum + interview.feedback.totalScore, 0);
        const avgScore = completed > 0 ? Math.round(totalScore / completed) : 0;

        return { completed, inProgress, avgScore, total: userInterviews.length };
    };

    const stats = getInterviewStats();

    return (
        <>
            {/* Statistics Section - Enhanced */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-4 md:p-6 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#c0fe72]/5 opacity-0 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-[#c0fe72]/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-gray-400 font-medium text-xs md:text-sm mb-1">Total Interviews</h3>
                        <p className="text-2xl md:text-4xl font-bold text-white">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#9cd052]/30 rounded-2xl p-4 md:p-6 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#9cd052]/5 opacity-0 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-[#9cd052]/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#9cd052]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-gray-400 font-medium text-xs md:text-sm mb-1">Completed</h3>
                        <p className="text-2xl md:text-4xl font-bold text-[#9cd052]">{stats.completed}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#7cb342]/30 rounded-2xl p-4 md:p-6 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#7cb342]/5 opacity-0 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-[#7cb342]/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#7cb342]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-gray-400 font-medium text-xs md:text-sm mb-1">In Progress</h3>
                        <p className="text-2xl md:text-4xl font-bold text-[#7cb342]">{stats.inProgress}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-4 md:p-6 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#c0fe72]/5 opacity-0 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-[#c0fe72]/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-gray-400 font-medium text-xs md:text-sm mb-1">Average Score</h3>
                        <p className="text-2xl md:text-4xl font-bold text-[#c0fe72]">{stats.avgScore}<span className="text-lg text-gray-500">/10</span></p>
                    </div>
                </div>
            </section>

            {/* Create Interview Section - Enhanced */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-[#c0fe72]/30 rounded-3xl p-6 md:p-8 shadow-xl shadow-[#c0fe72]/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#c0fe72]/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-[#c0fe72]/20 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl">✨</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white">Create New Interview</h2>
                            </div>
                            <p className="text-gray-400 text-sm">Start your next AI-powered practice session</p>
                        </div>
                        {user?.credits > 0 ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                                <div className="flex items-center gap-2 px-4 py-2 bg-[#c0fe72]/10 border border-[#c0fe72]/30 rounded-full">
                                    <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[#c0fe72] font-bold">{user.credits} Credits</span>
                                </div>
                                <Link href="/interviews/create">
                                    <Button className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold rounded-xl px-6 py-6 w-full sm:w-auto shadow-lg shadow-[#c0fe72]/20">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Create Interview
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-400 font-semibold text-sm">No credits remaining</span>
                                </div>
                                <Button className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold rounded-xl px-6 py-6 w-full sm:w-auto transition-all duration-300">
                                    <Link href="/pricing" className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                        Buy Credits
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats Preview */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#c0fe72]/20">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#c0fe72]">15min</p>
                            <p className="text-xs text-gray-400 mt-1">Avg Duration</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#9cd052]">AI</p>
                            <p className="text-xs text-gray-400 mt-1">Powered</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#7cb342]">24/7</p>
                            <p className="text-xs text-gray-400 mt-1">Available</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="font-semibold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <button
                            className="text-red-300 font-semibold"
                            onClick={() => setError(null)}
                        >
                            ✕
                        </button>
                    </div>
                )}
            </section>

            {/* Interview Creation Modal */}
            <InterviewCreationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateInterview={handleCreateInterview}
                userId={user.id}
            />
        </>
    );
};
