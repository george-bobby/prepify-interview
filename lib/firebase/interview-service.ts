import { db } from '@/firebase/admin';
import { InterviewConfig, InterviewSummary } from '@/lib/schemas/interview';
import admin from 'firebase-admin';

export interface InterviewDocument {
	id?: string;
	userId: string;
	role: string;
	level: string;
	type: string;
	techstack: string[];
	questions: string[];
	difficulty?: string;
	estimatedDuration?: string;
	config: InterviewConfig;
	status: 'not_started' | 'in_progress' | 'completed' | 'paused';
	coverImage?: string;
	createdAt: string;
	updatedAt?: string;
	completedAt?: string;
	feedbackId?: string;
	finalScore?: number;
	responses?: { [key: number]: InterviewResponse };
}

export interface InterviewResponse {
	questionIndex: number;
	question: string;
	answer: string;
	score: number;
	feedback: string;
	strengths: string[];
	improvements: string[];
	timestamp: string;
}

export interface FeedbackDocument {
	id?: string;
	interviewId: string;
	userId: string;
	totalScore: number;
	categoryScores: Array<{
		category: string;
		score: number;
		feedback: string;
	}>;
	strengths: string[];
	areasForImprovement: string[];
	recommendations: string[];
	overallFeedback: string;
	interviewDuration: string;
	questionsAnswered: number;
	createdAt: string;
}

export class InterviewFirebaseService {
	private interviewsCollection = db.collection('interviews');
	private feedbackCollection = db.collection('feedback');
	private usersCollection = db.collection('users');

