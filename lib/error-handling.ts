import { InterviewAPIError } from '@/types/interview';

// Error codes
export const ERROR_CODES = {
    // Network errors
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    CONNECTION_ERROR: 'CONNECTION_ERROR',
    
    // Authentication errors
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    
    // Validation errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
    
    // Interview errors
    INTERVIEW_NOT_FOUND: 'INTERVIEW_NOT_FOUND',
    INTERVIEW_ALREADY_COMPLETED: 'INTERVIEW_ALREADY_COMPLETED',
    INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
    QUESTION_GENERATION_FAILED: 'QUESTION_GENERATION_FAILED',
    EVALUATION_FAILED: 'EVALUATION_FAILED',
    
    // Speech errors
    SPEECH_NOT_SUPPORTED: 'SPEECH_NOT_SUPPORTED',
    SPEECH_RECOGNITION_ERROR: 'SPEECH_RECOGNITION_ERROR',
    SPEECH_SYNTHESIS_ERROR: 'SPEECH_SYNTHESIS_ERROR',
    
    // File errors
    FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
    PDF_GENERATION_ERROR: 'PDF_GENERATION_ERROR',
    
    // Generic errors
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    CLIENT_ERROR: 'CLIENT_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// Error messages
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
    [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
    [ERROR_CODES.CONNECTION_ERROR]: 'Unable to connect to the server. Please try again later.',
    
    [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action. Please sign in.',
    [ERROR_CODES.FORBIDDEN]: 'Access denied. You do not have permission to access this resource.',
    [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please sign in again.',
    
    [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
    [ERROR_CODES.INVALID_INPUT]: 'Invalid input provided. Please correct and try again.',
    [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Required fields are missing. Please fill in all required information.',
    
    [ERROR_CODES.INTERVIEW_NOT_FOUND]: 'Interview not found. It may have been deleted or you may not have access.',
    [ERROR_CODES.INTERVIEW_ALREADY_COMPLETED]: 'This interview has already been completed.',
    [ERROR_CODES.INSUFFICIENT_CREDITS]: 'Insufficient credits. Please purchase more credits to continue.',
    [ERROR_CODES.QUESTION_GENERATION_FAILED]: 'Failed to generate interview questions. Please try again.',
    [ERROR_CODES.EVALUATION_FAILED]: 'Failed to evaluate your response. Please try again.',
    
    [ERROR_CODES.SPEECH_NOT_SUPPORTED]: 'Speech functionality is not supported in your browser.',
    [ERROR_CODES.SPEECH_RECOGNITION_ERROR]: 'Speech recognition failed. Please try speaking again.',
    [ERROR_CODES.SPEECH_SYNTHESIS_ERROR]: 'Text-to-speech failed. Please check your audio settings.',
    
    [ERROR_CODES.FILE_UPLOAD_ERROR]: 'File upload failed. Please try again.',
    [ERROR_CODES.PDF_GENERATION_ERROR]: 'Failed to generate PDF. Please try again.',
    
    [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
    [ERROR_CODES.SERVER_ERROR]: 'Server error occurred. Please try again later.',
    [ERROR_CODES.CLIENT_ERROR]: 'Client error occurred. Please refresh the page and try again.',
};

// Error severity levels
export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

// Error context interface
export interface ErrorContext {
    userId?: string;
    interviewId?: string;
    action?: string;
    component?: string;
    timestamp?: string;
    userAgent?: string;
    url?: string;
    additionalData?: Record<string, any>;
}

// Enhanced error class
export class EnhancedError extends Error {
    public code: ErrorCode;
    public severity: ErrorSeverity;
    public context: ErrorContext;
    public originalError?: Error;
    public retryable: boolean;

    constructor(
        message: string,
        code: ErrorCode = ERROR_CODES.UNKNOWN_ERROR,
        severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        context: ErrorContext = {},
        originalError?: Error,
        retryable: boolean = true
    ) {
        super(message);
        this.name = 'EnhancedError';
        this.code = code;
        this.severity = severity;
        this.context = {
            ...context,
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
            url: typeof window !== 'undefined' ? window.location.href : undefined,
        };
        this.originalError = originalError;
        this.retryable = retryable;
    }
}

// Error handler utility
export class ErrorHandler {
    private static instance: ErrorHandler;
    private errorListeners: Array<(error: EnhancedError) => void> = [];

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    // Add error listener
    addListener(listener: (error: EnhancedError) => void): void {
        this.errorListeners.push(listener);
    }

    // Remove error listener
    removeListener(listener: (error: EnhancedError) => void): void {
        this.errorListeners = this.errorListeners.filter(l => l !== listener);
    }

    // Handle error
    handleError(error: Error | EnhancedError | string, context?: ErrorContext): EnhancedError {
        let enhancedError: EnhancedError;

        if (error instanceof EnhancedError) {
            enhancedError = error;
        } else if (error instanceof Error) {
            enhancedError = this.createEnhancedError(error, context);
        } else {
            enhancedError = new EnhancedError(
                error,
                ERROR_CODES.UNKNOWN_ERROR,
                ErrorSeverity.MEDIUM,
                context
            );
        }

        // Log error
        this.logError(enhancedError);

        // Notify listeners
        this.errorListeners.forEach(listener => {
            try {
                listener(enhancedError);
            } catch (listenerError) {
                console.error('Error in error listener:', listenerError);
            }
        });

        return enhancedError;
    }

    // Create enhanced error from regular error
    private createEnhancedError(error: Error, context?: ErrorContext): EnhancedError {
        let code: ErrorCode = ERROR_CODES.UNKNOWN_ERROR;
        let severity: ErrorSeverity = ErrorSeverity.MEDIUM;
        let retryable = true;

        // Determine error code based on error type and message
        if (error.name === 'TypeError' || error.name === 'ReferenceError') {
            code = ERROR_CODES.CLIENT_ERROR;
            severity = ErrorSeverity.HIGH;
            retryable = false;
        } else if (error.message.includes('fetch')) {
            code = ERROR_CODES.NETWORK_ERROR;
            severity = ErrorSeverity.MEDIUM;
        } else if (error.message.includes('timeout')) {
            code = ERROR_CODES.TIMEOUT_ERROR;
            severity = ErrorSeverity.MEDIUM;
        } else if (error.message.includes('unauthorized') || error.message.includes('401')) {
            code = ERROR_CODES.UNAUTHORIZED;
            severity = ErrorSeverity.HIGH;
            retryable = false;
        } else if (error.message.includes('forbidden') || error.message.includes('403')) {
            code = ERROR_CODES.FORBIDDEN;
            severity = ErrorSeverity.HIGH;
            retryable = false;
        }

        return new EnhancedError(
            error.message,
            code,
            severity,
            context,
            error,
            retryable
        );
    }

    // Log error
    private logError(error: EnhancedError): void {
        const logData = {
            message: error.message,
            code: error.code,
            severity: error.severity,
            context: error.context,
            stack: error.stack,
            originalError: error.originalError?.message,
            retryable: error.retryable,
        };

        // Console logging
        if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH) {
            console.error('Critical/High severity error:', logData);
        } else {
            console.warn('Error occurred:', logData);
        }

        // Send to external logging service in production
        if (process.env.NODE_ENV === 'production') {
            this.sendToLoggingService(logData);
        }
    }

    // Send to external logging service
    private sendToLoggingService(logData: any): void {
        try {
            // Replace with your preferred logging service (Sentry, LogRocket, etc.)
            // Example: Sentry.captureException(logData);
            console.log('Would send to logging service:', logData);
        } catch (loggingError) {
            console.error('Failed to send error to logging service:', loggingError);
        }
    }
}

// Utility functions
export const createError = (
    message: string,
    code?: ErrorCode,
    severity?: ErrorSeverity,
    context?: ErrorContext
): EnhancedError => {
    return new EnhancedError(message, code, severity, context);
};

export const handleAsyncError = async <T>(
    asyncFn: () => Promise<T>,
    context?: ErrorContext
): Promise<T> => {
    try {
        return await asyncFn();
    } catch (error) {
        const errorHandler = ErrorHandler.getInstance();
        throw errorHandler.handleError(error as Error, context);
    }
};

export const isRetryableError = (error: Error): boolean => {
    if (error instanceof EnhancedError) {
        return error.retryable;
    }
    
    // Default retry logic for non-enhanced errors
    const nonRetryablePatterns = [
        'unauthorized',
        'forbidden',
        'not found',
        'validation',
        'invalid',
    ];
    
    return !nonRetryablePatterns.some(pattern => 
        error.message.toLowerCase().includes(pattern)
    );
};

export const getErrorMessage = (error: Error | string): string => {
    if (typeof error === 'string') {
        return error;
    }
    
    if (error instanceof EnhancedError) {
        return ERROR_MESSAGES[error.code] || error.message;
    }
    
    return error.message || 'An unexpected error occurred';
};

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance();
