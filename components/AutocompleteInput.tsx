'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';

interface AutocompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyPress?: (e: React.KeyboardEvent) => void;
    placeholder?: string;
    label?: string;
    apiEndpoint: string;
    className?: string;
    required?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    value,
    onChange,
    onKeyPress,
    placeholder,
    label,
    apiEndpoint,
    className = '',
    required = false
}) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const fetchSuggestions = useCallback(
        debounce(async (query: string) => {
            if (query.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`${apiEndpoint}?q=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data.success && Array.isArray(data.suggestions)) {
                    setSuggestions(data.suggestions);
                    setShowSuggestions(data.suggestions.length > 0);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        [apiEndpoint]
    );

    useEffect(() => {
        if (value) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [value, fetchSuggestions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                suggestionsRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }

        if (onKeyPress) {
            onKeyPress(e);
        }
    };

    const handleFocus = () => {
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className="relative">
            {label && (
                <label className="block text-light-200 text-sm font-medium mb-2">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-light-100 placeholder-light-400 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200 ${className}`}
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-200"></div>
                    </div>
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 z-10 mt-1 bg-dark-300 border border-dark-400 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-2 text-left text-light-100 hover:bg-dark-200 focus:bg-dark-200 focus:outline-none transition-colors duration-150"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutocompleteInput;
