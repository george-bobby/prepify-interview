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
        <main className="flex flex-col gap-6 md:gap-10 relative">
            {/* Hero Section */}
            {/* <section className="card-cta flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                    <p className="text-lg">
                        Practice with AI-powered interviews and get instant, detailed feedback to improve your skills
                    </p>
                </div>

                <Image
                    src="/robot.png"
                    alt="robot"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section> */}

            {/* Tips Section */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-4 md:p-6">
                <h3 className="text-primary-100 font-semibold mb-3 md:mb-4 text-base md:text-lg">💡 Interview Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <div>
                        <h4 className="text-primary-200 font-medium mb-2">Before You Start</h4>
                        <ul className="text-light-400 space-y-1">
                            <li>• Ensure you have a quiet environment</li>
                            <li>• Test your microphone and camera</li>
                            <li>• Have a notepad ready for problem-solving</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-primary-200 font-medium mb-2">During the Interview</h4>
                        <ul className="text-light-400 space-y-1">
                            <li>• Think out loud to show your reasoning</li>
                            <li>• Ask clarifying questions when needed</li>
                            <li>• Take your time to understand the problem</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Client-side components for interview creation and stats */}
            <InterviewsPageClient
                user={user}
                userInterviews={sortedUserInterviews}
                latestInterviews={latestInterviews}
            />

            {/* User Interviews Section */}
            <section className="flex flex-col gap-4 md:gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl">Your Interviews</h2>
                    {hasPastInterviews && (
                        <p className="text-light-400">
                            {sortedUserInterviews.length} interview{sortedUserInterviews.length !== 1 ? 's' : ''}
                        </p>
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
                        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6 md:p-8 text-center">
                            <div className="text-3xl md:text-4xl mb-4">🎤</div>
                            <h3 className="text-primary-100 font-semibold mb-2 text-base md:text-lg">No interviews yet</h3>
                            <p className="text-light-400 mb-4 text-sm md:text-base">Create your first AI interview to start practicing</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default InterviewsPage;