"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error,
            errorInfo,
        });

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            // You can integrate with services like Sentry, LogRocket, etc.
            this.logErrorToService(error, errorInfo);
        }
    }

    private logErrorToService(error: Error, errorInfo: ErrorInfo) {
        // Example: Send to external logging service
        try {
            // Replace with your preferred error logging service
            console.error('Logging error to service:', {
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
            });
        } catch (loggingError) {
            console.error('Failed to log error to service:', loggingError);
        }
    }

    private handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    private handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-dark-100">
                    <div className="max-w-md w-full bg-dark-200 border border-dark-300 rounded-lg p-6 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold text-primary-100 mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-light-400 mb-6">
                            We're sorry, but something unexpected happened. Please try again.
                        </p>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-light-400 hover:text-light-200">
                                    Error Details (Development)
                                </summary>
                                <div className="mt-2 p-3 bg-dark-300 rounded text-xs text-red-400 overflow-auto max-h-40">
                                    <div className="font-semibold mb-2">Error:</div>
                                    <div className="mb-2">{this.state.error.message}</div>
                                    {this.state.error.stack && (
                                        <>
                                            <div className="font-semibold mb-2">Stack Trace:</div>
                                            <pre className="whitespace-pre-wrap text-xs">
                                                {this.state.error.stack}
                                            </pre>
                                        </>
                                    )}
                                    {this.state.errorInfo?.componentStack && (
                                        <>
                                            <div className="font-semibold mb-2 mt-4">Component Stack:</div>
                                            <pre className="whitespace-pre-wrap text-xs">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </>
                                    )}
                                </div>
                            </details>
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={this.handleRetry}
                                className="btn-primary flex-1"
                            >
                                Try Again
                            </Button>
                            <Button
                                onClick={this.handleReload}
                                className="btn-secondary flex-1"
                            >
                                Reload Page
                            </Button>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-dark-300">
                            <p className="text-xs text-light-500">
                                If this problem persists, please contact support.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
    const handleError = React.useCallback((error: Error, errorInfo?: any) => {
        console.error('Error caught by useErrorHandler:', error, errorInfo);
        
        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            try {
                console.error('Logging error to service:', {
                    error: error.message,
                    stack: error.stack,
                    errorInfo,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                });
            } catch (loggingError) {
                console.error('Failed to log error to service:', loggingError);
            }
        }
    }, []);

    return { handleError };
};

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode,
    onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary fallback={fallback} onError={onError}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    
    return WrappedComponent;
};
