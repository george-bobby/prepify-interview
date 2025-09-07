import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';

const InterviewHistoryPage = async () => {
    const user = await getCurrentUser();

    // This would typically fetch actual interview history from your database
    const interviewHistory: any[] = [
        // Placeholder data - replace with actual database query
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-100">Interview History</h1>
                    <p className="text-light-400">Track your interview progress and performance</p>
                </div>
                <Button asChild>
                    <Link href="/interviews">Start New Interview</Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">Total Interviews</h3>
                    <p className="text-3xl font-bold text-primary-200">0</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">Average Score</h3>
                    <p className="text-3xl font-bold text-success-100">-</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">Best Performance</h3>
                    <p className="text-3xl font-bold text-success-100">-</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">This Month</h3>
                    <p className="text-3xl font-bold text-primary-200">0</p>
                </div>
            </div>

            {/* Interview History */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h2 className="text-xl font-bold text-primary-100 mb-6">Recent Interviews</h2>

                {interviewHistory.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-primary-100 font-semibold mb-2">No interview history yet</h3>
                        <p className="text-light-400 mb-6">
                            Start taking interviews to track your progress and see detailed performance analytics.
                        </p>
                        <Button asChild>
                            <Link href="/interviews">Take Your First Interview</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* This would map over actual interview history */}
                        {interviewHistory.map((interview, index) => (
                            <div
                                key={index}
                                className="bg-dark-100 border border-dark-300 rounded-lg p-4 flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="text-primary-100 font-medium">{interview.title}</h4>
                                    <p className="text-light-400 text-sm">{interview.date}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-success-100 font-semibold">{interview.score}/100</span>
                                    <Button size="sm" variant="outline">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Performance Insights */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h2 className="text-xl font-bold text-primary-100 mb-4">Performance Insights</h2>
                <div className="text-center py-8">
                    <p className="text-light-400">
                        Complete more interviews to unlock detailed performance insights and personalized recommendations.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InterviewHistoryPage;
