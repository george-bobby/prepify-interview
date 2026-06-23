"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ResumeUpload from '@/components/ResumeUpload';
import ResumeFeedback from '@/components/ResumeFeedback';

interface ResumeAnalysis {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    summary: string;
}

const ResumePage = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [resumeCredits, setResumeCredits] = useState<number | 'Unlimited' | null>(null);

    const fetchCredits = async () => {
        try {
            const res = await fetch('/api/resume/credits', { method: 'GET' });
            if (!res.ok) return;
            const data = await res.json();
            if (data.isProSubscriber) {
                setResumeCredits('Unlimited');
            } else {
                setResumeCredits(data.resumeCredits);
            }
        } catch (e) {
            // ignore
        }
    };

    useEffect(() => {
        fetchCredits();
    }, []);

    const handleFileUpload = (file: File) => {
        setUploadedFile(file);
        setAnalysis(null);
        setError(null);
    };

    const handleAnalyzeResume = async () => {
        if (!uploadedFile) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('resume', uploadedFile);

            const response = await fetch('/api/resume/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to analyze resume');
            }

            const result = await response.json();
            setAnalysis(result);

            // Refresh credits from server after successful analysis
            await fetchCredits();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while analyzing your resume');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setUploadedFile(null);
        setAnalysis(null);
        setError(null);
    };

    return (
        <div className="space-y-5 md:space-y-6 relative">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-80 h-80 bg-[#c0fe72]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#9cd052]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#7cb342]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>

            {/* Hero Header Section */}
            <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-[#c0fe72]/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#c0fe72]/30 overflow-hidden">
                {/* Animated gradient overlays */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#c0fe72]/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#9cd052]/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-[#c0fe72]/40 animate-pulse">
                                <svg className="w-8 h-8 md:w-10 md:h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#c0fe72] via-[#d4ff8f] to-[#c0fe72] bg-clip-text text-transparent mb-3 leading-tight">
                                    AI Resume Analyzer
                                </h1>
                                <p className="text-gray-300 text-base md:text-lg mb-4 leading-relaxed">
                                    🎯 Get instant AI-powered feedback on your resume. Improve your chances of landing your dream job with personalized insights and recommendations.
                                </p>
                                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                    <span className="px-4 py-2 bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 text-[#c0fe72] text-xs md:text-sm font-bold rounded-full border-2 border-[#c0fe72]/40 shadow-lg shadow-[#c0fe72]/20">
                                        🤖 Advanced AI
                                    </span>
                                    <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs md:text-sm font-bold rounded-full border-2 border-purple-500/40 shadow-lg shadow-purple-500/20">
                                        ⚡ Instant Results
                                    </span>
                                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 text-xs md:text-sm font-bold rounded-full border-2 border-blue-500/40 shadow-lg shadow-blue-500/20">
                                        📊 Detailed Insights
                                    </span>
                                    <span className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 text-xs md:text-sm font-bold rounded-full border-2 border-orange-500/40 shadow-lg shadow-orange-500/20">
                                        💎 Professional Tips
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Credits Display - Enhanced */}
                        {resumeCredits !== null && (
                            <div className="bg-gradient-to-br from-[#c0fe72]/20 via-[#9cd052]/20 to-[#7cb342]/20 rounded-2xl p-5 border-2 border-[#c0fe72]/50 w-full lg:w-auto shadow-2xl shadow-[#c0fe72]/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#c0fe72]/40">
                                        <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[#c0fe72] font-extrabold text-3xl leading-none mb-1">{resumeCredits}</p>
                                        <p className="text-gray-300 text-sm font-semibold">Credits Available</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Section - Redesigned */}
            <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-[#9cd052]/40 rounded-3xl p-5 md:p-7 shadow-2xl shadow-[#9cd052]/20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-48 h-48 bg-[#c0fe72]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#7cb342]/10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#9cd052] to-[#7cb342] rounded-xl flex items-center justify-center shadow-xl shadow-[#9cd052]/40">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#9cd052] to-[#7cb342] bg-clip-text text-transparent">
                                Upload Your Resume
                            </h2>
                            <p className="text-gray-400 text-sm">PDF, DOC, DOCX • Max 5MB</p>
                        </div>
                    </div>
                    
                    <ResumeUpload
                        onFileUpload={handleFileUpload}
                        uploadedFile={uploadedFile}
                    />

                    {uploadedFile && (
                        <div className="mt-5 p-5 bg-white/5 border-2 border-[#c0fe72]/30 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-300 font-semibold text-sm">File Ready</p>
                                    <p className="text-gray-400 text-xs truncate">{uploadedFile.name}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={handleAnalyzeResume}
                                    disabled={isAnalyzing || (resumeCredits !== null && resumeCredits !== 'Unlimited' && resumeCredits <= 0)}
                                    className="bg-gradient-to-r from-[#c0fe72] via-[#9cd052] to-[#c0fe72] text-black font-extrabold text-base w-full sm:flex-1 shadow-2xl shadow-[#c0fe72]/40 disabled:opacity-50 py-6 rounded-xl"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing Your Resume...
                                        </>
                                    ) : (
                                        resumeCredits !== null && resumeCredits !== 'Unlimited' && resumeCredits <= 0 ? '❌ No Credits Available' : '🚀 Analyze Resume Now'
                                    )}
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    disabled={isAnalyzing}
                                    className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/40 text-red-300 font-bold text-base w-full sm:w-auto disabled:opacity-50 py-6 rounded-xl shadow-lg shadow-red-500/20"
                                >
                                    🔄 Reset & Upload New
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Display - Enhanced */}
            {error && (
                <div className="relative bg-gradient-to-br from-red-500/20 via-red-600/20 to-orange-500/20 border-2 border-red-500/50 rounded-3xl p-6 shadow-2xl shadow-red-500/30 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-2xl"></div>
                    </div>
                    
                    <div className="relative z-10 flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-red-500/40 shadow-xl">
                            <svg className="w-7 h-7 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-red-400 font-extrabold text-xl mb-2">❌ Error Occurred</h4>
                            <p className="text-red-200 text-base leading-relaxed">{error}</p>
                            <Button
                                onClick={handleReset}
                                className="mt-4 bg-gradient-to-r from-red-500/30 to-orange-500/30 border-2 border-red-500/50 text-red-200 font-bold shadow-lg shadow-red-500/20"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Results */}
            {analysis && (
                <div className="relative">
                    <ResumeFeedback analysis={analysis} />
                </div>
            )}
        </div>
    );
};

export default ResumePage;