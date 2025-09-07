import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { interviewService } from '@/lib/firebase/interview-service';
import { Button } from '@/components/ui/button';

interface FeedbackPageProps {
    params: {
        id: string;
    };
}

const FeedbackPage = async ({ params }: FeedbackPageProps) => {
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

        // Get feedback
        const feedback = await interviewService.getFeedbackByInterviewId(params.id);

        if (!feedback) {
            // If no feedback yet, redirect back to interview
            redirect(`/interviews/${params.id}`);
        }

        return (
            <div className="min-h-screen bg-dark-100 p-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-primary-100">Interview Feedback</h1>
                                <p className="text-light-400">
                                    {interview.role} • {interview.type} • {interview.level}
                                </p>
                                <p className="text-light-400 text-sm">
                                    Completed on {new Date(feedback.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Button asChild variant="outline">
                                    <Link href="/interviews">Back to Interviews</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/interviews">Start New Interview</Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Overall Score */}
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-primary-100 mb-4">Overall Score</h2>
                            <div className="text-6xl font-bold text-primary-200 mb-2">
                                {feedback.totalScore}/100
                            </div>
                            <p className="text-light-400">
                                Duration: {feedback.interviewDuration} • Questions: {feedback.questionsAnswered}
                            </p>
                        </div>
                    </div>

                    {/* Category Scores */}
                    {feedback.categoryScores && feedback.categoryScores.length > 0 && (
                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-primary-100 mb-6">Category Breakdown</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {feedback.categoryScores.map((category, index) => (
                                    <div key={index} className="bg-dark-100 border border-dark-300 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-primary-100 font-semibold">
                                                {category.name || category.category}
                                            </h3>
                                            <span className="text-primary-200 font-bold">
                                                {category.score}/100
                                            </span>
                                        </div>
                                        {(category.comment || category.feedback) && (
                                            <p className="text-light-400 text-sm">
                                                {category.comment || category.feedback}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Strengths */}
                    {feedback.strengths && feedback.strengths.length > 0 && (
                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-primary-100 mb-6">Strengths</h2>
                            <div className="space-y-3">
                                {feedback.strengths.map((strength, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-success-100 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-light-100">{strength}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Areas for Improvement */}
                    {feedback.areasForImprovement && feedback.areasForImprovement.length > 0 && (
                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-primary-100 mb-6">Areas for Improvement</h2>
                            <div className="space-y-3">
                                {feedback.areasForImprovement.map((improvement, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-warning-100 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-light-100">{improvement}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {feedback.recommendations && feedback.recommendations.length > 0 && (
                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-primary-100 mb-6">Recommendations</h2>
                            <div className="space-y-3">
                                {feedback.recommendations.map((recommendation, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary-200 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-light-100">{recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Overall Feedback */}
                    {feedback.overallFeedback && (
                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-primary-100 mb-6">Overall Feedback</h2>
                            <p className="text-light-100 leading-relaxed">{feedback.overallFeedback}</p>
                        </div>
                    )}

                    {/* Final Assessment */}
                    {feedback.finalAssessment && (
                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-primary-100 mb-6">Final Assessment</h2>
                            <p className="text-light-100 leading-relaxed">{feedback.finalAssessment}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading feedback:', error);
        notFound();
    }
};

export default FeedbackPage;
