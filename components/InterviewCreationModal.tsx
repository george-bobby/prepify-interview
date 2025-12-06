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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 pt-20 pb-8">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-4 sm:p-6 w-full max-w-lg shadow-2xl shadow-[#c0fe72]/20 relative max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-lg flex items-center justify-center border border-[#c0fe72]/30">
                            <span className="text-lg">🎯</span>
                        </div>
                        <h2 className="text-lg font-bold bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">Create New Interview</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-[#c0fe72] font-bold text-xl"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Interview Mode */}
                    <div>
                        <label className="block text-sm font-bold text-[#c0fe72] mb-2">
                            🎯 Interview Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['technical', 'behavioral', 'mixed'] as const).map((modeOption) => (
                                <button
                                    key={modeOption}
                                    type="button"
                                    onClick={() => setMode(modeOption)}
                                    className={`p-2 rounded-lg text-xs capitalize font-semibold border-2 ${
                                        mode === modeOption
                                            ? 'bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black border-[#c0fe72] shadow-lg'
                                            : 'bg-white/5 text-gray-300 border-gray-700'
                                    }`}
                                >
                                    {modeOption}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-bold text-[#c0fe72] mb-2">
                            👔 Role
                        </label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g., Frontend Developer, Product Manager"
                            className="w-full p-2 text-sm rounded-lg bg-white/5 text-gray-200 border-2 border-gray-700 focus:border-[#c0fe72] focus:outline-none placeholder:text-gray-500"
                            required
                        />
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-bold text-[#c0fe72] mb-2">
                            📊 Experience Level
                        </label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value as any)}
                            className="w-full p-2 text-sm rounded-lg bg-white/5 text-gray-200 border-2 border-gray-700 focus:border-[#c0fe72] focus:outline-none"
                        >
                            <option value="Junior" className="bg-gray-900">Junior</option>
                            <option value="Mid" className="bg-gray-900">Mid</option>
                            <option value="Senior" className="bg-gray-900">Senior</option>
                            <option value="Lead" className="bg-gray-900">Lead</option>
                        </select>
                    </div>

                    {/* Tech Stack (for technical and mixed interviews) */}
                    {(mode === 'technical' || mode === 'mixed') && (
                        <div>
                            <label className="block text-sm font-bold text-[#c0fe72] mb-2">
                                💻 Tech Stack
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={techStackInput}
                                    onChange={(e) => setTechStackInput(e.target.value)}
                                    placeholder="e.g., React, Node.js, Python"
                                    className="flex-1 p-2 text-sm rounded-lg bg-white/5 text-gray-200 border-2 border-gray-700 focus:border-[#c0fe72] focus:outline-none placeholder:text-gray-500"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechStack())}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddTechStack}
                                    className="px-3 py-2 text-sm bg-gradient-to-r from-[#9cd052] to-[#7cb342] text-black font-bold"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-1 bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 text-[#c0fe72] rounded-full text-xs font-semibold border border-[#c0fe72]/30 flex items-center gap-1"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTechStack(tech)}
                                            className="text-[#c0fe72] font-bold"
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
                        <label className="block text-sm font-bold text-[#c0fe72] mb-2">
                            🔢 Number of Questions
                        </label>
                        <select
                            value={questionCount}
                            onChange={(e) => setQuestionCount(Number(e.target.value))}
                            className="w-full p-2 text-sm rounded-lg bg-white/5 text-gray-200 border-2 border-gray-700 focus:border-[#c0fe72] focus:outline-none"
                        >
                            <option value={3} className="bg-gray-900">3 Questions</option>
                            <option value={5} className="bg-gray-900">5 Questions</option>
                            <option value={7} className="bg-gray-900">7 Questions</option>
                            <option value={10} className="bg-gray-900">10 Questions</option>
                        </select>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-3 bg-red-500/20 border-2 border-red-500/50 text-red-300 rounded-xl flex items-start gap-2">
                            <span className="text-xl">❌</span>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="flex-1 text-sm py-2 bg-white/5 border-2 border-gray-700 text-gray-300 font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating}
                            className="flex-1 text-sm py-2 bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold shadow-lg disabled:opacity-50"
                        >
                            {isCreating ? 'Creating...' : '🚀 Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
