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
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-[#c0fe72]';
        return 'text-red-400';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'from-green-500/20 to-emerald-500/20';
        if (score >= 60) return 'from-[#c0fe72]/20 to-[#9cd052]/20';
        return 'from-red-500/20 to-orange-500/20';
    };

    const getScoreBorderColor = (score: number) => {
        if (score >= 80) return 'border-green-500/50';
        if (score >= 60) return 'border-[#c0fe72]/50';
        return 'border-red-500/50';
    };

    // Parse summary if it's JSON string
    const getSummaryText = () => {
        try {
            let text = analysis.summary.trim();
            
            // Remove markdown code block markers
            text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
            
            // Check if it's JSON
            if (text.startsWith('{')) {
                const parsed = JSON.parse(text);
                return parsed.summary || text;
            }
            
            return text;
        } catch (error) {
            // If parsing fails, return original text without code block markers
            return analysis.summary.replace(/```json|```/gi, '').trim();
        }
    };

    return (
        <div className="space-y-5 relative">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-6 border-2 border-[#c0fe72]/40 shadow-2xl shadow-[#c0fe72]/20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#c0fe72]/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-xl flex items-center justify-center shadow-xl">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">
                            Resume Analysis Complete
                        </h2>
                    </div>
                    <p className="text-gray-300 ml-15">
                        🎯 Here's your personalized feedback to help improve your resume
                    </p>
                </div>
            </div>

            {/* Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Left Column */}
                <div className="space-y-5">
                    {/* Overall Score */}
                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/40 rounded-3xl p-6 shadow-2xl shadow-[#c0fe72]/20">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/30 rounded-xl flex items-center justify-center border border-[#c0fe72]/40">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#c0fe72]">Overall Score</h3>
                </div>
                <div className="flex items-center justify-center">
                    <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getScoreBgColor(analysis.overallScore)} ${getScoreBorderColor(analysis.overallScore)} border-4 flex items-center justify-center shadow-2xl`}>
                        <div className="text-center">
                            <div className={`text-5xl font-extrabold ${getScoreColor(analysis.overallScore)}`}>
                                {analysis.overallScore}
                            </div>
                            <div className="text-gray-400 text-sm font-semibold mt-1">/ 100</div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 text-center bg-white/5 rounded-2xl p-4 border border-gray-700/50">
                    <p className="text-gray-300 text-base font-medium">
                        {analysis.overallScore >= 80
                            ? "🎉 Excellent! Your resume is well-structured and comprehensive."
                            : analysis.overallScore >= 60
                                ? "👍 Good! Your resume has solid foundations with room for improvement."
                                : "⚠️ Your resume needs significant improvements to be competitive."
                        }
                    </p>
                </div>
            </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/40 rounded-3xl p-6 shadow-xl shadow-[#c0fe72]/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/30 rounded-xl flex items-center justify-center border border-[#c0fe72]/40">
                                <span className="text-2xl">📝</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#c0fe72]">Summary</h3>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-5 border border-gray-700/50">
                            <p className="text-gray-200 leading-relaxed text-base">{getSummaryText()}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                {/* Strengths */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/40 rounded-3xl p-6 shadow-xl shadow-[#c0fe72]/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/30 rounded-xl flex items-center justify-center border border-[#c0fe72]/40 shadow-lg">
                            <svg className="w-6 h-6 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#c0fe72]">✅ Strengths</h3>
                    </div>
                    <div className="space-y-3">
                        {analysis.strengths.map((strength, index) => (
                            <div key={index} className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-[#c0fe72]/20">
                                <div className="w-6 h-6 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#c0fe72]/30 mt-0.5">
                                    <span className="text-[#c0fe72] text-xs font-bold">✓</span>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">{strength}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/40 rounded-3xl p-6 shadow-xl shadow-[#c0fe72]/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/30 rounded-xl flex items-center justify-center border border-[#c0fe72]/40 shadow-lg">
                            <svg className="w-6 h-6 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#c0fe72]">🎯 Improvements</h3>
                    </div>
                    <div className="space-y-3">
                        {analysis.improvements.map((improvement, index) => (
                            <div key={index} className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-[#c0fe72]/20">
                                <div className="w-6 h-6 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#c0fe72]/30 mt-0.5">
                                    <span className="text-[#c0fe72] text-xs font-bold">!</span>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">{improvement}</p>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
            </div>

            {/* Suggestions */}
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/40 rounded-3xl p-6 shadow-2xl shadow-[#c0fe72]/20">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/30 rounded-xl flex items-center justify-center border border-[#c0fe72]/40 shadow-lg">
                        <svg className="w-6 h-6 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-[#c0fe72]">💡 Actionable Suggestions</h3>
                </div>
                <div className="space-y-3">
                    {analysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-gradient-to-r from-white/5 to-[#c0fe72]/5 rounded-2xl p-4 border border-[#c0fe72]/20 shadow-lg">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/30 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#c0fe72]/40 shadow-md">
                                    <span className="text-[#c0fe72] font-bold text-sm">{index + 1}</span>
                                </div>
                                <p className="text-gray-200 text-base leading-relaxed pt-1">{suggestion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-[#c0fe72]/10 via-[#9cd052]/10 to-[#7cb342]/10 border-2 border-[#c0fe72]/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#c0fe72]/30 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-[#c0fe72]/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#9cd052]/10 rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-xl flex items-center justify-center shadow-xl">
                            <span className="text-3xl">🚀</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">Next Steps</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-5 shadow-xl">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#c0fe72]/30">
                                <svg className="w-7 h-7 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h4 className="text-[#c0fe72] font-bold text-lg mb-2 text-center">✏️ Revise Resume</h4>
                            <p className="text-gray-300 text-sm text-center leading-relaxed">Implement the suggested improvements</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-5 shadow-xl">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#c0fe72]/30">
                                <svg className="w-7 h-7 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-[#c0fe72] font-bold text-lg mb-2 text-center">🎯 Practice Interviews</h4>
                            <p className="text-gray-300 text-sm text-center leading-relaxed">Use our AI interviewer to prepare</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-5 shadow-xl">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#c0fe72]/30">
                                <svg className="w-7 h-7 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="text-[#c0fe72] font-bold text-lg mb-2 text-center">📊 Track Progress</h4>
                            <p className="text-gray-300 text-sm text-center leading-relaxed">Monitor your improvement over time</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeFeedback;

