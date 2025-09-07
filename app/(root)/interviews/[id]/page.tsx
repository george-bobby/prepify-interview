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
            <div className="min-h-screen bg-dark-100 flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-4xl">
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
