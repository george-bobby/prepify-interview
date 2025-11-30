import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InterviewCard } from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews, getFeedbackByInterviewId } from "@/lib/actions/general.action";

import { InterviewsPageClient } from "@/components/InterviewsPageClient";
import { redirect } from 'next/navigation';

const InterviewsPage = async () => {
    const user: any = await getCurrentUser();

    // Redirect to signin if not authenticated
    if (!user) {
        redirect('/signin');
    }

    const userInterviews: any = user?.id ? await getInterviewsByUserId(user.id) : [];
    const latestInterviews: any = user?.id ? await getLatestInterviews({ userId: user.id }) : [];

    // Fetch feedback for each interview
    const interviewsWithFeedback = await Promise.all(
        userInterviews.map(async (interview: any) => {
            const feedback = interview.userId && interview.id
                ? await getFeedbackByInterviewId({ interviewId: interview.id, userId: interview.userId })
                : null;
            return { ...interview, feedback };
        })
    );

    const hasPastInterviews = interviewsWithFeedback.length > 0;

    // Sort user interviews by status and date
    const sortedUserInterviews = interviewsWithFeedback?.sort((a: any, b: any) => {
        // Prioritize in-progress interviews
        if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
        if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;

        // Then by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) || [];



    const recentInterviews = [
        // This would come from your database
        // For now, showing placeholder data
    ];

    return (
        <main className="flex flex-col gap-6 md:gap-10 relative min-h-screen bg-black">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0fe72]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Hero Banner Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-6 md:p-10 shadow-2xl shadow-[#c0fe72]/20">
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col gap-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c0fe72]/20 border border-[#c0fe72]/50 rounded-full w-fit">
                            <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-[#c0fe72] font-semibold text-sm">AI-POWERED INTERVIEWS</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Master Your Interview Skills with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0fe72] to-[#d4ff8f]">
                                AI Precision
                            </span>
                        </h1>
                        <p className="text-lg text-gray-300">
                            Practice with AI-powered interviews, get instant detailed feedback, and track your progress to ace every interview
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">Real-time Feedback</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">Company-Specific</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">Performance Analytics</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="relative w-64 h-64">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-full opacity-20 animate-pulse"></div>
                            <div className="absolute inset-4 bg-gradient-to-br from-[#c0fe72] to-[#8bc34a] rounded-full opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute inset-8 bg-gradient-to-br from-[#c0fe72] to-[#7cb342] rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
                            <div className="absolute inset-0 flex items-center justify-center text-8xl">🎯</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interview Tips Section - Enhanced */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-[#c0fe72]/30 rounded-2xl p-6 hover:border-[#c0fe72]/60 transition-all group">
                    <div className="w-14 h-14 bg-[#c0fe72]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c0fe72]/30 transition-colors">
                        <span className="text-3xl">📋</span>
                    </div>
                    <h3 className="text-[#c0fe72] font-bold text-lg mb-3">Before You Start</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Ensure you have a quiet environment</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Test your microphone and camera</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Have a notepad ready for problem-solving</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-[#9cd052]/30 rounded-2xl p-6 hover:border-[#9cd052]/60 transition-all group">
                    <div className="w-14 h-14 bg-[#9cd052]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#9cd052]/30 transition-colors">
                        <span className="text-3xl">💬</span>
                    </div>
                    <h3 className="text-[#9cd052] font-bold text-lg mb-3">During the Interview</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#9cd052] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Think out loud to show your reasoning</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#9cd052] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Ask clarifying questions when needed</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#9cd052] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Take your time to understand the problem</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-[#7cb342]/30 rounded-2xl p-6 hover:border-[#7cb342]/60 transition-all group">
                    <div className="w-14 h-14 bg-[#7cb342]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#7cb342]/30 transition-colors">
                        <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="text-[#7cb342] font-bold text-lg mb-3">After the Interview</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#7cb342] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Review your detailed AI feedback</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#7cb342] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Track your performance metrics</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#7cb342] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Practice identified weak areas</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Client-side components for interview creation and stats */}
            <InterviewsPageClient
                user={user}
                userInterviews={sortedUserInterviews}
                latestInterviews={latestInterviews}
            />

            {/* User Interviews Section */}
            <section className="flex flex-col gap-4 md:gap-6 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Interview Journey</h2>
                        {hasPastInterviews && (
                            <p className="text-gray-400 text-sm">
                                {sortedUserInterviews.length} interview{sortedUserInterviews.length !== 1 ? 's' : ''} completed
                            </p>
                        )}
                    </div>
                    {hasPastInterviews && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#c0fe72]/10 border border-[#c0fe72]/30 rounded-full">
                            <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[#c0fe72] font-semibold text-sm">
                                {sortedUserInterviews.filter(i => i.status === 'completed' || i.feedback).length} Completed
                            </span>
                        </div>
                    )}
                </div>
                <div className="interviews-section">
                    {hasPastInterviews ? (
                        sortedUserInterviews.map((interview: any) => (
                            <InterviewCard
                                {...interview}
                                key={interview.id}
                                status={interview.status}
                                difficulty={interview.difficulty}
                                estimatedDuration={interview.estimatedDuration}
                                questionsCount={interview.questions?.length}
                                completedAt={interview.completedAt}
                                level={interview.level}
                            />
                        ))
                    ) : (
                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#c0fe72]/5 rounded-3xl"></div>
                            <div className="relative z-10">
                                <div className="text-6xl md:text-7xl mb-6 animate-bounce">🚀</div>
                                <h3 className="text-[#c0fe72] font-bold mb-3 text-xl md:text-2xl">Ready to Start Your Journey?</h3>
                                <p className="text-gray-300 mb-6 text-base md:text-lg max-w-md mx-auto">
                                    Create your first AI-powered interview and get personalized feedback to ace your next opportunity
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Instant Feedback</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>AI-Powered</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Progress Tracking</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default InterviewsPage;