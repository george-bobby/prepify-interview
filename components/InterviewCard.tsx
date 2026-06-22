'use client';

import React from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { generateInitials, generateRoleColor } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';
import { DisplayTechIcons } from './DisplayTechIcons';

interface EnhancedInterviewCardProps extends InterviewCardProps {
    status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
    difficulty?: string;
    estimatedDuration?: string;
    questionsCount?: number;
    completedAt?: string;
    level?: string;
    feedback?: any;
}

export const InterviewCard = ({
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
    level,
    feedback
}: EnhancedInterviewCardProps) => {
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || completedAt || createdAt || Date.now()).format('MMM D, YYYY');
    const isCompleted = feedback || status === 'completed';

    const getStatusColor = () => {
        switch (status) {
            case 'completed': return 'bg-[#9cd052]';
            case 'in_progress': return 'bg-[#7cb342]';
            case 'paused': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusTextColor = () => {
        switch (status) {
            case 'completed': return 'text-black';
            case 'in_progress': return 'text-black';
            case 'paused': return 'text-white';
            default: return 'text-white';
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
        <Link href={`/interviews/${id}/details`} className="block w-full group">
            <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6 transition-all duration-300 overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#c0fe72]/0 to-[#c0fe72]/5 opacity-0 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                    {/* Status and Type Badges */}
                    <div className="absolute -top-6 -right-6 flex flex-col gap-2">
                        <div className="w-fit px-4 py-2 rounded-bl-xl bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 border border-[#c0fe72]/30 backdrop-blur-sm">
                            <p className="text-[#c0fe72] font-semibold text-xs">{normalizedType}</p>
                        </div>
                        <div className={`w-fit px-4 py-2 rounded-l-xl ${getStatusColor()} shadow-lg`}>
                            <p className={`${getStatusTextColor()} text-xs font-bold`}>{getStatusText()}</p>
                        </div>
                    </div>

                    {/* Role Initials Avatar - Enhanced */}
                    <div className={`rounded-2xl size-[100px] flex items-center justify-center ${generateRoleColor(role).backgroundColor} shadow-xl relative overflow-hidden transition-transform duration-300`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <span className={`text-4xl font-bold ${generateRoleColor(role).textColor} relative z-10`}>
                            {generateInitials(role)}
                        </span>
                    </div>

                    <h3 className='mt-6 capitalize font-bold text-xl text-white transition-colors'>{role} Interview</h3>

                    {/* Level and Difficulty */}
                    {(level || difficulty) && (
                        <div className="flex gap-2 mt-3">
                            {level && (
                                <span className="px-3 py-1.5 bg-[#c0fe72]/20 border border-[#c0fe72]/30 text-[#c0fe72] rounded-lg text-xs font-semibold">
                                    {level}
                                </span>
                            )}
                            {difficulty && (
                                <span className="px-3 py-1.5 bg-[#9cd052]/20 border border-[#9cd052]/30 text-[#9cd052] rounded-lg text-xs font-semibold">
                                    {difficulty}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Metadata */}
                    <div className='flex flex-col gap-3 mt-4'>
                        <div className='flex flex-col sm:flex-row gap-3 sm:gap-6'>
                            <div className='flex flex-row gap-2 items-center'>
                                <div className="w-8 h-8 bg-[#c0fe72]/10 rounded-lg flex items-center justify-center">
                                    <Image src="/calendar.svg" alt="calendar" width={16} height={16} />
                                </div>
                                <p className="text-sm text-gray-300">{formattedDate}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="w-8 h-8 bg-[#c0fe72]/10 rounded-lg flex items-center justify-center">
                                    <Image src="/star.svg" alt="score" width={16} height={16} />
                                </div>
                                <p className="text-sm font-semibold text-[#c0fe72]">{feedback?.totalScore ? `${feedback.totalScore}/10` : '---'}</p>
                            </div>
                        </div>

                        {/* Additional metadata */}
                        <div className='flex flex-col sm:flex-row gap-3 sm:gap-6'>
                            {questionsCount && (
                                <div className='flex flex-row gap-2 items-center'>
                                    <div className="w-8 h-8 bg-[#9cd052]/10 rounded-lg flex items-center justify-center">
                                        <span className="text-sm">📝</span>
                                    </div>
                                    <p className="text-sm text-gray-400">{questionsCount} questions</p>
                                </div>
                            )}
                            {estimatedDuration && (
                                <div className='flex flex-row gap-2 items-center'>
                                    <div className="w-8 h-8 bg-[#7cb342]/10 rounded-lg flex items-center justify-center">
                                        <span className="text-sm">⏱️</span>
                                    </div>
                                    <p className="text-sm text-gray-400">{estimatedDuration}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-white/5 border border-[#c0fe72]/20 rounded-xl">
                        <p className='line-clamp-3 text-sm text-gray-300 leading-relaxed'>
                            {feedback?.overallFeedback || feedback?.finalAssessment || "You haven't taken this interview yet. Start now to practice your skills and get AI-powered feedback."}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-6 pt-6 border-t border-[#c0fe72]/20">
                    <DisplayTechIcons techStack={techstack} />
                    <Button 
                        className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold rounded-xl px-6 py-3 w-full sm:w-auto transition-all duration-300 shadow-lg shadow-[#c0fe72]/20" 
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = feedback ? `/interviews/${id}/feedback` : `/interviews/${id}`;
                        }}
                    >
                        <span className="flex items-center gap-2">
                            {feedback ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View Feedback
                                </>
                            ) : status === 'in_progress' ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Continue Interview
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Start Interview
                                </>
                            )}
                        </span>
                    </Button>
                </div>
            </div>
        </Link>
    )
}