	/**
	 * Create a new interview
	 */
	async createInterview(
		interviewData: Omit<InterviewDocument, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<string> {
		const docData = {
			...interviewData,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const docRef = await this.interviewsCollection.add(docData);
		return docRef.id;
	}

	/**
	 * Get interview by ID
	 */
	async getInterview(interviewId: string): Promise<InterviewDocument | null> {
		const doc = await this.interviewsCollection.doc(interviewId).get();
		if (!doc.exists) return null;

		return {
			id: doc.id,
			...doc.data(),
		} as InterviewDocument;
	}

	/**
	 * Get interviews by user ID with pagination and filtering
	 */
	async getInterviewsByUserId(
		userId: string,
		options: {
			limit?: number;
			startAfter?: string;
			status?: string;
			type?: string;
		} = {}
	): Promise<InterviewDocument[]> {
		let query = this.interviewsCollection
			.where('userId', '==', userId)
			.orderBy('createdAt', 'desc');

		if (options.status) {
			query = query.where('status', '==', options.status);
		}

		if (options.type) {
			query = query.where('type', '==', options.type);
		}

		if (options.limit) {
			query = query.limit(options.limit);
		}

		if (options.startAfter) {
			const startAfterDoc = await this.interviewsCollection
				.doc(options.startAfter)
				.get();
			query = query.startAfter(startAfterDoc);
		}

		const snapshot = await query.get();
		return snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as InterviewDocument[];
	}

	/**
	 * Update interview status and data
	 */
	async updateInterview(
		interviewId: string,
		updates: Partial<InterviewDocument>
	): Promise<void> {
		const updateData = {
			...updates,
			updatedAt: new Date().toISOString(),
		};

		await this.interviewsCollection.doc(interviewId).update(updateData);
	}

	/**
	 * Add response to interview
	 */
	async addInterviewResponse(
		interviewId: string,
		questionIndex: number,
		response: InterviewResponse
	): Promise<void> {
		await this.interviewsCollection.doc(interviewId).update({
			[`responses.${questionIndex}`]: response,
			updatedAt: new Date().toISOString(),
		});
	}

	/**
	 * Complete interview
	 */
	async completeInterview(
		interviewId: string,
		finalScore?: number
	): Promise<void> {
		await this.interviewsCollection.doc(interviewId).update({
			status: 'completed',
			completedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			...(finalScore && { finalScore }),
		});
	}

	/**
	 * Create feedback document
	 */
	async createFeedback(
		feedbackData: Omit<FeedbackDocument, 'id' | 'createdAt'>
	): Promise<string> {
		const docData = {
			...feedbackData,
			createdAt: new Date().toISOString(),
		};

		const docRef = await this.feedbackCollection.add(docData);

		// Update interview with feedback ID
		await this.interviewsCollection.doc(feedbackData.interviewId).update({
			feedbackId: docRef.id,
			updatedAt: new Date().toISOString(),
		});

		return docRef.id;
	}

	/**
	 * Get feedback by interview ID
	 */
	async getFeedbackByInterviewId(
		interviewId: string
	): Promise<FeedbackDocument | null> {
		const snapshot = await this.feedbackCollection
			.where('interviewId', '==', interviewId)
			.limit(1)
			.get();

		if (snapshot.empty) return null;

		const doc = snapshot.docs[0];
		return {
			id: doc.id,
			...doc.data(),
		} as FeedbackDocument;
	}

	/**
	 * Get feedback by ID
	 */
	async getFeedback(feedbackId: string): Promise<FeedbackDocument | null> {
		const doc = await this.feedbackCollection.doc(feedbackId).get();
		if (!doc.exists) return null;

		return {
			id: doc.id,
			...doc.data(),
		} as FeedbackDocument;
	}

	/**
	 * Delete interview and associated feedback
	 */
	async deleteInterview(interviewId: string, userId: string): Promise<void> {
		// Verify ownership
		const interview = await this.getInterview(interviewId);
		if (!interview || interview.userId !== userId) {
			throw new Error('Interview not found or access denied');
		}

		// Delete feedback if exists
		if (interview.feedbackId) {
			await this.feedbackCollection.doc(interview.feedbackId).delete();
		}

		// Delete interview
		await this.interviewsCollection.doc(interviewId).delete();
	}

	/**
	 * Get user statistics
	 */
	async getUserInterviewStats(userId: string): Promise<{
		total: number;
		completed: number;
		inProgress: number;
		averageScore: number;
		totalScore: number;
	}> {
		const interviews = await this.getInterviewsByUserId(userId);

		const completed = interviews.filter((i) => i.status === 'completed').length;
		const inProgress = interviews.filter(
			(i) => i.status === 'in_progress'
		).length;

		const scoresSum = interviews
			.filter((i) => i.finalScore)
			.reduce((sum, i) => sum + (i.finalScore || 0), 0);

		const averageScore =
			completed > 0 ? Math.round((scoresSum / completed) * 10) / 10 : 0;

		return {
			total: interviews.length,
			completed,
			inProgress,
			averageScore,
			totalScore: scoresSum,
		};
	}

	/**
	 * Deduct user credit (interviews)
	 */
	async deductUserCredit(userId: string): Promise<void> {
		const userRef = this.usersCollection.doc(userId);
		await db.runTransaction(async (tx) => {
			const snapshot = await tx.get(userRef);
			const now = new Date();
			const nowMs = now.getTime();

			if (!snapshot.exists) {
				// Initialize user with monthly credits
				tx.set(
					userRef,
					{
						credits: 9, // deduct 1 from 10 for this action
						lastCreditRenewalAt: now.toISOString(),
					},
					{ merge: true }
				);
				return;
			}

			const data = snapshot.data() as any;

			// Pro subscribers don't need credit deduction
			if (data?.isProSubscriber && data?.subscriptionStatus === 'active') {
				return; // No deduction for pro subscribers
			}

			const currentCredits: number =
				typeof data?.credits === 'number' ? data.credits : 0;
			const lastRenewalIso: string | undefined = data?.lastCreditRenewalAt;

			let creditsToUseFrom = currentCredits;

			// Check monthly renewal boundary
			const shouldRenew = (() => {
				if (!lastRenewalIso) return true;
				const last = new Date(lastRenewalIso);
				// Renew if month or year changed, or >= 30 days elapsed as a fallback
				const monthChanged =
					last.getUTCFullYear() !== now.getUTCFullYear() ||
					last.getUTCMonth() !== now.getUTCMonth();
				const daysElapsed = (nowMs - last.getTime()) / (1000 * 60 * 60 * 24);
				return monthChanged || daysElapsed >= 30;
			})();

			if (shouldRenew) {
				creditsToUseFrom = 10;
			}

			if (creditsToUseFrom <= 0) {
				throw new Error('No credits remaining');
			}

			const updatedCredits = creditsToUseFrom - 1;

			tx.update(userRef, {
				credits: updatedCredits,
				lastCreditRenewalAt: shouldRenew
					? now.toISOString()
					: lastRenewalIso || now.toISOString(),
			});
		});
	}

	/**
	 * Get user credits (interviews)
	 */
	async getUserCredits(userId: string): Promise<number> {
		const userRef = this.usersCollection.doc(userId);
		const now = new Date();
		const doc = await userRef.get();
		if (!doc.exists) {
			// Initialize on first read
			await userRef.set(
				{ credits: 10, lastCreditRenewalAt: now.toISOString() },
				{ merge: true }
			);
			return 10;
		}

		const data = doc.data() as any;

		// Pro subscribers get unlimited credits (999)
		if (data?.isProSubscriber && data?.subscriptionStatus === 'active') {
			return 999;
		}

		const currentCredits: number =
			typeof data?.credits === 'number' ? data.credits : 0;
		const lastRenewalIso: string | undefined = data?.lastCreditRenewalAt;

		const shouldRenew = (() => {
			if (!lastRenewalIso) return true;
			const last = new Date(lastRenewalIso);
			const monthChanged =
				last.getUTCFullYear() !== now.getUTCFullYear() ||
				last.getUTCMonth() !== now.getUTCMonth();
			const daysElapsed =
				(now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
			return monthChanged || daysElapsed >= 30;
		})();

		if (shouldRenew) {
			await userRef.update({
				credits: 10,
				lastCreditRenewalAt: now.toISOString(),
			});
			return 10;
		}

		return currentCredits;
	}

	/**
	 * Deduct resume review credit
	 */
	async deductResumeCredit(userId: string): Promise<void> {
		const userRef = this.usersCollection.doc(userId);
		await db.runTransaction(async (tx) => {
			const snapshot = await tx.get(userRef);
			const now = new Date();
			const nowMs = now.getTime();

			if (!snapshot.exists) {
				tx.set(
					userRef,
					{
						resumeCredits: 9,
						lastResumeCreditRenewalAt: now.toISOString(),
					},
					{ merge: true }
				);
				return;
			}

			const data = snapshot.data() as any;

			// Pro subscribers don't need credit deduction
			if (data?.isProSubscriber && data?.subscriptionStatus === 'active') {
				return; // No deduction for pro subscribers
			}

			const currentCredits: number =
				typeof data?.resumeCredits === 'number' ? data.resumeCredits : 0;
			const lastRenewalIso: string | undefined =
				data?.lastResumeCreditRenewalAt;

			let creditsToUseFrom = currentCredits;

			const shouldRenew = (() => {
				if (!lastRenewalIso) return true;
				const last = new Date(lastRenewalIso);
				const monthChanged =
					last.getUTCFullYear() !== now.getUTCFullYear() ||
					last.getUTCMonth() !== now.getUTCMonth();
				const daysElapsed = (nowMs - last.getTime()) / (1000 * 60 * 60 * 24);
				return monthChanged || daysElapsed >= 30;
			})();

			if (shouldRenew) {
				creditsToUseFrom = 10;
			}

			if (creditsToUseFrom <= 0) {
				throw new Error('No resume review credits remaining');
			}

			const updatedCredits = creditsToUseFrom - 1;

			tx.update(userRef, {
				resumeCredits: updatedCredits,
				lastResumeCreditRenewalAt: shouldRenew
					? now.toISOString()
					: lastRenewalIso || now.toISOString(),
			});
		});
	}

	/**
	 * Get resume review credits
	 */
	async getResumeCredits(userId: string): Promise<number> {
		const userRef = this.usersCollection.doc(userId);
		const now = new Date();
		const doc = await userRef.get();
		if (!doc.exists) {
			await userRef.set(
				{ resumeCredits: 10, lastResumeCreditRenewalAt: now.toISOString() },
				{ merge: true }
			);
			return 10;
		}

		const data = doc.data() as any;

		// Pro subscribers get unlimited credits (999)
		if (data?.isProSubscriber && data?.subscriptionStatus === 'active') {
			return 999;
		}

		const currentCredits: number =
			typeof data?.resumeCredits === 'number' ? data.resumeCredits : 0;
		const lastRenewalIso: string | undefined = data?.lastResumeCreditRenewalAt;

		const shouldRenew = (() => {
			if (!lastRenewalIso) return true;
			const last = new Date(lastRenewalIso);
			const monthChanged =
				last.getUTCFullYear() !== now.getUTCFullYear() ||
				last.getUTCMonth() !== now.getUTCMonth();
			const daysElapsed =
				(now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
			return monthChanged || daysElapsed >= 30;
		})();

		if (shouldRenew) {
			await userRef.update({
				resumeCredits: 10,
				lastResumeCreditRenewalAt: now.toISOString(),
			});
			return 10;
		}

		return currentCredits;
	}

	/**
	 * Batch operations for better performance
	 */
	async batchUpdateInterviews(
		updates: Array<{ id: string; data: Partial<InterviewDocument> }>
	): Promise<void> {
		const batch = db.batch();

		updates.forEach(({ id, data }) => {
			const docRef = this.interviewsCollection.doc(id);
			batch.update(docRef, {
				...data,
				updatedAt: new Date().toISOString(),
			});
		});

		await batch.commit();
	}
}

// Singleton instance
export const interviewService = new InterviewFirebaseService();
