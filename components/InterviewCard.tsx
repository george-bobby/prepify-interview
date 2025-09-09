import React from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { generateInitials, generateRoleColor } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import { DisplayTechIcons } from './DisplayTechIcons';
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';

interface EnhancedInterviewCardProps extends InterviewCardProps {
    status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
    difficulty?: string;
    estimatedDuration?: string;
    questionsCount?: number;
    completedAt?: string;
    level?: string;
}

export const InterviewCard = async ({
    id,
    userId,
    role,
    type,
    techstack,
    createdAt,
    status = 'not_started',
    difficulty,
    estimatedDuration,
    questionsCount,
    completedAt,
    level
}: EnhancedInterviewCardProps) => {
    const feedback = userId && id ? await getFeedbackByInterviewId({ interviewId: id, userId }) : null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || completedAt || createdAt || Date.now()).format('MMM D, YYYY');
    const isCompleted = feedback || status === 'completed';

    const getStatusColor = () => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'in_progress': return 'bg-yellow-500';
            case 'paused': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in_progress': return 'In Progress';
            case 'paused': return 'Paused';
            default: return 'Not Started';
        }
    };

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96 hover:border-primary-500 transition-colors">
            <div className="card-interview">
                <div>
                    {/* Status and Type Badges */}
                    <div className="absolute top-0 right-0 flex flex-col gap-1">
                        <div className="w-fit px-3 py-1 rounded-bl-lg bg-light-600">
                            <p className="badge-text text-xs">{normalizedType}</p>
                        </div>
                        <div className={`w-fit px-3 py-1 rounded-l-lg ${getStatusColor()}`}>
                            <p className="text-white text-xs font-medium">{getStatusText()}</p>
                        </div>
                    </div>

                    {/* Role Initials Avatar */}
                    <div className={`rounded-full size-[90px] flex items-center justify-center ${generateRoleColor(role).backgroundColor}`}>
                        <span className={`text-3xl font-bold ${generateRoleColor(role).textColor}`}>
                            {generateInitials(role)}
                        </span>
                    </div>

                    <h3 className='mt-5 capitalize font-semibold'>{role} Interview</h3>

                    {/* Level and Difficulty */}
                    {(level || difficulty) && (
                        <div className="flex gap-2 mt-2">
                            {level && (
                                <span className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs">
                                    {level}
                                </span>
                            )}
                            {difficulty && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                                    {difficulty}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Metadata */}
                    <div className='flex flex-col gap-2 mt-3'>
                        <div className='flex flex-row gap-5'>
                            <div className='flex flex-row gap-2 items-center'>
                                <Image src="/calendar.svg" alt="calendar" width={18} height={18} />
                                <p className="text-sm">{formattedDate}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <Image src="/star.svg" alt="score" width={18} height={18} />
                                <p className="text-sm">{feedback?.totalScore ? `${feedback.totalScore}/10` : '---'}</p>
                            </div>
                        </div>

                        {/* Additional metadata */}
                        <div className='flex flex-row gap-5'>
                            {questionsCount && (
                                <div className='flex flex-row gap-2 items-center'>
                                    <span className="text-light-400">📝</span>
                                    <p className="text-sm text-light-400">{questionsCount} questions</p>
                                </div>
                            )}
                            {estimatedDuration && (
                                <div className='flex flex-row gap-2 items-center'>
                                    <span className="text-light-400">⏱️</span>
                                    <p className="text-sm text-light-400">{estimatedDuration}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className='line-clamp-3 mt-4 text-sm text-light-300'>
                        {feedback?.finalAssessment || "You haven't taken this interview yet. Start now to practice your skills and get AI-powered feedback."}
                    </p>
                </div>

                <div className="flex flex-row justify-between items-end mt-4">
                    <DisplayTechIcons techStack={techstack} />
                    <Button className="btn-primary">
                        <Link href={feedback ? `/interviews/${id}/feedback` : `/interviews/${id}`}>
                            {feedback ? 'View Feedback' : (status === 'in_progress' ? 'Continue' : 'Start Interview')}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}