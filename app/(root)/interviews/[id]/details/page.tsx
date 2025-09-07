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
            <div className="min-h-screen bg-dark-100 p-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-primary-100">Interview Details</h1>
                                <p className="text-light-400">
                                    {interview.role} • {interview.type} • {interview.level}
                                </p>
                                <p className="text-light-400 text-sm">
                                    Created on {new Date(interview.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Button asChild variant="outline">
                                    <Link href="/interviews">Back to Interviews</Link>
                                </Button>
                                {!interview.finalized ? (
                                    <Button asChild>
                                        <Link href={`/interviews/${params.id}`}>
                                            {interview.status === 'in_progress' ? 'Continue Interview' : 'Start Interview'}
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild>
                                        <Link href={`/interviews/${params.id}/feedback`}>View Feedback</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Interview Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-primary-100 mb-4">Interview Configuration</h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-light-400">Role:</span>
                                    <span className="text-primary-100 ml-2">{interview.role}</span>
                                </div>
                                <div>
                                    <span className="text-light-400">Level:</span>
                                    <span className="text-primary-100 ml-2">{interview.level}</span>
                                </div>
                                <div>
                                    <span className="text-light-400">Type:</span>
                                    <span className="text-primary-100 ml-2 capitalize">{interview.type}</span>
                                </div>
                                {interview.difficulty && (
                                    <div>
                                        <span className="text-light-400">Difficulty:</span>
                                        <span className="text-primary-100 ml-2">{interview.difficulty}</span>
                                    </div>
                                )}
                                {interview.estimatedDuration && (
                                    <div>
                                        <span className="text-light-400">Estimated Duration:</span>
                                        <span className="text-primary-100 ml-2">{interview.estimatedDuration}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-light-400">Status:</span>
                                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                        interview.finalized 
                                            ? 'bg-success-100/20 text-success-100'
                                            : interview.status === 'in_progress'
                                            ? 'bg-warning-100/20 text-warning-100'
                                            : 'bg-primary-200/20 text-primary-200'
                                    }`}>
                                        {interview.finalized ? 'Completed' : interview.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-primary-100 mb-4">Technology Stack</h2>
                            <div className="flex flex-wrap gap-2">
                                {interview.techstack.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-primary-200/20 text-primary-200 rounded-full text-sm"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-primary-100 mb-4">
                            Interview Questions ({interview.questions.length})
                        </h2>
                        <div className="space-y-4">
                            {interview.questions.map((question, index) => (
                                <div key={index} className="bg-dark-100 border border-dark-300 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-primary-200 font-bold text-sm mt-1">
                                            Q{index + 1}
                                        </span>
                                        <p className="text-light-100">{question}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Summary (if completed) */}
                    {interview.finalized && interview.finalScore !== undefined && (
                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-primary-100 mb-4">Performance Summary</h2>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-200 mb-2">
                                    {interview.finalScore}/100
                                </div>
                                <p className="text-light-400 mb-4">Final Score</p>
                                <Button asChild>
                                    <Link href={`/interviews/${params.id}/feedback`}>View Detailed Feedback</Link>
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
