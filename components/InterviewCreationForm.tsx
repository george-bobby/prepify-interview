"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { InterviewConfig, InterviewMode } from '@/lib/schemas/interview';

interface InterviewCreationFormProps {
    userId: string;
}

const InterviewCreationForm: React.FC<InterviewCreationFormProps> = ({ userId }) => {
    const router = useRouter();
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

            const response = await fetch('/api/interviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config, questionCount, userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to create interview');
            }

            const data = await response.json();
            router.push(`/interviews/${data.interviewId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create interview');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#c0fe72]/20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center border border-[#c0fe72]/30">
                        <span className="text-2xl">📝</span>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">
                        Interview Configuration
                    </h2>
                </div>
                <Link href="/interviews">
                    <Button className="bg-white/5 border-2 border-gray-700 text-gray-300 font-semibold">
                        ⬅️ Back
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Interview Mode */}
                <div>
                    <label className="block text-base font-bold text-[#c0fe72] mb-3">
                        🎯 Interview Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['technical', 'behavioral', 'mixed'] as const).map((modeOption) => (
                            <button
                                key={modeOption}
                                type="button"
                                onClick={() => setMode(modeOption)}
                                className={`p-4 rounded-2xl text-base font-semibold capitalize border-2 transition-all ${
                                    mode === modeOption
                                        ? 'bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black border-[#c0fe72] shadow-lg shadow-[#c0fe72]/30'
                                        : 'bg-white/5 text-gray-300 border-gray-700'
                                }`}
                            >
                                {modeOption === 'technical' && '💻 '}
                                {modeOption === 'behavioral' && '💬 '}
                                {modeOption === 'mixed' && '🔀 '}
                                {modeOption}
                            </button>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                        {mode === 'technical' && '💡 Focus on coding, algorithms, and technical problem-solving'}
                        {mode === 'behavioral' && '💡 Focus on soft skills, leadership, and team dynamics'}
                        {mode === 'mixed' && '💡 Combination of technical and behavioral questions'}
                    </p>
                </div>

                {/* Role */}
                <div>
                    <label className="block text-base font-bold text-[#c0fe72] mb-3">
                        👔 Target Role
                    </label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g., Senior Frontend Developer, Product Manager, Full Stack Engineer"
                        className="w-full p-4 rounded-2xl bg-white/5 text-gray-200 border-2 border-gray-700 focus:border-[#c0fe72] focus:outline-none text-base placeholder:text-gray-500"
                        required
                    />
                </div>

                {/* Level */}
                <div>
                    <label className="block text-base font-bold text-[#c0fe72] mb-3">
                        📊 Experience Level
                    </label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as any)}
                        className="w-full p-4 rounded-2xl bg-white/5 text-gray-200 border-2 border-gray-700 focus:border-[#c0fe72] focus:outline-none text-base"
                    >
                        <option value="Junior" className="bg-gray-900">🌱 Junior (0-2 years)</option>
                        <option value="Mid" className="bg-gray-900">🚀 Mid (2-5 years)</option>
                        <option value="Senior" className="bg-gray-900">⭐ Senior (5-10 years)</option>
                        <option value="Lead" className="bg-gray-900">👑 Lead (10+ years)</option>
                    </select>
                </div>

                {/* Tech Stack (for technical and mixed interviews) */}
                {(mode === 'technical' || mode === 'mixed') && (
                    <div>
                        <label className="block text-base font-bold text-[#c0fe72] mb-3">
                            💻 Tech Stack
                        </label>
                        <div className="flex gap-3 mb-3">
                            <input
                                type="text"
                                value={techStackInput}
                                onChange={(e) => setTechStackInput(e.target.value)}
                                placeholder="e.g., React, Node.js, Python, AWS"
                                className="flex-1 p-4 rounded-2xl bg-white/5 text-gray-200 border-2 border-gray-700 focus:border-[#c0fe72] focus:outline-none text-base placeholder:text-gray-500"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechStack())}
                            />
                            <Button
                                type="button"
                                onClick={handleAddTechStack}
                                className="px-6 bg-gradient-to-r from-[#9cd052] to-[#7cb342] text-black font-bold shadow-lg"
                            >
                                ➕ Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-4 py-2 bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 text-[#c0fe72] rounded-full text-sm font-semibold border-2 border-[#c0fe72]/40 flex items-center gap-2 shadow-lg"
                                >
                                    {tech}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTechStack(tech)}
                                        className="text-[#c0fe72] font-bold text-lg"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        {techStack.length === 0 && (
                            <p className="text-gray-400 text-sm mt-2">
                                💡 Add technologies to get more targeted questions
                            </p>
                        )}
                    </div>
                )}

                {/* Question Count */}
                <div>
                    <label className="block text-base font-bold text-[#c0fe72] mb-3">
                        🔢 Number of Questions
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[3, 5, 7, 10].map((count) => (
                            <button
                                key={count}
                                type="button"
                                onClick={() => setQuestionCount(count)}
                                className={`p-4 rounded-2xl text-base font-semibold border-2 transition-all ${
                                    questionCount === count
                                        ? 'bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black border-[#c0fe72] shadow-lg shadow-[#c0fe72]/30'
                                        : 'bg-white/5 text-gray-300 border-gray-700'
                                }`}
                            >
                                {count} Q's
                            </button>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                        ⏱️ Estimated time: {questionCount * 3}-{questionCount * 5} minutes
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/50 rounded-2xl p-4 flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">❌</span>
                        </div>
                        <div>
                            <h4 className="text-red-400 font-bold mb-1">Error</h4>
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isCreating}
                        className="flex-1 bg-gradient-to-r from-[#c0fe72] via-[#9cd052] to-[#c0fe72] text-black font-extrabold text-lg py-6 rounded-2xl shadow-2xl shadow-[#c0fe72]/40 disabled:opacity-50"
                    >
                        {isCreating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Your Interview...
                            </>
                        ) : (
                            '🚀 Create Interview & Start'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default InterviewCreationForm;
