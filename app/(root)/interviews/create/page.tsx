'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { InterviewCreationModal } from '@/components/InterviewCreationModal';
import { InterviewConfig } from '@/lib/schemas/interview';
import { toast } from 'sonner';

const CreateInterviewPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                router.push('/signin');
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const handleCreateInterview = async (config: InterviewConfig, questionCount: number) => {
        try {
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

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to create interview');
            }

            toast.success('Interview created successfully!');
            router.push('/interviews');
        } catch (error) {
            console.error('Error creating interview:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create interview');
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c0fe72]"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden pb-10">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-96 h-96 bg-[#c0fe72]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#9cd052]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#7cb342]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                {/* Hero Header */}
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-[#c0fe72]/40 rounded-3xl p-8 md:p-10 shadow-2xl shadow-[#c0fe72]/30 overflow-hidden mb-8">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#c0fe72]/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#9cd052]/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-2xl flex items-center justify-center shadow-xl shadow-[#c0fe72]/40 animate-pulse">
                                <span className="text-4xl md:text-5xl">🎯</span>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#c0fe72] via-[#d4ff8f] to-[#c0fe72] bg-clip-text text-transparent mb-3 leading-tight">
                                    Create Your AI Interview
                                </h1>
                                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                                    🚀 Set up a personalized AI-powered interview session tailored to your role and experience level. Get instant feedback to ace your next opportunity!
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-2 bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 text-[#c0fe72] text-sm font-bold rounded-full border-2 border-[#c0fe72]/40 shadow-lg shadow-[#c0fe72]/20">
                                🤖 AI-Powered Questions
                            </span>
                            <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm font-bold rounded-full border-2 border-purple-500/40 shadow-lg shadow-purple-500/20">
                                ⚡ Real-time Feedback
                            </span>
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 text-sm font-bold rounded-full border-2 border-blue-500/40 shadow-lg shadow-blue-500/20">
                                📊 Performance Analytics
                            </span>
                        </div>
                    </div>
                </div>

                {/* Interview Creation Form */}
                <InterviewCreationModal 
                    userId={user.id} 
                    isOpen={true} 
                    onClose={() => router.push('/interviews')} 
                    onCreateInterview={handleCreateInterview}
                />

                {/* Tips Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500/40 rounded-2xl p-6 shadow-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center mb-4 border border-green-500/40">
                            <span className="text-2xl">💡</span>
                        </div>
                        <h3 className="text-green-400 font-bold text-lg mb-2">Choose Wisely</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Select the interview type that matches your target role. Technical for coding, Behavioral for soft skills, or Mixed for both.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/40 rounded-2xl p-6 shadow-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/30 rounded-xl flex items-center justify-center mb-4 border border-[#c0fe72]/40">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <h3 className="text-[#c0fe72] font-bold text-lg mb-2">Be Specific</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Add relevant technologies to your tech stack for more targeted questions that match your actual interview preparation needs.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/40 rounded-2xl p-6 shadow-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center mb-4 border border-blue-500/40">
                            <span className="text-2xl">⏱️</span>
                        </div>
                        <h3 className="text-blue-400 font-bold text-lg mb-2">Start Small</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Begin with 3-5 questions to get comfortable with the format, then gradually increase for comprehensive practice sessions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateInterviewPage;
