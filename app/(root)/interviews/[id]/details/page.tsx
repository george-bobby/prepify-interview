import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { interviewService } from '@/lib/firebase/interview-service';
import { Button } from '@/components/ui/button';

interface DetailsPageProps {
    params: {
        id: string;
    };
}

const DetailsPage = async ({ params }: DetailsPageProps) => {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect('/signin');
    }

    try {
        // Get interview details
        const interview = await interviewService.getInterview(params.id);
        
        if (!interview) {
            notFound();
        }

        // Verify user owns this interview
        if (interview.userId !== user.id) {
            redirect('/interviews');
        }

        return (
            <div className="min-h-screen bg-black p-4 relative overflow-hidden">
                {/* Animated Background */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#9cd052]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#7cb342]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>

                <div className="max-w-4xl mx-auto space-y-5 relative z-10">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-5 shadow-2xl shadow-[#c0fe72]/20 overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#c0fe72]/5 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#9cd052]/5 rounded-full blur-2xl"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#c0fe72]/30">
                                        <svg className="w-6 h-6 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-[#c0fe72] mb-1">📋 Interview Details</h1>
                                        <p className="text-gray-300 font-semibold">
                                            {interview.role} • {interview.type} • {interview.level}
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            🗓️ Created on {new Date(interview.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button asChild className="bg-white/5 border-2 border-gray-700 text-gray-300 font-semibold">
                                        <Link href="/interviews">⬅️ Back</Link>
                                    </Button>
                                    {!interview.finalized ? (
                                        <Button asChild className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold shadow-lg shadow-[#c0fe72]/30">
                                            <Link href={`/interviews/${params.id}`}>
                                                {interview.status === 'in_progress' ? '▶️ Continue' : '🚀 Start Interview'}
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button asChild className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold shadow-lg shadow-[#c0fe72]/30">
                                            <Link href={`/interviews/${params.id}/feedback`}>📊 View Feedback</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interview Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-5 shadow-xl shadow-[#c0fe72]/10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-lg flex items-center justify-center border border-[#c0fe72]/30">
                                    <span className="text-xl">⚙️</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#c0fe72]">Configuration</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white/5 rounded-xl p-3 border border-gray-700/50">
                                    <span className="text-gray-400 text-sm">Role:</span>
                                    <span className="text-[#c0fe72] ml-2 font-semibold">{interview.role}</span>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 border border-gray-700/50">
                                    <span className="text-gray-400 text-sm">Level:</span>
                                    <span className="text-[#c0fe72] ml-2 font-semibold">{interview.level}</span>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 border border-gray-700/50">
                                    <span className="text-gray-400 text-sm">Type:</span>
                                    <span className="text-[#c0fe72] ml-2 font-semibold capitalize">{interview.type}</span>
                                </div>
                                {interview.difficulty && (
                                    <div className="bg-white/5 rounded-xl p-3 border border-gray-700/50">
                                        <span className="text-gray-400 text-sm">Difficulty:</span>
                                        <span className="text-[#c0fe72] ml-2 font-semibold">{interview.difficulty}</span>
                                    </div>
                                )}
                                {interview.estimatedDuration && (
                                    <div className="bg-white/5 rounded-xl p-3 border border-gray-700/50">
                                        <span className="text-gray-400 text-sm">Duration:</span>
                                        <span className="text-[#c0fe72] ml-2 font-semibold">{interview.estimatedDuration}</span>
                                    </div>
                                )}
                                <div className="bg-white/5 rounded-xl p-3 border border-gray-700/50">
                                    <span className="text-gray-400 text-sm">Status:</span>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                                        interview.finalized 
                                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                                            : interview.status === 'in_progress'
                                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
                                            : 'bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 text-[#c0fe72] border border-[#c0fe72]/30'
                                    }`}>
                                        {interview.finalized ? '✅ Completed' : interview.status === 'in_progress' ? '⏳ In Progress' : '🆕 Not Started'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#9cd052]/30 rounded-3xl p-5 shadow-xl shadow-[#9cd052]/10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#9cd052]/20 to-[#7cb342]/20 rounded-lg flex items-center justify-center border border-[#9cd052]/30">
                                    <span className="text-xl">💻</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#9cd052]">Technology Stack</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {interview.techstack.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 text-[#c0fe72] rounded-full text-sm font-semibold border border-[#c0fe72]/30 shadow-lg shadow-[#c0fe72]/10"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#7cb342]/30 rounded-3xl p-5 shadow-xl shadow-[#7cb342]/10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#7cb342]/20 to-[#689f38]/20 rounded-lg flex items-center justify-center border border-[#7cb342]/30">
                                <span className="text-xl">❓</span>
                            </div>
                            <h2 className="text-lg font-bold text-[#7cb342]">
                                Interview Questions ({interview.questions.length})
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {interview.questions.map((question, index) => (
                                <div key={index} className="bg-white/5 border-2 border-gray-700/50 rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-start gap-3">
                                        <span className="w-8 h-8 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#c0fe72]/30">
                                            <span className="text-[#c0fe72] font-bold text-sm">
                                                {index + 1}
                                            </span>
                                        </span>
                                        <p className="text-gray-200 leading-relaxed pt-1">{question}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Summary (if completed) */}
                    {interview.finalized && interview.finalScore !== undefined && (
                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-5 shadow-2xl shadow-[#c0fe72]/20">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-lg flex items-center justify-center border border-[#c0fe72]/30">
                                    <span className="text-xl">🏆</span>
                                </div>
                                <h2 className="text-lg font-bold text-[#c0fe72]">Performance Summary</h2>
                            </div>
                            <div className="text-center bg-white/5 border-2 border-[#c0fe72]/30 rounded-2xl p-6">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-full border-4 border-[#c0fe72]/50 mb-3">
                                    <div className="text-4xl font-bold text-[#c0fe72]">
                                        {interview.finalScore}
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-4 text-sm font-semibold">Final Score</p>
                                <Button asChild className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold shadow-lg shadow-[#c0fe72]/30">
                                    <Link href={`/interviews/${params.id}/feedback`}>📊 View Detailed Feedback</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading interview details:', error);
        notFound();
    }
};

export default DetailsPage;
