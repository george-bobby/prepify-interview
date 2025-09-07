import { NextRequest, NextResponse } from 'next/server';
import { geminiInterviewEngine } from '@/lib/gemini-interview-engine';
import { interviewService } from '@/lib/firebase/interview-service';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { interviewId, userId, duration } = body;

		// Get interview details
		const interview = await interviewService.getInterview(interviewId);
		if (!interview) {
			return NextResponse.json(
				{ success: false, error: 'Interview not found' },
				{ status: 404 }
			);
		}

		// Verify user owns this interview
		if (interview.userId !== userId) {
			return NextResponse.json(
				{ success: false, error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		// Extract responses from interview data
		const responses = [];
		if (interview.responses) {
			for (let i = 0; i < interview.questions.length; i++) {
				const response = interview.responses[i];
				if (response) {
					responses.push({
						question: response.question,
						answer: response.answer,
						score: response.score,
						feedback: response.feedback,
					});
				}
			}
		}

		if (responses.length === 0) {
			return NextResponse.json(
				{ success: false, error: 'No responses found for this interview' },
				{ status: 400 }
			);
		}

		// Generate summary using Gemini
		const summary = await geminiInterviewEngine.generateSummary(
			responses,
			interview.config,
			duration || 'Unknown'
		);

		// Create feedback document using service
		const feedbackData = {
			interviewId,
			userId,
			totalScore: summary.totalScore,
			categoryScores: summary.categoryScores,
			strengths: summary.strengths,
			areasForImprovement: summary.areasForImprovement,
			recommendations: summary.recommendations,
			overallFeedback: summary.overallFeedback,
			interviewDuration: summary.interviewDuration,
			questionsAnswered: summary.questionsAnswered,
		};

		// Store feedback and update interview
		const feedbackId = await interviewService.createFeedback(feedbackData);
		await interviewService.completeInterview(interviewId, summary.totalScore);

		return NextResponse.json({
			success: true,
			feedbackId,
			summary,
		});
	} catch (error) {
		console.error('Error generating summary:', error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error ? error.message : 'Unknown error occurred',
			},
			{ status: 500 }
		);
	}
}
