// Accessibility utilities and hooks

import { useEffect, useRef, useState } from 'react';

// ARIA live region types
export type LiveRegionPoliteness = 'off' | 'polite' | 'assertive';

// Focus management utilities
export const focusManagement = {
    // Focus the first focusable element in a container
    focusFirst: (container: HTMLElement): boolean => {
        const focusableElements = getFocusableElements(container);
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
            return true;
        }
        return false;
    },

    // Focus the last focusable element in a container
    focusLast: (container: HTMLElement): boolean => {
        const focusableElements = getFocusableElements(container);
        if (focusableElements.length > 0) {
            focusableElements[focusableElements.length - 1].focus();
            return true;
        }
        return false;
    },

    // Trap focus within a container
    trapFocus: (container: HTMLElement, event: KeyboardEvent): void => {
        if (event.key !== 'Tab') return;

        const focusableElements = getFocusableElements(container);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    },

    // Restore focus to a previously focused element
    restoreFocus: (element: HTMLElement | null): void => {
        if (element && typeof element.focus === 'function') {
            element.focus();
        }
    },
};

// Get all focusable elements within a container
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
};

// Hook for managing focus trap
export const useFocusTrap = (isActive: boolean = true) => {
    const containerRef = useRef<HTMLElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        // Store the previously focused element
        previouslyFocusedElement.current = document.activeElement as HTMLElement;

        // Focus the first element in the container
        focusManagement.focusFirst(containerRef.current);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (containerRef.current) {
                focusManagement.trapFocus(containerRef.current, event);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Restore focus when the trap is deactivated
            focusManagement.restoreFocus(previouslyFocusedElement.current);
        };
    }, [isActive]);

    return containerRef;
};

// Hook for managing ARIA live regions
export const useLiveRegion = (politeness: LiveRegionPoliteness = 'polite') => {
    const [message, setMessage] = useState('');
    const liveRegionRef = useRef<HTMLDivElement>(null);

    const announce = (text: string) => {
        setMessage(text);
        // Clear the message after a short delay to allow for re-announcements
        setTimeout(() => setMessage(''), 100);
    };

    useEffect(() => {
        if (liveRegionRef.current) {
            liveRegionRef.current.setAttribute('aria-live', politeness);
            liveRegionRef.current.setAttribute('aria-atomic', 'true');
        }
    }, [politeness]);

    const LiveRegion = () => (
        <div
            ref={liveRegionRef}
            className="sr-only"
            aria-live={politeness}
            aria-atomic="true"
        >
            {message}
        </div>
    );

    return { announce, LiveRegion };
};

// Hook for managing skip links
export const useSkipLink = () => {
    const skipToContent = (targetId: string) => {
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const SkipLink = ({ targetId, children }: { targetId: string; children: React.ReactNode }) => (
        <a
            href={`#${targetId}`}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded"
            onClick={(e) => {
                e.preventDefault();
                skipToContent(targetId);
            }}
        >
            {children}
        </a>
    );

    return { skipToContent, SkipLink };
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (
    onEnter?: () => void,
    onEscape?: () => void,
    onArrowUp?: () => void,
    onArrowDown?: () => void,
    onArrowLeft?: () => void,
    onArrowRight?: () => void
) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'Enter':
                if (onEnter) {
                    event.preventDefault();
                    onEnter();
                }
                break;
            case 'Escape':
                if (onEscape) {
                    event.preventDefault();
                    onEscape();
                }
                break;
            case 'ArrowUp':
                if (onArrowUp) {
                    event.preventDefault();
                    onArrowUp();
                }
                break;
            case 'ArrowDown':
                if (onArrowDown) {
                    event.preventDefault();
                    onArrowDown();
                }
                break;
            case 'ArrowLeft':
                if (onArrowLeft) {
                    event.preventDefault();
                    onArrowLeft();
                }
                break;
            case 'ArrowRight':
                if (onArrowRight) {
                    event.preventDefault();
                    onArrowRight();
                }
                break;
        }
    };

    return { handleKeyDown };
};

// Hook for managing reduced motion preferences
export const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
};

// Hook for managing high contrast preferences
export const useHighContrast = () => {
    const [prefersHighContrast, setPrefersHighContrast] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        setPrefersHighContrast(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersHighContrast(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersHighContrast;
};

// Utility for generating accessible IDs
export const generateId = (prefix: string = 'id'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility for creating accessible descriptions
export const createAriaDescription = (
    baseDescription: string,
    additionalInfo?: string[]
): string => {
    const parts = [baseDescription];
    if (additionalInfo && additionalInfo.length > 0) {
        parts.push(...additionalInfo);
    }
    return parts.join('. ');
};

// Screen reader only CSS class utility
export const srOnly = 'sr-only';

// Accessibility validation utilities
export const a11yValidation = {
    // Check if an element has accessible name
    hasAccessibleName: (element: HTMLElement): boolean => {
        return !!(
            element.getAttribute('aria-label') ||
            element.getAttribute('aria-labelledby') ||
            element.textContent?.trim() ||
            (element as HTMLInputElement).placeholder
        );
    },

    // Check if an interactive element is keyboard accessible
    isKeyboardAccessible: (element: HTMLElement): boolean => {
        const tabIndex = element.getAttribute('tabindex');
        return (
            element.tagName === 'BUTTON' ||
            element.tagName === 'A' ||
            element.tagName === 'INPUT' ||
            element.tagName === 'SELECT' ||
            element.tagName === 'TEXTAREA' ||
            (tabIndex !== null && tabIndex !== '-1')
        );
    },

    // Check color contrast (basic implementation)
    hasGoodContrast: (foreground: string, background: string): boolean => {
        // This is a simplified implementation
        // In a real application, you'd want to use a proper color contrast library
        return true; // Placeholder
    },
};

// ARIA attributes helper
export const ariaAttributes = {
    expanded: (isExpanded: boolean) => ({ 'aria-expanded': isExpanded }),
    selected: (isSelected: boolean) => ({ 'aria-selected': isSelected }),
    checked: (isChecked: boolean) => ({ 'aria-checked': isChecked }),
    disabled: (isDisabled: boolean) => ({ 'aria-disabled': isDisabled }),
    hidden: (isHidden: boolean) => ({ 'aria-hidden': isHidden }),
    current: (current: string | boolean) => ({ 'aria-current': current }),
    describedBy: (id: string) => ({ 'aria-describedby': id }),
    labelledBy: (id: string) => ({ 'aria-labelledby': id }),
    label: (label: string) => ({ 'aria-label': label }),
};
