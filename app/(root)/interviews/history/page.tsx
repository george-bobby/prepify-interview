import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { interviewService } from '@/lib/firebase/interview-service';
import { redirect } from 'next/navigation';

const InterviewHistoryPage = async () => {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/signin');
    }

    // Fetch actual interview history and stats
    const [interviewHistory, stats] = await Promise.all([
        interviewService.getInterviewsByUserId(user.id, { limit: 50 }),
        interviewService.getUserInterviewStats(user.id)
    ]);

    // Sort interviews by date (newest first)
    const sortedInterviews = interviewHistory.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Get best performance
    const bestScore = interviewHistory
        .filter(i => i.finalScore)
        .reduce((max, i) => Math.max(max, i.finalScore || 0), 0);

    // Get this month's interviews
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthCount = interviewHistory.filter(i =>
        new Date(i.createdAt) >= thisMonth
    ).length;

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
                    <p className="text-3xl font-bold text-primary-200">{stats.total}</p>
                    <p className="text-sm text-light-400 mt-1">
                        {stats.completed} completed, {stats.inProgress} in progress
                    </p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">Average Score</h3>
                    <p className="text-3xl font-bold text-success-100">
                        {stats.averageScore > 0 ? `${stats.averageScore}/100` : '-'}
                    </p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">Best Performance</h3>
                    <p className="text-3xl font-bold text-success-100">
                        {bestScore > 0 ? `${bestScore}/100` : '-'}
                    </p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">This Month</h3>
                    <p className="text-3xl font-bold text-primary-200">{thisMonthCount}</p>
                </div>
            </div>

            {/* Interview History */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h2 className="text-xl font-bold text-primary-100 mb-6">Recent Interviews</h2>

                {sortedInterviews.length === 0 ? (
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
                        {sortedInterviews.map((interview) => (
                            <div
                                key={interview.id}
                                className="bg-dark-100 border border-dark-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-primary-100 font-medium">{interview.role}</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${interview.status === 'completed' || interview.finalized
                                            ? 'bg-success-100/20 text-success-100'
                                            : interview.status === 'in_progress'
                                                ? 'bg-warning-100/20 text-warning-100'
                                                : 'bg-primary-200/20 text-primary-200'
                                            }`}>
                                            {interview.status === 'completed' || interview.finalized
                                                ? 'Completed'
                                                : interview.status === 'in_progress'
                                                    ? 'In Progress'
                                                    : 'Not Started'}
                                        </span>
                                    </div>
                                    <p className="text-light-400 text-sm">
                                        {interview.type} • {interview.level} • {interview.techstack.join(', ')}
                                    </p>
                                    <p className="text-light-400 text-xs">
                                        {new Date(interview.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {interview.finalScore && (
                                        <span className="text-success-100 font-semibold">
                                            {interview.finalScore}/100
                                        </span>
                                    )}
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/interviews/${interview.id}/details`}>
                                                View Details
                                            </Link>
                                        </Button>
                                        {interview.status === 'completed' || interview.finalized ? (
                                            <Button size="sm" asChild>
                                                <Link href={`/interviews/${interview.id}/feedback`}>
                                                    View Feedback
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button size="sm" asChild>
                                                <Link href={`/interviews/${interview.id}`}>
                                                    {interview.status === 'in_progress' ? 'Continue' : 'Start'}
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Performance Insights */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h2 className="text-xl font-bold text-primary-100 mb-4">Performance Insights</h2>

                {stats.completed < 3 ? (
                    <div className="text-center py-8">
                        <p className="text-light-400">
                            Complete {3 - stats.completed} more interview{3 - stats.completed !== 1 ? 's' : ''} to unlock detailed performance insights and personalized recommendations.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-primary-100 font-semibold">Performance Trends</h3>
                            <div className="bg-dark-100 border border-dark-300 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-light-400">Average Score</span>
                                    <span className="text-primary-200 font-bold">{stats.averageScore}/100</span>
                                </div>
                                <div className="w-full bg-dark-300 rounded-full h-2">
                                    <div
                                        className="bg-primary-200 h-2 rounded-full"
                                        style={{ width: `${stats.averageScore}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="bg-dark-100 border border-dark-300 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-light-400">Completion Rate</span>
                                    <span className="text-success-100 font-bold">
                                        {Math.round((stats.completed / stats.total) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-dark-300 rounded-full h-2">
                                    <div
                                        className="bg-success-100 h-2 rounded-full"
                                        style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-primary-100 font-semibold">Recommendations</h3>
                            <div className="space-y-3">
                                {stats.averageScore < 70 && (
                                    <div className="bg-warning-100/10 border border-warning-100/30 rounded-lg p-3">
                                        <p className="text-warning-100 text-sm">
                                            💡 Focus on improving your interview skills. Consider practicing more technical questions.
                                        </p>
                                    </div>
                                )}
                                {stats.inProgress > 0 && (
                                    <div className="bg-primary-200/10 border border-primary-200/30 rounded-lg p-3">
                                        <p className="text-primary-200 text-sm">
                                            🎯 You have {stats.inProgress} interview{stats.inProgress !== 1 ? 's' : ''} in progress. Complete them to improve your stats!
                                        </p>
                                    </div>
                                )}
                                {stats.averageScore >= 80 && (
                                    <div className="bg-success-100/10 border border-success-100/30 rounded-lg p-3">
                                        <p className="text-success-100 text-sm">
                                            🌟 Great job! Your performance is excellent. Keep up the good work!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewHistoryPage;
