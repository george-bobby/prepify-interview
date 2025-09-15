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
        <div className="space-y-8">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-dark-200 via-dark-250 to-dark-300 rounded-xl p-8 border border-dark-300 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary-200/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-primary-100 mb-1">
                                    Resume Feedback
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-primary-200/20 text-primary-200 text-xs font-medium rounded-full">
                                        AI-Powered
                                    </span>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                                        Instant Analysis
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Credits on right side - small */}
                        {resumeCredits !== null && (
                            <div className="flex items-center gap-2 bg-dark-100/30 rounded-lg px-3 py-2 border border-dark-400/50">
                                <div className="w-6 h-6 bg-primary-200/20 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="text-right">
                                    <p className="text-primary-200 font-bold text-sm">{resumeCredits}</p>
                                    <p className="text-light-400 text-xs">credits left</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-primary-100 mb-4">
                    Upload Your Resume
                </h2>
                <ResumeUpload
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFile}
                />

                {uploadedFile && (
                    <div className="mt-6 flex gap-4">
                        <Button
                            onClick={handleAnalyzeResume}
                            disabled={isAnalyzing || (resumeCredits !== null && resumeCredits <= 0)}
                            className="bg-primary-200 hover:bg-primary-100 text-dark-100"
                        >
                            {isAnalyzing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                resumeCredits !== null && resumeCredits <= 0 ? 'No credits' : 'Analyze Resume'
                            )}
                        </Button>
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            disabled={isAnalyzing}
                        >
                            Reset
                        </Button>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-destructive-100/20 border border-destructive-100 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-destructive-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-destructive-100 font-medium">Error</span>
                    </div>
                    <p className="text-destructive-100 mt-2">{error}</p>
                </div>
            )}

            {/* Analysis Results */}
            {analysis && (
                <ResumeFeedback analysis={analysis} />
            )}
        </div>
    );
};

export default ResumePage;