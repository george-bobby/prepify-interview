// Core interview types
export interface Interview {
    id: string;
    userId: string;
    role: string;
    level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
    type: 'technical' | 'behavioral' | 'mixed';
    techstack: string[];
    questions: string[];
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    estimatedDuration?: string;
    config?: InterviewConfig;
    status: 'not_started' | 'in_progress' | 'completed' | 'paused';
    coverImage?: string;
    createdAt: string;
    updatedAt?: string;
    completedAt?: string;
    feedbackId?: string;
    finalScore?: number;
    responses?: { [key: number]: InterviewResponse };
    finalized?: boolean;
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

export interface InterviewFeedback {
    id: string;
    interviewId: string;
    userId: string;
    totalScore: number;
    categoryScores: CategoryScore[];
    strengths: string[];
    areasForImprovement: string[];
    recommendations?: string[];
    overallFeedback: string;
    finalAssessment?: string;
    interviewDuration: string;
    questionsAnswered: number;
    createdAt: string;
}

export interface CategoryScore {
    name?: string;
    category?: string;
    score: number;
    comment?: string;
    feedback?: string;
}

export interface InterviewConfig {
    mode: 'technical' | 'behavioral' | 'mixed';
    role: string;
    level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
    techStack?: string[];
    focusAreas?: string[];
    technicalWeight?: number;
}

// Component prop types
export interface InterviewCardProps {
    id: string;
    userId: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt: string;
    status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
    difficulty?: string;
    estimatedDuration?: string;
    questionsCount?: number;
    completedAt?: string;
    level?: string;
}

export interface AgentProps {
    userName: string;
    userId: string;
    type: 'interview' | 'generate';
    interviewId?: string;
    questions?: string[];
}

// API response types
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface InterviewGenerationResponse {
    success: boolean;
    interviewId: string;
    questions: string[];
    difficulty: string;
    estimatedDuration: string;
}

export interface InterviewEvaluationResponse {
    success: boolean;
    evaluation: {
        score: number;
        feedback: string;
        strengths: string[];
        improvements: string[];
    };
    interviewerResponse: string;
    followUpQuestion?: string;
    shouldContinue: boolean;
    isLastQuestion: boolean;
}

export interface InterviewSummaryResponse {
    success: boolean;
    feedbackId: string;
    summary: {
        totalScore: number;
        categoryScores: CategoryScore[];
        strengths: string[];
        areasForImprovement: string[];
        recommendations: string[];
        overallFeedback: string;
        interviewDuration: string;
        questionsAnswered: number;
    };
}

// Error types
export interface InterviewError {
    code: string;
    message: string;
    details?: any;
}

export class InterviewAPIError extends Error {
    public code: string;
    public details?: any;

    constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: any) {
        super(message);
        this.name = 'InterviewAPIError';
        this.code = code;
        this.details = details;
    }
}

// Speech synthesis types
export interface SpeechConfig {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
    lang?: string;
}

export interface SpeechCallbacks {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: SpeechSynthesisErrorEvent) => void;
    onPause?: () => void;
    onResume?: () => void;
}

// User types
export interface User {
    id: string;
    email: string;
    name: string;
    credits: number;
    profileImage?: string;
    createdAt: string;
    lastActive?: string;
}

// Route params
export interface RouteParams {
    params: {
        id: string;
    };
}

// Loading states
export interface LoadingState {
    isLoading: boolean;
    message?: string;
}

export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

// Form types
export interface InterviewCreationForm {
    mode: 'technical' | 'behavioral' | 'mixed';
    role: string;
    level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
    techStack: string[];
    questionCount: number;
}

// Statistics types
export interface InterviewStats {
    total: number;
    completed: number;
    inProgress: number;
    averageScore: number;
    totalScore: number;
}

// PDF export types
export interface PDFExportData {
    interview: Interview;
    feedback: InterviewFeedback;
    filename?: string;
}

// Accessibility types
export interface AccessibilityProps {
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-expanded'?: boolean;
    'aria-hidden'?: boolean;
    role?: string;
    tabIndex?: number;
}

// Event handler types
export type InterviewEventHandler = (interview: Interview) => void;
export type ErrorEventHandler = (error: InterviewError) => void;
export type LoadingEventHandler = (loading: boolean) => void;

// Utility types
export type InterviewStatus = Interview['status'];
export type InterviewType = Interview['type'];
export type InterviewLevel = Interview['level'];
export type InterviewDifficulty = Interview['difficulty'];

// Conditional types
export type InterviewWithFeedback = Interview & {
    feedback: InterviewFeedback;
};

export type InterviewWithoutFeedback = Interview & {
    feedback?: never;
};

// Union types
export type InterviewOrFeedback = Interview | InterviewFeedback;
export type InterviewAction = 'create' | 'start' | 'pause' | 'resume' | 'complete' | 'delete';

// Generic types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
