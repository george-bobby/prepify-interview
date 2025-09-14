interface Feedback {
	id: string;
	interviewId: string;
	totalScore: number;
	categoryScores: Array<{
		name: string;
		score: number;
		comment: string;
	}>;
	strengths: string[];
	areasForImprovement: string[];
	finalAssessment: string;
	createdAt: string;
}

interface Interview {
	id: string;
	role: string;
	level: string;
	questions: string[];
	techstack: string[];
	createdAt: string;
	userId: string;
	type: string;
	finalized: boolean;
}

interface CreateFeedbackParams {
	interviewId: string;
	userId: string;
	transcript: { role: string; content: string }[];
	feedbackId?: string;
}

interface User {
	name: string;
	email: string;
	id: string;
	credits?: number;
	completedInterviews?: number;
	coursesEnrolled?: number;
	skills?: string[];
	isProSubscriber?: boolean;
	role?: string;
	avatar?: string;
	verified?: boolean;
	lastCreditRenewalAt?: string;
	resumeCredits?: number;
	lastResumeCreditRenewalAt?: string;
	subscriptionStatus?: string;
	subscriptionId?: string;
	subscriptionPlanId?: string;
}

interface InterviewCardProps {
	id?: string;
	userId?: string;
	role: string;
	type: string;
	techstack: string[];
	createdAt?: string;
}

interface AgentProps {
	userName: string;
	userId?: string;
	interviewId?: string;
	feedbackId?: string;
	type: 'generate' | 'interview';
	questions?: string[];
}

interface RouteParams {
	params: Promise<Record<string, string>>;
	searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
	interviewId: string;
	userId: string;
}

interface GetLatestInterviewsParams {
	userId: string;
	limit?: number;
}

interface SignInParams {
	email: string;
	idToken: string;
}

interface SignUpParams {
	uid: string;
	name: string;
	email: string;
	password: string;
}

type FormType = 'sign-in' | 'sign-up';

interface InterviewFormProps {
	interviewId: string;
	role: string;
	level: string;
	type: string;
	techstack: string[];
	amount: number;
}

interface TechIconProps {
	techStack: string[];
}

// Job Search Types
interface Job {
	id: string;
	title: string;
	company: string;
	location: string;
	description: string;
	salary?: string;
	employment_type?: string;
	posted_at?: string;
	apply_link?: string;
	thumbnail?: string;
	via?: string;
	createdAt?: string;
	searchQuery?: string;
}

interface JobSearchParams {
	query: string;
	location?: string;
	jobType?: string;
	experienceLevel?: string;
	datePosted?: string;
	salaryRange?: string;
}

interface JobSearchResponse {
	success: boolean;
	jobs: Job[];
	total: number;
	search_parameters: JobSearchParams;
}

interface SavedJobSearch {
	id: string;
	userId: string;
	searchParams: JobSearchParams;
	results: Job[];
	createdAt: string;
	updatedAt: string;
}
