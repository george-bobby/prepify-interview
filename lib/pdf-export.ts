import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface InterviewReportData {
    interviewId: string;
    role: string;
    type: string;
    level: string;
    techStack: string[];
    totalScore: number;
    categoryScores: Array<{
        category: string;
        score: number;
        feedback: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    recommendations?: string[];
    overallFeedback: string;
    interviewDate: string;
    duration: string;
    questionsAnswered: number;
}

export class InterviewPDFExporter {
    private pdf: jsPDF;
    private pageHeight: number;
    private pageWidth: number;
    private margin: number;
    private currentY: number;

    constructor() {
        this.pdf = new jsPDF();
        this.pageHeight = this.pdf.internal.pageSize.height;
        this.pageWidth = this.pdf.internal.pageSize.width;
        this.margin = 20;
        this.currentY = this.margin;
    }

    async generateReport(data: InterviewReportData): Promise<void> {
        this.addHeader(data);
        this.addOverviewSection(data);
        this.addScoreBreakdown(data);
        this.addStrengthsAndImprovements(data);
        this.addRecommendations(data);
        this.addFooter();
    }

    private addHeader(data: InterviewReportData): void {
        // Title
        this.pdf.setFontSize(24);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('Interview Feedback Report', this.margin, this.currentY);
        this.currentY += 15;

        // Subtitle
        this.pdf.setFontSize(16);
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.text(`${data.role} Interview - ${data.type}`, this.margin, this.currentY);
        this.currentY += 10;

        // Date and score
        this.pdf.setFontSize(12);
        this.pdf.text(`Date: ${data.interviewDate}`, this.margin, this.currentY);
        this.pdf.text(`Overall Score: ${data.totalScore}/10`, this.pageWidth - 60, this.currentY);
        this.currentY += 15;

        // Horizontal line
        this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
        this.currentY += 10;
    }

    private addOverviewSection(data: InterviewReportData): void {
        this.addSectionTitle('Interview Overview');
        
        // Basic info
        const info = [
            `Role: ${data.role}`,
            `Type: ${data.type}`,
            `Level: ${data.level}`,
            `Duration: ${data.duration}`,
            `Questions Answered: ${data.questionsAnswered}`,
        ];

        if (data.techStack && data.techStack.length > 0) {
            info.push(`Tech Stack: ${data.techStack.join(', ')}`);
        }

        this.pdf.setFontSize(10);
        info.forEach(line => {
            this.pdf.text(line, this.margin, this.currentY);
            this.currentY += 6;
        });

        this.currentY += 5;

        // Overall feedback
        this.addSubsectionTitle('Overall Assessment');
        this.addWrappedText(data.overallFeedback);
        this.currentY += 10;
    }

    private addScoreBreakdown(data: InterviewReportData): void {
        this.addSectionTitle('Performance Breakdown');

        data.categoryScores.forEach(category => {
            this.pdf.setFontSize(12);
            this.pdf.setFont('helvetica', 'bold');
            this.pdf.text(`${category.category}: ${category.score}/10`, this.margin, this.currentY);
            this.currentY += 8;

            this.pdf.setFontSize(10);
            this.pdf.setFont('helvetica', 'normal');
            this.addWrappedText(category.feedback, this.margin + 10);
            this.currentY += 5;
        });

        this.currentY += 10;
    }

    private addStrengthsAndImprovements(data: InterviewReportData): void {
        // Strengths
        this.addSectionTitle('Strengths');
        this.pdf.setFontSize(10);
        data.strengths.forEach((strength, index) => {
            this.pdf.text(`• ${strength}`, this.margin + 5, this.currentY);
            this.currentY += 6;
        });
        this.currentY += 5;

        // Areas for improvement
        this.addSectionTitle('Areas for Improvement');
        this.pdf.setFontSize(10);
        data.areasForImprovement.forEach((area, index) => {
            this.pdf.text(`• ${area}`, this.margin + 5, this.currentY);
            this.currentY += 6;
        });
        this.currentY += 10;
    }

    private addRecommendations(data: InterviewReportData): void {
        if (data.recommendations && data.recommendations.length > 0) {
            this.addSectionTitle('Recommendations');
            this.pdf.setFontSize(10);
            data.recommendations.forEach((recommendation, index) => {
                this.pdf.text(`• ${recommendation}`, this.margin + 5, this.currentY);
                this.currentY += 6;
            });
        }
    }

    private addFooter(): void {
        const footerY = this.pageHeight - 20;
        this.pdf.setFontSize(8);
        this.pdf.setFont('helvetica', 'italic');
        this.pdf.text('Generated by Prepify AI Interview Platform', this.margin, footerY);
        this.pdf.text(`Generated on ${new Date().toLocaleDateString()}`, this.pageWidth - 80, footerY);
    }

    private addSectionTitle(title: string): void {
        this.checkPageBreak(20);
        this.pdf.setFontSize(14);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(title, this.margin, this.currentY);
        this.currentY += 12;
    }

    private addSubsectionTitle(title: string): void {
        this.checkPageBreak(15);
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(title, this.margin, this.currentY);
        this.currentY += 10;
    }

    private addWrappedText(text: string, leftMargin: number = this.margin): void {
        this.pdf.setFont('helvetica', 'normal');
        const maxWidth = this.pageWidth - leftMargin - this.margin;
        const lines = this.pdf.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
            this.checkPageBreak(6);
            this.pdf.text(line, leftMargin, this.currentY);
            this.currentY += 6;
        });
    }

    private checkPageBreak(requiredSpace: number): void {
        if (this.currentY + requiredSpace > this.pageHeight - 30) {
            this.pdf.addPage();
            this.currentY = this.margin;
        }
    }

    save(filename: string): void {
        this.pdf.save(filename);
    }

    getBlob(): Blob {
        return this.pdf.output('blob');
    }
}

// Utility function to export interview feedback as PDF
export const exportInterviewToPDF = async (data: InterviewReportData): Promise<void> => {
    const exporter = new InterviewPDFExporter();
    await exporter.generateReport(data);
    
    const filename = `interview-feedback-${data.role.toLowerCase().replace(/\s+/g, '-')}-${data.interviewDate.replace(/[^\d]/g, '')}.pdf`;
    exporter.save(filename);
};

// Alternative method using HTML to PDF conversion
export const exportHTMLElementToPDF = async (
    elementId: string, 
    filename: string = 'interview-feedback.pdf'
): Promise<void> => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(filename);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
};
