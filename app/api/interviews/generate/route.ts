import { NextRequest, NextResponse } from 'next/server';
import { geminiInterviewEngine } from '@/lib/gemini-interview-engine';
import { interviewConfigSchema } from '@/lib/schemas/interview';
import { interviewService } from '@/lib/firebase/interview-service';
import { getRandomInterviewCover } from '@/lib/utils';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { config, questionCount = 5, userId } = body;

		// Validate the interview configuration
		const validatedConfig = interviewConfigSchema.parse(config);

		// Generate questions using Gemini
		const questionGeneration = await geminiInterviewEngine.generateQuestions(
			validatedConfig,
			questionCount
		);

		// Create interview object for storage
		const interviewData = {
			userId,
			role: validatedConfig.role,
			level: validatedConfig.level,
			type: validatedConfig.mode,
			techstack:
				'techStack' in validatedConfig ? validatedConfig.techStack : [],
			questions: questionGeneration.questions,
			difficulty: questionGeneration.difficulty,
			estimatedDuration: questionGeneration.estimatedDuration,
			config: validatedConfig,
			status: 'not_started' as const,
			coverImage: getRandomInterviewCover(),
		};

		// Store interview in Firestore using service
		const interviewId = await interviewService.createInterview(interviewData);

		// Deduct credit from user
		await interviewService.deductUserCredit(userId);

		return NextResponse.json({
			success: true,
			interviewId,
			questions: questionGeneration.questions,
			difficulty: questionGeneration.difficulty,
			estimatedDuration: questionGeneration.estimatedDuration,
		});
	} catch (error) {
		console.error('Error generating interview:', error);
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

export async function GET() {
	return NextResponse.json({
		success: true,
		message: 'Interview generation API is ready',
	});
}
