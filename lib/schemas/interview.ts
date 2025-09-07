import { z } from 'zod';

// Schema for interview question generation
export const questionGenerationSchema = z.object({
	questions: z.array(z.string()).min(1).max(10),
	difficulty: z.enum(['Easy', 'Medium', 'Hard']),
	estimatedDuration: z.string(),
});

// Schema for interview response evaluation
export const responseEvaluationSchema = z.object({
	score: z.number().min(0).max(10),
	feedback: z.string(),
	strengths: z.array(z.string()),
	improvements: z.array(z.string()),
	followUpQuestion: z.string().optional(),
	shouldContinue: z.boolean(),
});

// Schema for interview session state
export const interviewSessionSchema = z.object({
	currentQuestionIndex: z.number(),
	totalQuestions: z.number(),
	responses: z.array(z.object({
		question: z.string(),
		answer: z.string(),
		score: z.number(),
		feedback: z.string(),
		timestamp: z.string(),
	})),
	overallScore: z.number().optional(),
	status: z.enum(['not_started', 'in_progress', 'completed', 'paused']),
});

// Schema for final interview summary
export const interviewSummarySchema = z.object({
	totalScore: z.number().min(0).max(10),
	categoryScores: z.array(z.object({
		category: z.string(),
		score: z.number().min(0).max(10),
		feedback: z.string(),
	})),
	strengths: z.array(z.string()),
	areasForImprovement: z.array(z.string()),
	recommendations: z.array(z.string()),
	overallFeedback: z.string(),
	interviewDuration: z.string(),
	questionsAnswered: z.number(),
});

// Schema for interview types and modes
export const interviewModeSchema = z.enum(['technical', 'behavioral', 'mixed']);

export const technicalInterviewSchema = z.object({
	mode: z.literal('technical'),
	role: z.string(),
	level: z.enum(['Junior', 'Mid', 'Senior', 'Lead']),
	techStack: z.array(z.string()),
	focusAreas: z.array(z.enum([
		'algorithms',
		'data_structures',
		'system_design',
		'coding',
		'architecture',
		'frameworks',
		'databases',
		'testing'
	])),
});

export const behavioralInterviewSchema = z.object({
	mode: z.literal('behavioral'),
	role: z.string(),
	level: z.enum(['Junior', 'Mid', 'Senior', 'Lead']),
	focusAreas: z.array(z.enum([
		'leadership',
		'teamwork',
		'communication',
		'problem_solving',
		'conflict_resolution',
		'adaptability',
		'time_management',
		'decision_making'
	])),
});

export const mixedInterviewSchema = z.object({
	mode: z.literal('mixed'),
	role: z.string(),
	level: z.enum(['Junior', 'Mid', 'Senior', 'Lead']),
	techStack: z.array(z.string()),
	technicalWeight: z.number().min(0).max(1), // 0.7 means 70% technical, 30% behavioral
});

export const interviewConfigSchema = z.discriminatedUnion('mode', [
	technicalInterviewSchema,
	behavioralInterviewSchema,
	mixedInterviewSchema,
]);

// Types derived from schemas
export type QuestionGeneration = z.infer<typeof questionGenerationSchema>;
export type ResponseEvaluation = z.infer<typeof responseEvaluationSchema>;
export type InterviewSession = z.infer<typeof interviewSessionSchema>;
export type InterviewSummary = z.infer<typeof interviewSummarySchema>;
export type InterviewMode = z.infer<typeof interviewModeSchema>;
export type TechnicalInterview = z.infer<typeof technicalInterviewSchema>;
export type BehavioralInterview = z.infer<typeof behavioralInterviewSchema>;
export type MixedInterview = z.infer<typeof mixedInterviewSchema>;
export type InterviewConfig = z.infer<typeof interviewConfigSchema>;
