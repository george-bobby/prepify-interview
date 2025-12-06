import React from 'react';
import CodingProblems from '@/components/CodingProblems';

const CodingPage = () => {
    return (
        <main className="flex flex-col gap-6 md:gap-10 relative min-h-screen bg-black">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0fe72]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Hero Banner Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-6 md:p-10 shadow-2xl shadow-[#c0fe72]/20">
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col gap-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full w-fit">
                            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="text-purple-400 font-semibold text-sm">LEETCODE PRACTICE</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Master Coding with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0fe72] to-purple-400">
                                LeetCode Problems
                            </span>
                        </h1>
                        <p className="text-lg text-gray-300">
                            Practice daily challenges, random problems, and company-specific questions to ace your technical interviews
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">Daily Challenges</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">Company Questions</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">Random Practice</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="relative w-64 h-64">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
                            <div className="absolute inset-4 bg-gradient-to-br from-[#c0fe72] to-purple-500 rounded-full opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute inset-8 bg-gradient-to-br from-blue-500 to-[#c0fe72] rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
                            <div className="absolute inset-0 flex items-center justify-center text-8xl">💻</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-[#c0fe72]/30 rounded-2xl p-6 hover:border-[#c0fe72]/60 transition-all group">
                    <div className="w-14 h-14 bg-[#c0fe72]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c0fe72]/30 transition-colors">
                        <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="text-[#c0fe72] font-bold text-lg mb-3">Start with Easy</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Build confidence with easier problems</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Learn fundamental patterns</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Progress to medium gradually</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 transition-all group">
                    <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                        <span className="text-3xl">📝</span>
                    </div>
                    <h3 className="text-purple-400 font-bold text-lg mb-3">Practice Daily</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Solve at least one problem daily</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Review solutions from others</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Track your progress consistently</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/60 transition-all group">
                    <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                        <span className="text-3xl">🚀</span>
                    </div>
                    <h3 className="text-blue-400 font-bold text-lg mb-3">Company Focus</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Target specific company questions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Learn company-specific patterns</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Understand interview expectations</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Coding Problems Component */}
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
                <CodingProblems />
            </div>
        </main>
    );
};

export default CodingPage;
