import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { interviewService } from '@/lib/firebase/interview-service';
import { Agent } from '@/components/Agent';

interface InterviewPageProps {
    params: {
        id: string;
    };
}

const InterviewPage = async ({ params }: InterviewPageProps) => {
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

        // If interview is already completed, redirect to feedback
        if (interview.finalized) {
            redirect(`/interviews/${params.id}/feedback`);
        }

        return (
            <div className="min-h-screen bg-black relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0fe72]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-6">
                    <div className="w-full max-w-6xl">
                        <Agent
                            userName={user.name}
                            userId={user.id}
                            type={interview.type}
                            interviewId={params.id}
                            questions={interview.questions}
                        />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading interview:', error);
        notFound();
    }
};

export default InterviewPage;
