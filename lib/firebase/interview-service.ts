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
    async createInterview(interviewData: Omit<InterviewDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
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
            const startAfterDoc = await this.interviewsCollection.doc(options.startAfter).get();
            query = query.startAfter(startAfterDoc);
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
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
    async completeInterview(interviewId: string, finalScore?: number): Promise<void> {
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
    async createFeedback(feedbackData: Omit<FeedbackDocument, 'id' | 'createdAt'>): Promise<string> {
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
    async getFeedbackByInterviewId(interviewId: string): Promise<FeedbackDocument | null> {
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
        
        const completed = interviews.filter(i => i.status === 'completed').length;
        const inProgress = interviews.filter(i => i.status === 'in_progress').length;
        
        const scoresSum = interviews
            .filter(i => i.finalScore)
            .reduce((sum, i) => sum + (i.finalScore || 0), 0);
        
        const averageScore = completed > 0 ? Math.round(scoresSum / completed * 10) / 10 : 0;

        return {
            total: interviews.length,
            completed,
            inProgress,
            averageScore,
            totalScore: scoresSum,
        };
    }

    /**
     * Deduct user credit
     */
    async deductUserCredit(userId: string): Promise<void> {
        await this.usersCollection.doc(userId).update({
            credits: admin.firestore.FieldValue.increment(-1),
        });
    }

    /**
     * Get user credits
     */
    async getUserCredits(userId: string): Promise<number> {
        const doc = await this.usersCollection.doc(userId).get();
        if (!doc.exists) return 0;
        
        const userData = doc.data();
        return userData?.credits || 0;
    }

    /**
     * Batch operations for better performance
     */
    async batchUpdateInterviews(updates: Array<{ id: string; data: Partial<InterviewDocument> }>): Promise<void> {
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
