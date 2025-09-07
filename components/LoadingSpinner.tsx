"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'white' | 'gray';
    message?: string;
    fullScreen?: boolean;
    className?: string;
    'aria-label'?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    white: 'border-white',
    gray: 'border-gray-500',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = 'primary',
    message,
    fullScreen = false,
    className,
    'aria-label': ariaLabel,
}) => {
    const spinner = (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-t-transparent',
                sizeClasses[size],
                colorClasses[color],
                className
            )}
            role="status"
            aria-label={ariaLabel || 'Loading'}
            aria-live="polite"
        />
    );

    if (fullScreen) {
        return (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                role="dialog"
                aria-modal="true"
                aria-labelledby="loading-title"
            >
                <div className="bg-dark-200 rounded-lg p-6 flex flex-col items-center gap-4">
                    {spinner}
                    {message && (
                        <p 
                            id="loading-title"
                            className="text-light-200 text-center"
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (message) {
        return (
            <div className="flex flex-col items-center gap-2">
                {spinner}
                <p className="text-light-400 text-sm text-center">{message}</p>
            </div>
        );
    }

    return spinner;
};

// Loading skeleton component
interface LoadingSkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    className,
    width,
    height,
    rounded = false,
}) => {
    return (
        <div
            className={cn(
                'animate-pulse bg-dark-300',
                rounded ? 'rounded-full' : 'rounded',
                className
            )}
            style={{ width, height }}
            role="status"
            aria-label="Loading content"
        />
    );
};

// Loading card skeleton
export const LoadingCard: React.FC = () => {
    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">
                <div>
                    <LoadingSkeleton width={90} height={90} rounded className="mb-5" />
                    <LoadingSkeleton width="80%" height={24} className="mb-3" />
                    <div className="flex gap-5 mb-3">
                        <LoadingSkeleton width={100} height={16} />
                        <LoadingSkeleton width={80} height={16} />
                    </div>
                    <LoadingSkeleton width="100%" height={60} className="mb-5" />
                </div>
                <div className="flex justify-between items-end">
                    <div className="flex gap-2">
                        <LoadingSkeleton width={24} height={24} rounded />
                        <LoadingSkeleton width={24} height={24} rounded />
                        <LoadingSkeleton width={24} height={24} rounded />
                    </div>
                    <LoadingSkeleton width={120} height={36} />
                </div>
            </div>
        </div>
    );
};

// Loading state hook
export const useLoadingState = (initialState: boolean = false) => {
    const [isLoading, setIsLoading] = React.useState(initialState);
    const [message, setMessage] = React.useState<string>('');

    const startLoading = React.useCallback((loadingMessage?: string) => {
        setIsLoading(true);
        setMessage(loadingMessage || '');
    }, []);

    const stopLoading = React.useCallback(() => {
        setIsLoading(false);
        setMessage('');
    }, []);

    const updateMessage = React.useCallback((newMessage: string) => {
        setMessage(newMessage);
    }, []);

    return {
        isLoading,
        message,
        startLoading,
        stopLoading,
        updateMessage,
    };
};

// Loading wrapper component
interface LoadingWrapperProps {
    isLoading: boolean;
    message?: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    className?: string;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
    isLoading,
    message,
    children,
    fallback,
    className,
}) => {
    if (isLoading) {
        return (
            <div className={cn('flex items-center justify-center p-8', className)}>
                {fallback || <LoadingSpinner message={message} />}
            </div>
        );
    }

    return <>{children}</>;
};

// Async component wrapper
interface AsyncComponentProps<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    children: (data: T) => React.ReactNode;
    loadingComponent?: React.ReactNode;
    errorComponent?: (error: string) => React.ReactNode;
    emptyComponent?: React.ReactNode;
}

export function AsyncComponent<T>({
    data,
    loading,
    error,
    children,
    loadingComponent,
    errorComponent,
    emptyComponent,
}: AsyncComponentProps<T>) {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                {loadingComponent || <LoadingSpinner message="Loading..." />}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                {errorComponent ? (
                    errorComponent(error)
                ) : (
                    <div className="text-center">
                        <div className="text-red-400 mb-2">⚠️</div>
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center p-8">
                {emptyComponent || (
                    <div className="text-center">
                        <div className="text-light-400 mb-2">📭</div>
                        <p className="text-light-400">No data available</p>
                    </div>
                )}
            </div>
        );
    }

    return <>{children(data)}</>;
}
