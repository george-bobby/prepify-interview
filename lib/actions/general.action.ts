'use server';

import { feedbackSchema } from '@/constants';
import { db } from '@/firebase/admin';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
export async function getInterviewsByUserId(
	userId: string
): Promise<Interview[] | null> {
	const interviews = await db
		.collection('interviews')
		.where('userId', '==', userId)
		.orderBy('createdAt', 'desc')
		.get();
	return interviews.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	})) as Interview[];
}

export async function getLatestInterviews(
	params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
	const { userId, limit = 20 } = params;
	const interviews = await db
		.collection('interviews')
		.orderBy('createdAt', 'desc')
		.where('finalized', '==', true)
		.where('userId', '!=', userId)
		.limit(limit)
		.get();
	return interviews.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	})) as Interview[];
}

export async function getInterviewsById(id: string): Promise<Interview | null> {
	const interview = await db.collection('interviews').doc(id).get();
	return interview.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
	const { interviewId, userId, transcript, feedbackId } = params;

	try {
		const formattedTranscript = transcript
			.map(
				(sentence: { role: string; content: string }) =>
					`- ${sentence.role}: ${sentence.content}\n`
			)
			.join('');

		const { object } = await generateObject({
			model: google('gemini-2.0-flash-001', {
				structuredOutputs: false,
			}),
			schema: feedbackSchema,
			prompt: `
                      You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
                      Transcript:
                      ${formattedTranscript}
              
                      Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
                      - **Communication Skills**: Clarity, articulation, structured responses.
                      - **Technical Knowledge**: Understanding of key concepts for the role.
                      - **Problem-Solving**: Ability to analyze problems and propose solutions.
                      - **Cultural & Role Fit**: Alignment with company values and job role.
                      - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
                      `,
			system:
				'You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories',
		});

		const feedback = {
			interviewId: interviewId,
			userId: userId,
			totalScore: object.totalScore,
			categoryScores: object.categoryScores,
			strengths: object.strengths,
			areasForImprovement: object.areasForImprovement,
			finalAssessment: object.finalAssessment,
			createdAt: new Date().toISOString(),
		};

		let feedbackRef;

		if (feedbackId) {
			feedbackRef = db.collection('feedback').doc(feedbackId);
		} else {
			feedbackRef = db.collection('feedback').doc();
		}

		await feedbackRef.set(feedback);

		return { success: true, feedbackId: feedbackRef.id };
	} catch (error) {
		console.error('Error saving feedback:', error);
		return { success: false };
	}
}

export async function getFeedbackByInterviewId(
	params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
	const { interviewId, userId } = params;
	const feedback = await db
		.collection('feedback')
		.where('interviewId', '==', interviewId)
		.where('userId', '==', userId)
		.limit(1)
		.get();
	if (feedback.empty) {
		return null;
	}
	const feedbackDoc = feedback.docs[0];
	return {
		id: feedbackDoc.id,
		...feedbackDoc.data(),
	} as Feedback;
}

