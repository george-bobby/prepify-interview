"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportInterviewToPDF, exportHTMLElementToPDF, InterviewReportData } from '@/lib/pdf-export';

interface PDFExportButtonProps {
    interview: any;
    feedback: any;
    className?: string;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({
    interview,
    feedback,
    className = "",
}) => {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExportPDF = async () => {
        try {
            setIsExporting(true);
            setError(null);

            // Prepare data for PDF export
            const reportData: InterviewReportData = {
                interviewId: interview.id,
                role: interview.role,
                type: interview.type,
                level: interview.level || 'N/A',
                techStack: interview.techstack || [],
                totalScore: feedback.totalScore,
                categoryScores: feedback.categoryScores?.map((category: any) => ({
                    category: category.category || category.name,
                    score: category.score,
                    feedback: category.feedback || category.comment,
                })) || [],
                strengths: feedback.strengths || [],
                areasForImprovement: feedback.areasForImprovement || [],
                recommendations: feedback.recommendations || [],
                overallFeedback: feedback.overallFeedback || feedback.finalAssessment,
                interviewDate: new Date(feedback.createdAt).toLocaleDateString(),
                duration: feedback.interviewDuration || 'N/A',
                questionsAnswered: feedback.questionsAnswered || interview.questions?.length || 0,
            };

            await exportInterviewToPDF(reportData);
        } catch (err) {
            console.error('Error exporting PDF:', err);
            setError('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportHTMLToPDF = async () => {
        try {
            setIsExporting(true);
            setError(null);

            const filename = `interview-feedback-${interview.role.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
            await exportHTMLElementToPDF('feedback-content', filename);
        } catch (err) {
            console.error('Error exporting HTML to PDF:', err);
            setError('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
                >
                    {isExporting ? (
                        <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Exporting...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            📄 Export PDF
                        </span>
                    )}
                </Button>

                <Button
                    onClick={handleExportHTMLToPDF}
                    disabled={isExporting}
                    className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
                >
                    {isExporting ? (
                        <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Exporting...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            🖼️ Export as Image PDF
                        </span>
                    )}
                </Button>
            </div>

            {error && (
                <div className="text-red-400 text-sm">
                    {error}
                    <button 
                        className="ml-2 underline"
                        onClick={() => setError(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    );
};
