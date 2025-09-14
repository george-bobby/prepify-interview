import React from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { generateInitials, generateRoleColor } from '@/lib/utils';
import { EnhancedButton } from './ui/enhanced-button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
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

export const EnhancedInterviewCard = async ({
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

    const getStatusConfig = () => {
        switch (status) {
            case 'completed': 
                return { 
                    color: 'success', 
                    icon: '✓', 
                    text: 'Completed',
                    variant: 'success' as const
                };
            case 'in_progress': 
                return { 
                    color: 'warning', 
                    icon: '⏳', 
                    text: 'In Progress',
                    variant: 'warning' as const
                };
            case 'paused': 
                return { 
                    color: 'info', 
                    icon: '⏸️', 
                    text: 'Paused',
                    variant: 'info' as const
                };
            default: 
                return { 
                    color: 'outline', 
                    icon: '○', 
                    text: 'Not Started',
                    variant: 'outline' as const
                };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <Card 
            variant="interactive" 
            className="w-full max-w-sm min-h-[400px] group hover-lift hover-glow animate-fadeIn"
        >
            <CardHeader className="relative pb-4">
                {/* Status and Type Badges */}
                <div className="absolute top-0 right-0 flex flex-col gap-2 -mt-6 -mr-6">
                    <Badge variant="glass" size="sm">
                        {normalizedType}
                    </Badge>
                    <Badge variant={statusConfig.variant} size="sm">
                        <span className="mr-1">{statusConfig.icon}</span>
                        {statusConfig.text}
                    </Badge>
                </div>

                {/* Role Avatar with Enhanced Design */}
                <div className="relative mx-auto">
                    <div className={`rounded-full size-20 flex items-center justify-center ${generateRoleColor(role).backgroundColor} shadow-lg group-hover:scale-105 transition-transform duration-200`}>
                        <span className={`text-2xl font-bold ${generateRoleColor(role).textColor}`}>
                            {generateInitials(role)}
                        </span>
                    </div>
                    {status === 'in_progress' && (
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary-400 to-primary-500 animate-ping opacity-75"></div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Role Title */}
                <div className="text-center">
                    <h3 className="text-xl font-semibold text-primary-100 capitalize group-hover:text-primary-200 transition-colors">
                        {role} Interview
                    </h3>
                    <p className="text-sm text-light-400 mt-1">{formattedDate}</p>
                </div>

                {/* Level and Difficulty */}
                {(level || difficulty) && (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {level && (
                            <Badge variant="outline" size="sm">
                                📊 {level}
                            </Badge>
                        )}
                        {difficulty && (
                            <Badge variant="outline" size="sm">
                                ⚡ {difficulty}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Tech Stack */}
                {techstack && techstack.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-light-300">Tech Stack:</p>
                        <DisplayTechIcons techStack={techstack} />
                    </div>
                )}

                {/* Interview Details */}
                <div className="grid grid-cols-2 gap-3 text-sm text-light-400">
                    {estimatedDuration && (
                        <div className="flex items-center gap-1">
                            <span>⏱️</span>
                            <span>{estimatedDuration}</span>
                        </div>
                    )}
                    {questionsCount && (
                        <div className="flex items-center gap-1">
                            <span>❓</span>
                            <span>{questionsCount} questions</span>
                        </div>
                    )}
                </div>

                {/* Progress Bar for In Progress */}
                {status === 'in_progress' && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-light-400">
                            <span>Progress</span>
                            <span>65%</span>
                        </div>
                        <div className="w-full bg-dark-300 rounded-full h-2">
                            <div className="bg-gradient-to-r from-primary-400 to-primary-500 h-2 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                    {isCompleted ? (
                        <div className="space-y-2">
                            <EnhancedButton 
                                asChild 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                            >
                                <Link href={`/interviews/${id}/feedback`}>
                                    View Feedback
                                </Link>
                            </EnhancedButton>
                            <EnhancedButton 
                                asChild 
                                variant="ghost" 
                                size="sm" 
                                className="w-full"
                            >
                                <Link href={`/interviews/new?role=${encodeURIComponent(role)}&type=${type}`}>
                                    Retake Interview
                                </Link>
                            </EnhancedButton>
                        </div>
                    ) : (
                        <EnhancedButton 
                            asChild 
                            variant={status === 'in_progress' ? 'gradient' : 'default'}
                            size="sm" 
                            className="w-full"
                        >
                            <Link href={`/interviews/${id}`}>
                                {status === 'in_progress' ? 'Continue Interview' : 
                                 status === 'paused' ? 'Resume Interview' : 
                                 'Start Interview'}
                            </Link>
                        </EnhancedButton>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default EnhancedInterviewCard;