// Dashboard-specific functions
export async function getDashboardStats(userId: string) {
	try {
		// Get user's interviews
		const interviewsSnapshot = await db
			.collection('interviews')
			.where('userId', '==', userId)
			.get();

		const interviews = interviewsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Interview[];

		// Get user's feedback
		const feedbackSnapshot = await db
			.collection('feedback')
			.where('userId', '==', userId)
			.get();

		const feedbacks = feedbackSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Feedback[];

		// Calculate statistics
		const totalInterviews = interviews.length;
		const completedInterviews = interviews.filter((i) => i.finalized).length;
		const thisMonthInterviews = interviews.filter((i) => {
			const interviewDate = new Date(i.createdAt);
			const now = new Date();
			return (
				interviewDate.getMonth() === now.getMonth() &&
				interviewDate.getFullYear() === now.getFullYear()
			);
		}).length;

		// Calculate average score
		const averageScore =
			feedbacks.length > 0
				? Math.round(
						feedbacks.reduce((sum, f) => sum + f.totalScore, 0) /
							feedbacks.length
				  )
				: 0;

		// Determine user level based on average score
		let userLevel = 'Beginner';
		if (averageScore >= 80) userLevel = 'Expert';
		else if (averageScore >= 70) userLevel = 'Advanced';
		else if (averageScore >= 60) userLevel = 'Intermediate';

		// Get recent activity (last 5 interviews)
		const recentInterviews = interviews
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			)
			.slice(0, 5);

		// Get performance trends (last 6 months)
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		const monthlyStats = [];
		for (let i = 5; i >= 0; i--) {
			const monthStart = new Date();
			monthStart.setMonth(monthStart.getMonth() - i);
			monthStart.setDate(1);

			const monthEnd = new Date(monthStart);
			monthEnd.setMonth(monthEnd.getMonth() + 1);
			monthEnd.setDate(0);

			const monthInterviews = interviews.filter((i) => {
				const interviewDate = new Date(i.createdAt);
				return interviewDate >= monthStart && interviewDate <= monthEnd;
			});

			const monthFeedbacks = feedbacks.filter((f) => {
				const feedbackDate = new Date(f.createdAt);
				return feedbackDate >= monthStart && feedbackDate <= monthEnd;
			});

			const monthAverage =
				monthFeedbacks.length > 0
					? Math.round(
							monthFeedbacks.reduce((sum, f) => sum + f.totalScore, 0) /
								monthFeedbacks.length
					  )
					: 0;

			monthlyStats.push({
				month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
				interviews: monthInterviews.length,
				averageScore: monthAverage,
			});
		}

		return {
			totalInterviews,
			completedInterviews,
			thisMonthInterviews,
			averageScore,
			userLevel,
			recentInterviews,
			monthlyStats,
			totalFeedbacks: feedbacks.length,
		};
	} catch (error) {
		console.error('Error fetching dashboard stats:', error);
		return {
			totalInterviews: 0,
			completedInterviews: 0,
			thisMonthInterviews: 0,
			averageScore: 0,
			userLevel: 'Beginner',
			recentInterviews: [],
			monthlyStats: [],
			totalFeedbacks: 0,
		};
	}
}

export async function getUserProgress(userId: string) {
	try {
		const feedbackSnapshot = await db
			.collection('feedback')
			.where('userId', '==', userId)
			.orderBy('createdAt', 'desc')
			.get();

		const feedbacks = feedbackSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Feedback[];

		if (feedbacks.length === 0) {
			return {
				overallProgress: 0,
				skillBreakdown: {},
				improvementAreas: [],
				strengths: [],
			};
		}

		// Calculate overall progress (average of all scores)
		const overallProgress = Math.round(
			feedbacks.reduce((sum, f) => sum + f.totalScore, 0) / feedbacks.length
		);

		// Calculate skill breakdown from latest feedback
		const latestFeedback = feedbacks[0];
		const skillBreakdown = latestFeedback.categoryScores.reduce(
			(acc, category) => {
				acc[category.name] = category.score;
				return acc;
			},
			{} as Record<string, number>
		);

		// Get most common improvement areas
		const allImprovementAreas = feedbacks.flatMap((f) => f.areasForImprovement);
		const improvementCounts = allImprovementAreas.reduce((acc, area) => {
			acc[area] = (acc[area] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const improvementAreas = Object.entries(improvementCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 3)
			.map(([area]) => area);

		// Get most common strengths
		const allStrengths = feedbacks.flatMap((f) => f.strengths);
		const strengthCounts = allStrengths.reduce((acc, strength) => {
			acc[strength] = (acc[strength] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const strengths = Object.entries(strengthCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 3)
			.map(([strength]) => strength);

		return {
			overallProgress,
			skillBreakdown,
			improvementAreas,
			strengths,
		};
	} catch (error) {
		console.error('Error fetching user progress:', error);
		return {
			overallProgress: 0,
			skillBreakdown: {},
			improvementAreas: [],
			strengths: [],
		};
	}
}
