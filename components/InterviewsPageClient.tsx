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
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
                    <h3 className="text-primary-100 font-semibold">Total Interviews</h3>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
                    <h3 className="text-primary-100 font-semibold">Completed</h3>
                    <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
                    <h3 className="text-primary-100 font-semibold">In Progress</h3>
                    <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
                    <h3 className="text-primary-100 font-semibold">Average Score</h3>
                    <p className="text-2xl font-bold text-blue-400">{stats.avgScore}/10</p>
                </div>
            </section>

            {/* Create Interview Section */}
            <section className="flex flex-col gap-6 mb-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primary-100">Create New Interview</h2>
                    {user?.credits > 0 ? (
                        <div className="flex items-center gap-4">
                            <span className="text-light-400">Credits: {user.credits}</span>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary"
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Create Interview'}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-light-400 mb-2">No credits remaining</p>
                            <Button className="btn-primary">
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
