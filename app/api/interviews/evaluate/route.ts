import { NextRequest, NextResponse } from 'next/server';
import { geminiInterviewEngine } from '@/lib/gemini-interview-engine';
import { interviewService } from '@/lib/firebase/interview-service';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { interviewId, questionIndex, question, answer, userId } = body;

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

		// Evaluate the response using Gemini
		const evaluation = await geminiInterviewEngine.evaluateResponse(
			question,
			answer,
			interview.config,
			`Question ${questionIndex + 1} of ${interview.questions.length}`
		);

		// Store the response and evaluation
		const responseData = {
			questionIndex,
			question,
			answer,
			score: evaluation.score,
			feedback: evaluation.feedback,
			strengths: evaluation.strengths,
			improvements: evaluation.improvements,
			timestamp: new Date().toISOString(),
		};

		// Update interview document with the response using service
		await interviewService.addInterviewResponse(
			interviewId,
			questionIndex,
			responseData
		);

		// Generate follow-up question if needed
		let followUpQuestion = null;
		if (evaluation.followUpQuestion && evaluation.shouldContinue) {
			followUpQuestion = evaluation.followUpQuestion;
		}

		// Generate interviewer response
		const interviewerResponse =
			await geminiInterviewEngine.generateInterviewerResponse(
				`Interview for ${interview.role} position. Current question: ${question}`,
				answer,
				followUpQuestion ||
					(questionIndex + 1 < interview.questions.length
						? interview.questions[questionIndex + 1]
						: undefined)
			);

		return NextResponse.json({
			success: true,
			evaluation: {
				score: evaluation.score,
				feedback: evaluation.feedback,
				strengths: evaluation.strengths,
				improvements: evaluation.improvements,
			},
			interviewerResponse,
			followUpQuestion,
			shouldContinue: evaluation.shouldContinue,
			isLastQuestion: questionIndex + 1 >= interviewData.questions.length,
		});
	} catch (error) {
		console.error('Error evaluating response:', error);
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
