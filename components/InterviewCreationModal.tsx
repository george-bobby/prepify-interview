"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InterviewConfig, InterviewMode } from '@/lib/schemas/interview';

interface InterviewCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateInterview: (config: InterviewConfig, questionCount: number) => Promise<void>;
    userId: string;
}

export const InterviewCreationModal: React.FC<InterviewCreationModalProps> = ({
    isOpen,
    onClose,
    onCreateInterview,
    userId,
}) => {
    const [mode, setMode] = useState<InterviewMode>('technical');
    const [role, setRole] = useState('');
    const [level, setLevel] = useState<'Junior' | 'Mid' | 'Senior' | 'Lead'>('Junior');
    const [techStack, setTechStack] = useState<string[]>([]);
    const [techStackInput, setTechStackInput] = useState('');
    const [questionCount, setQuestionCount] = useState(5);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddTechStack = () => {
        if (techStackInput.trim() && !techStack.includes(techStackInput.trim())) {
            setTechStack([...techStack, techStackInput.trim()]);
            setTechStackInput('');
        }
    };

    const handleRemoveTechStack = (tech: string) => {
        setTechStack(techStack.filter(t => t !== tech));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!role.trim()) {
            setError('Please enter a role');
            return;
        }

        try {
            setIsCreating(true);

            let config: InterviewConfig;

            if (mode === 'technical') {
                config = {
                    mode: 'technical',
                    role: role.trim(),
                    level,
                    techStack,
                    focusAreas: ['algorithms', 'data_structures', 'coding', 'frameworks'],
                };
            } else if (mode === 'behavioral') {
                config = {
                    mode: 'behavioral',
                    role: role.trim(),
                    level,
                    focusAreas: ['leadership', 'teamwork', 'communication', 'problem_solving'],
                };
            } else {
                config = {
                    mode: 'mixed',
                    role: role.trim(),
                    level,
                    techStack,
                    technicalWeight: 0.7,
                };
            }

            await onCreateInterview(config, questionCount);
            onClose();
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create interview');
        } finally {
            setIsCreating(false);
        }
    };

    const resetForm = () => {
        setMode('technical');
        setRole('');
        setLevel('Junior');
        setTechStack([]);
        setTechStackInput('');
        setQuestionCount(5);
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-dark-200 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-primary-100">Create New Interview</h2>
                    <button
                        onClick={onClose}
                        className="text-light-400 hover:text-light-100"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Interview Mode */}
                    <div>
                        <label className="block text-sm font-medium text-light-100 mb-2">
                            Interview Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['technical', 'behavioral', 'mixed'] as const).map((modeOption) => (
                                <button
                                    key={modeOption}
                                    type="button"
                                    onClick={() => setMode(modeOption)}
                                    className={`p-2 rounded text-sm capitalize ${
                                        mode === modeOption
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-dark-300 text-light-400 hover:bg-dark-400'
                                    }`}
                                >
                                    {modeOption}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-light-100 mb-2">
                            Role
                        </label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g., Frontend Developer, Product Manager"
                            className="w-full p-2 rounded bg-dark-300 text-light-100 border border-dark-400 focus:border-primary-500"
                            required
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium text-light-100 mb-2">
                            Experience Level
                        </label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value as any)}
                            className="w-full p-2 rounded bg-dark-300 text-light-100 border border-dark-400 focus:border-primary-500"
                        >
                            <option value="Junior">Junior</option>
                            <option value="Mid">Mid</option>
                            <option value="Senior">Senior</option>
                            <option value="Lead">Lead</option>
                        </select>
                    </div>

                    {/* Tech Stack (for technical and mixed interviews) */}
                    {(mode === 'technical' || mode === 'mixed') && (
                        <div>
                            <label className="block text-sm font-medium text-light-100 mb-2">
                                Tech Stack
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={techStackInput}
                                    onChange={(e) => setTechStackInput(e.target.value)}
                                    placeholder="e.g., React, Node.js, Python"
                                    className="flex-1 p-2 rounded bg-dark-300 text-light-100 border border-dark-400 focus:border-primary-500"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechStack())}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddTechStack}
                                    className="px-3 py-2"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="bg-primary-500 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTechStack(tech)}
                                            className="text-white hover:text-red-300"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Question Count */}
                    <div>
                        <label className="block text-sm font-medium text-light-100 mb-2">
                            Number of Questions
                        </label>
                        <select
                            value={questionCount}
                            onChange={(e) => setQuestionCount(Number(e.target.value))}
                            className="w-full p-2 rounded bg-dark-300 text-light-100 border border-dark-400 focus:border-primary-500"
                        >
                            <option value={3}>3 Questions</option>
                            <option value={5}>5 Questions</option>
                            <option value={7}>7 Questions</option>
                            <option value={10}>10 Questions</option>
                        </select>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-dark-400 hover:bg-dark-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating}
                            className="flex-1 btn-primary"
                        >
                            {isCreating ? 'Creating...' : 'Create Interview'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
