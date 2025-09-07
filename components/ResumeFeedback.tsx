"use client";

import React from 'react';

interface ResumeAnalysis {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    summary: string;
}

interface ResumeFeedbackProps {
    analysis: ResumeAnalysis;
}

const ResumeFeedback = ({ analysis }: ResumeFeedbackProps) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-success-100';
        if (score >= 60) return 'text-primary-200';
        return 'text-destructive-100';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-success-100/20';
        if (score >= 60) return 'bg-primary-200/20';
        return 'bg-destructive-100/20';
    };

    const getScoreBorderColor = (score: number) => {
        if (score >= 80) return 'border-success-100';
        if (score >= 60) return 'border-primary-200';
        return 'border-destructive-100';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-dark-200 to-dark-300 rounded-lg p-6 border border-dark-300">
                <h2 className="text-2xl font-bold text-primary-100 mb-2">
                    Resume Analysis Complete
                </h2>
                <p className="text-light-400">
                    Here's your personalized feedback to help improve your resume
                </p>
            </div>

            {/* Overall Score */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-100 mb-4">Overall Score</h3>
                <div className="flex items-center justify-center">
                    <div className={`w-32 h-32 rounded-full ${getScoreBgColor(analysis.overallScore)} ${getScoreBorderColor(analysis.overallScore)} border-4 flex items-center justify-center`}>
                        <div className="text-center">
                            <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                                {analysis.overallScore}
                            </div>
                            <div className="text-light-400 text-sm">out of 100</div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-light-400">
                        {analysis.overallScore >= 80
                            ? "Excellent! Your resume is well-structured and comprehensive."
                            : analysis.overallScore >= 60
                                ? "Good! Your resume has solid foundations with room for improvement."
                                : "Your resume needs significant improvements to be competitive."
                        }
                    </p>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-100 mb-4">Summary</h3>
                <div className="bg-dark-300 rounded-lg p-4">
                    <p className="text-light-400 leading-relaxed">{analysis.summary}</p>
                </div>
            </div>

            {/* Strengths and Improvements Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-success-100 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Strengths
                    </h3>
                    <div className="space-y-3">
                        {analysis.strengths.map((strength, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-success-100 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-light-400">{strength}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-primary-200 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Areas for Improvement
                    </h3>
                    <div className="space-y-3">
                        {analysis.improvements.map((improvement, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-primary-200 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-light-400">{improvement}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-100 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Actionable Suggestions
                </h3>
                <div className="space-y-4">
                    {analysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-dark-300 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-primary-200/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-primary-200 text-sm font-semibold">{index + 1}</span>
                                </div>
                                <p className="text-light-400">{suggestion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary-200/20 to-primary-100/20 border border-primary-200/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-100 mb-4">Next Steps</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-200/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h4 className="text-primary-100 font-medium mb-2">Revise Your Resume</h4>
                        <p className="text-light-400 text-sm">Implement the suggested improvements</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-200/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="text-primary-100 font-medium mb-2">Practice Interviews</h4>
                        <p className="text-light-400 text-sm">Use our AI interviewer to prepare</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-200/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h4 className="text-primary-100 font-medium mb-2">Track Progress</h4>
                        <p className="text-light-400 text-sm">Monitor your improvement over time</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeFeedback;

