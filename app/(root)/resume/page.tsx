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
    const [resumeCredits, setResumeCredits] = useState<number | null>(null);

    const fetchCredits = async () => {
        try {
            const res = await fetch('/api/resume/credits', { method: 'GET' });
            if (!res.ok) return;
            const data = await res.json();
            setResumeCredits(data.resumeCredits);
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
        <div className="space-y-4 md:space-y-6">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#9cd052]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#7cb342]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Header */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-4 md:p-6 shadow-2xl shadow-[#c0fe72]/20 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#c0fe72]/5 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#9cd052]/5 rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#c0fe72]/30">
                                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-[#c0fe72] mb-1">
                                    Resume Feedback
                                </h1>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 bg-[#c0fe72]/10 text-[#c0fe72] text-xs font-semibold rounded-full border border-[#c0fe72]/30">
                                        🤖 AI-Powered
                                    </span>
                                    <span className="px-3 py-1 bg-[#9cd052]/10 text-[#9cd052] text-xs font-semibold rounded-full border border-[#9cd052]/30">
                                        ⚡ Instant Analysis
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Credits on right side - small */}
                        {resumeCredits !== null && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-[#c0fe72]/10 to-[#9cd052]/10 rounded-xl px-3 py-2 border border-[#c0fe72]/30 w-full sm:w-auto justify-between sm:justify-start shadow-lg shadow-[#c0fe72]/10">
                                <div className="w-6 h-6 bg-[#c0fe72]/20 rounded-full flex items-center justify-center flex-shrink-0 border border-[#c0fe72]/30">
                                    <svg className="w-3 h-3 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#c0fe72] font-bold text-sm">{resumeCredits}</p>
                                    <p className="text-gray-400 text-xs">credits left</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-4 md:p-6 shadow-2xl shadow-[#c0fe72]/20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#c0fe72]/5 rounded-full blur-2xl"></div>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-lg flex items-center justify-center border border-[#c0fe72]/30">
                            <svg className="w-4 h-4 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <h2 className="text-base md:text-lg font-bold text-[#c0fe72]">
                            Upload Your Resume
                        </h2>
                    </div>
                    <ResumeUpload
                        onFileUpload={handleFileUpload}
                        uploadedFile={uploadedFile}
                    />

                    {uploadedFile && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 md:gap-3">
                            <Button
                                onClick={handleAnalyzeResume}
                                disabled={isAnalyzing || (resumeCredits !== null && resumeCredits <= 0)}
                                className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold w-full sm:w-auto shadow-lg shadow-[#c0fe72]/30 disabled:opacity-50"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    resumeCredits !== null && resumeCredits <= 0 ? '❌ No credits' : '🚀 Analyze Resume'
                                )}
                            </Button>
                            <Button
                                onClick={handleReset}
                                disabled={isAnalyzing}
                                className="bg-white/5 border-2 border-gray-700 text-gray-300 font-semibold w-full sm:w-auto disabled:opacity-50"
                            >
                                🔄 Reset
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="relative bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-4 flex items-start gap-3 shadow-xl">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-red-400 font-bold mb-1">Error</h4>
                        <p className="text-red-300 text-sm">{error}</p>
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