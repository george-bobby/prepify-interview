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

    useEffect(() => {
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
            <div className="bg-gradient-to-r from-dark-200 to-dark-300 rounded-lg p-8 border border-dark-300">
                <h1 className="text-3xl font-bold text-primary-100 mb-2">
                    Resume Feedback
                </h1>
                <p className="text-light-400 text-lg">
                    Upload your resume and get AI-powered feedback to improve your chances of landing your dream job.
                </p>
                {resumeCredits !== null && (
                    <div className="mt-4 text-light-300">
                        Resume review credits remaining this month: <span className="text-primary-200 font-semibold">{resumeCredits}</span>
                    </div>
                )}
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