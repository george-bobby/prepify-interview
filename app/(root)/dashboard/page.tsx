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
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-dark-200 to-dark-300 rounded-lg p-8 border border-dark-300">
                <h1 className="text-3xl font-bold text-primary-100 mb-2">
                    Welcome back, {user.name}!
                </h1>
                <p className="text-light-400 text-lg">
                    Ready to ace your next interview? Let's get you prepared.
                </p>
                {interviewStats.averageScore > 0 && (
                    <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-light-400">Overall Score:</span>
                            <span className={`text-xl font-bold ${getScoreColor(interviewStats.averageScore)}`}>
                                {interviewStats.averageScore}/100
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-light-400">Interviews:</span>
                            <span className="text-lg font-semibold text-primary-200">
                                {interviewStats.completed} completed
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">Credits</h3>
                    <p className="text-2xl font-bold text-success-100">{user.credits || 0}</p>
                    <p className="text-light-400 text-sm">Available interview credits</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">Total Interviews</h3>
                    <p className="text-2xl font-bold text-primary-200">{interviewStats.total}</p>
                    <p className="text-light-400 text-sm">{interviewStats.completed} completed, {interviewStats.inProgress} in progress</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">This Month</h3>
                    <p className="text-2xl font-bold text-primary-200">{dashboardStats.thisMonthInterviews}</p>
                    <p className="text-light-400 text-sm">Interviews completed</p>
                </div>
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-2">Average Score</h3>
                    <p className={`text-2xl font-bold ${getScoreColor(interviewStats.averageScore)}`}>
                        {interviewStats.averageScore > 0 ? `${interviewStats.averageScore}/100` : '-'}
                    </p>
                    <p className="text-light-400 text-sm">Overall performance</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/interviews" className="group">
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6 hover:border-primary-200 transition-colors">
                        <div className="w-12 h-12 bg-primary-200/20 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-primary-100 font-semibold mb-2">Start Interview</h3>
                        <p className="text-light-400 text-sm">Practice with AI interviewer</p>
                    </div>
                </Link>

                <Link href="/courses" className="group">
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6 hover:border-primary-200 transition-colors">
                        <div className="w-12 h-12 bg-success-100/20 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-success-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-primary-100 font-semibold mb-2">Browse Courses</h3>
                        <p className="text-light-400 text-sm">Learn interview skills</p>
                    </div>
                </Link>

                <Link href="/roadmaps" className="group">
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6 hover:border-primary-200 transition-colors">
                        <div className="w-12 h-12 bg-primary-100/20 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-primary-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <h3 className="text-primary-100 font-semibold mb-2">Learning Paths</h3>
                        <p className="text-light-400 text-sm">Structured roadmaps</p>
                    </div>
                </Link>

                <Link href="/resume" className="group">
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6 hover:border-primary-200 transition-colors">
                        <div className="w-12 h-12 bg-success-100/20 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-success-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-primary-100 font-semibold mb-2">Resume Feedback</h3>
                        <p className="text-light-400 text-sm">AI-powered resume analysis</p>
                    </div>
                </Link>
            </div>

            {/* Progress Tracking */}
            {userProgress.overallProgress > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skill Breakdown */}
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                        <h3 className="text-primary-100 font-semibold mb-4">Skill Breakdown</h3>
                        <div className="space-y-4">
                            {Object.entries(userProgress.skillBreakdown).map(([skill, score]) => (
                                <div key={skill} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-light-400 text-sm">{skill}</span>
                                        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                                            {score}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-dark-300 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${score >= 80 ? 'bg-success-100' :
                                                score >= 60 ? 'bg-primary-200' : 'bg-destructive-100'
                                                }`}
                                            style={{ width: `${score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Strengths & Improvements */}
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                        <h3 className="text-primary-100 font-semibold mb-4">Performance Insights</h3>
                        <div className="space-y-6">
                            {/* Strengths */}
                            {userProgress.strengths.length > 0 && (
                                <div>
                                    <h4 className="text-success-100 font-medium mb-3">Your Strengths</h4>
                                    <div className="space-y-2">
                                        {userProgress.strengths.map((strength, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-success-100 rounded-full"></div>
                                                <span className="text-light-400 text-sm">{strength}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Areas for Improvement */}
                            {userProgress.improvementAreas.length > 0 && (
                                <div>
                                    <h4 className="text-primary-200 font-medium mb-3">Focus Areas</h4>
                                    <div className="space-y-2">
                                        {userProgress.improvementAreas.map((area, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                                                <span className="text-light-400 text-sm">{area}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Trends */}
            {dashboardStats.monthlyStats.length > 0 && (
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-4">Performance Trends</h3>
                    <div className="grid grid-cols-6 gap-4">
                        {dashboardStats.monthlyStats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-light-400 text-sm mb-2">{stat.month}</div>
                                <div className="text-primary-200 font-semibold mb-1">{stat.interviews}</div>
                                <div className="text-xs text-light-400">interviews</div>
                                {stat.averageScore > 0 && (
                                    <div className={`text-xs font-medium ${getScoreColor(stat.averageScore)} mt-1`}>
                                        {stat.averageScore}% avg
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-primary-100 font-semibold mb-4">Recent Activity</h3>
                {dashboardStats.recentInterviews.length > 0 ? (
                    <div className="space-y-4">
                        {dashboardStats.recentInterviews.map((interview) => (
                            <div key={interview.id} className="flex items-center justify-between p-4 bg-dark-300 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-primary-100 font-medium">{interview.role}</h4>
                                        <p className="text-light-400 text-sm">
                                            {interview.type} • {interview.level} • {interview.techstack.join(', ')}
                                        </p>
                                        <p className="text-light-400 text-xs">
                                            {new Date(interview.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${interview.finalized
                                        ? 'bg-success-100/20 text-success-100'
                                        : 'bg-primary-200/20 text-primary-200'
                                        }`}>
                                        {interview.finalized ? 'Completed' : 'In Progress'}
                                    </span>
                                    {interview.finalized && (
                                        <Button asChild size="sm">
                                            <Link href={`/interviews/${interview.id}/feedback`}>View Feedback</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-light-400 mb-4">No recent activity yet</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button asChild>
                                <Link href="/interviews">Start Your First Interview</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/interviews/history">View Interview History</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Performance Insights */}
            {interviewStats.completed > 0 && (
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-primary-100 font-semibold mb-4">Performance Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-primary-200 font-medium">Quick Stats</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-light-400">Completion Rate</span>
                                    <span className="text-success-100 font-semibold">
                                        {Math.round((interviewStats.completed / interviewStats.total) * 100)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-light-400">Best Score</span>
                                    <span className="text-primary-200 font-semibold">
                                        {Math.max(...dashboardStats.recentInterviews
                                            .filter(i => i.finalScore)
                                            .map(i => i.finalScore || 0), 0) || '-'}/100
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-primary-200 font-medium">Recommendations</h4>
                            <div className="space-y-3">
                                {interviewStats.averageScore < 70 && (
                                    <div className="bg-warning-100/10 border border-warning-100/30 rounded-lg p-3">
                                        <p className="text-warning-100 text-sm">
                                            💡 Focus on improving your interview skills with more practice.
                                        </p>
                                    </div>
                                )}
                                {interviewStats.inProgress > 0 && (
                                    <div className="bg-primary-200/10 border border-primary-200/30 rounded-lg p-3">
                                        <p className="text-primary-200 text-sm">
                                            🎯 Complete your {interviewStats.inProgress} in-progress interview{interviewStats.inProgress !== 1 ? 's' : ''}.
                                        </p>
                                    </div>
                                )}
                                {interviewStats.averageScore >= 80 && (
                                    <div className="bg-success-100/10 border border-success-100/30 rounded-lg p-3">
                                        <p className="text-success-100 text-sm">
                                            🌟 Excellent performance! Keep up the great work!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
