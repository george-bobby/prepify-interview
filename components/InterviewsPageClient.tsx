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
            {/* Statistics Section */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-3 md:p-4">
                    <h3 className="text-primary-100 font-semibold text-sm md:text-base">Total Interviews</h3>
                    <p className="text-xl md:text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-3 md:p-4">
                    <h3 className="text-primary-100 font-semibold text-sm md:text-base">Completed</h3>
                    <p className="text-xl md:text-2xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-3 md:p-4">
                    <h3 className="text-primary-100 font-semibold text-sm md:text-base">In Progress</h3>
                    <p className="text-xl md:text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-3 md:p-4">
                    <h3 className="text-primary-100 font-semibold text-sm md:text-base">Average Score</h3>
                    <p className="text-xl md:text-2xl font-bold text-blue-400">{stats.avgScore}/10</p>
                </div>
            </section>

            {/* Create Interview Section */}
            <section className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-primary-100">Create New Interview</h2>
                    {user?.credits > 0 ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <span className="text-light-400 text-sm md:text-base">Credits: {user.credits}</span>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary w-full sm:w-auto"
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Create Interview'}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center w-full sm:w-auto">
                            <p className="text-light-400 mb-2 text-sm md:text-base">No credits remaining</p>
                            <Button className="btn-primary w-full sm:w-auto">
                                <Link href="/pricing">Buy Credits</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                        <button
                            className="ml-2 text-red-900 underline"
                            onClick={() => setError(null)}
                        >
                            Dismiss
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
