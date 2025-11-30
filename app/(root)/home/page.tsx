import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Image from 'next/image';

export default async function Home() {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen relative overflow-hidden bg-black -mx-8 w-[calc(100%+4rem)]">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#c0fe72]/10 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="pt-16 pb-12 px-4 md:px-6">
                    <div className="max-w-5xl mx-auto">
                        {/* Trust Badge */}
                        <div className="text-center mb-8 animate-fadeIn">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full shadow-lg">
                                <svg className="w-6 h-6 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                <span className="text-gray-200 font-medium">Trusted by 5,000+ job seekers</span>
                            </div>
                        </div>

                        {/* Main Headline */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fadeIn" style={{animationDelay: '0.1s'}}>
                                Practice Your Interview.
                                <br />
                                Succeed Every{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0fe72] via-[#d4ff8f] to-[#c0fe72]">
                                    Time
                                </span>
                                <span className="text-[#c0fe72]">.</span>
                            </h1>

                            {/* Feature List */}
                            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10 text-gray-300 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                                <div className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-lg font-medium">Analyses</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-lg font-medium">Tailored questions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-lg font-medium">Realistic practice interview</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-lg font-medium">And much more...</span>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="mb-12 animate-fadeIn" style={{animationDelay: '0.3s'}}>
                                <Button asChild size="lg" className="px-10 py-7 text-lg font-semibold bg-[#c0fe72] hover:bg-[#d4ff8f] text-black rounded-full shadow-lg shadow-[#c0fe72]/20 hover:shadow-xl hover:shadow-[#c0fe72]/30 transition-all duration-300 hover:scale-105">
                                    <Link href={user ? "/dashboard" : "/signup"} className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                        Start For Free
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Logos Section */}
                <section className="py-12 overflow-hidden w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
                    <div className="w-full">
                        <h3 className="text-center text-lg md:text-xl font-semibold text-gray-400 mb-8">
                            Trusted by Job Seekers At
                        </h3>
                        
                        {/* Scrolling logos container */}
                        <div className="relative">
                            <div className="flex gap-16 animate-scroll">
                                {/* First set of logos */}
                                <div className="flex gap-16 items-center min-w-max">
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_102222-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_102924-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_103051-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_103701-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_103845-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_104354-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_105620-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/supabase_BIG.D-94f7cfaf.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                
                                {/* Duplicate set for seamless loop */}
                                <div className="flex gap-16 items-center min-w-max">
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_102222-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_102924-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_103051-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_103701-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_103845-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_104354-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/Screenshot_2025-11-28_105620-removebg-preview.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image src="/Company_logos/supabase_BIG.D-94f7cfaf.png" alt="Company Logo" width={180} height={90} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How Prepify Works Section */}
                <section className="py-20 px-4 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Badge */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#c0fe72]/10 to-[#d4ff8f]/10 border border-[#c0fe72]/30 rounded-full">
                                <span className="text-2xl">🚀</span>
                                <span className="text-[#c0fe72] font-semibold">Simple Process</span>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0fe72] to-[#d4ff8f]">Prepify</span> Works
                            </h2>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                Get interview-ready in just 3 simple steps. Our streamlined process makes preparation effortless and effective.
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                            {/* Step 1 */}
                            <div className="text-center group">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#c0fe72] to-[#d4ff8f] rounded-full flex items-center justify-center shadow-lg shadow-[#c0fe72]/30 transform group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-4xl font-bold text-black">1</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Choose Your Interview</h3>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    Select from behavioral, technical, or role-specific interviews. Choose your target company and position level.
                                </p>
                                <div className="flex gap-3 justify-center flex-wrap">
                                    <span className="px-4 py-2 bg-[#c0fe72]/10 border border-[#c0fe72]/30 rounded-full text-[#c0fe72] text-sm font-medium">
                                        Multiple Types
                                    </span>
                                    <span className="px-4 py-2 bg-[#c0fe72]/10 border border-[#c0fe72]/30 rounded-full text-[#c0fe72] text-sm font-medium">
                                        Company Specific
                                    </span>
                                </div>
                            </div>

            {/* Step 2 */}
                            <div className="text-center group">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#9cd052] to-[#8bc34a] rounded-full flex items-center justify-center shadow-lg shadow-[#9cd052]/30 transform group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-4xl font-bold text-black">2</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Practice with AI</h3>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    Engage in realistic mock interviews with our advanced AI. Answer questions naturally and receive real-time feedback.
                                </p>
                                <div className="flex gap-3 justify-center flex-wrap">
                                    <span className="px-4 py-2 bg-[#9cd052]/10 border border-[#9cd052]/30 rounded-full text-[#9cd052] text-sm font-medium">
                                        Real-time AI
                                    </span>
                                    <span className="px-4 py-2 bg-[#9cd052]/10 border border-[#9cd052]/30 rounded-full text-[#9cd052] text-sm font-medium">
                                        Natural Speech
                                    </span>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="text-center group">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#7cb342] to-[#689f38] rounded-full flex items-center justify-center shadow-lg shadow-[#7cb342]/30 transform group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-4xl font-bold text-black">3</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Improve & Excel</h3>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    Review detailed performance analytics, identify improvement areas, and track your progress over time.
                                </p>
                                <div className="flex gap-3 justify-center flex-wrap">
                                    <span className="px-4 py-2 bg-[#7cb342]/10 border border-[#7cb342]/30 rounded-full text-[#7cb342] text-sm font-medium">
                                        Analytics
                                    </span>
                                    <span className="px-4 py-2 bg-[#7cb342]/10 border border-[#7cb342]/30 rounded-full text-[#7cb342] text-sm font-medium">
                                        Progress Tracking
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                            <Button asChild size="lg" className="px-10 py-7 text-lg font-semibold bg-gradient-to-r from-[#c0fe72] to-[#b8ec68] hover:from-[#a8dc5f] hover:to-[#9cd052] text-black rounded-full shadow-lg shadow-[#c0fe72]/20 hover:shadow-xl hover:shadow-[#c0fe72]/30 transition-all duration-300 hover:scale-105">
                                <Link href={user ? "/dashboard" : "/signup"} className="flex items-center gap-2">
                                    Start Your Journey
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Complete Platform Section */}
                <section className="py-20 px-4 md:px-6 bg-white/5 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Complete Platform for Interview Success
                            </h2>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                Everything you need in one place
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#c0fe72]/50 transition-all">
                                <div className="w-14 h-14 bg-[#c0fe72]/20 rounded-xl flex items-center justify-center mb-5">
                                    <svg className="w-8 h-8 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Resume Builder</h3>
                                <p className="text-gray-400">Create ATS-friendly resumes optimized for your target role</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all">
                                <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-5">
                                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Mock Interviews</h3>
                                <p className="text-gray-400">Practice with AI interviewer and get instant feedback</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#c0fe72]/50 transition-all">
                                <div className="w-14 h-14 bg-[#c0fe72]/20 rounded-xl flex items-center justify-center mb-5">
                                    <svg className="w-8 h-8 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Performance Analytics</h3>
                                <p className="text-gray-400">Track your progress with detailed insights and metrics</p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-yellow-500/50 transition-all">
                                <div className="w-14 h-14 bg-yellow-600/20 rounded-xl flex items-center justify-center mb-5">
                                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Coding Practice</h3>
                                <p className="text-gray-400">Solve coding challenges with hints and solutions</p>
                            </div>

                            {/* Feature 5 */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-red-500/50 transition-all">
                                <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center mb-5">
                                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Company Insights</h3>
                                <p className="text-gray-400">Access company-specific questions and interview patterns</p>
                            </div>

                            {/* Feature 6 */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all">
                                <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-5">
                                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Career Roadmaps</h3>
                                <p className="text-gray-400">Follow structured learning paths for your career goals</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Choose Your Plan Section */}
                <section id="pricing" className="py-20 px-4 md:px-6 scroll-mt-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0fe72] to-[#d4ff8f]">Plan</span>
                            </h2>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                Start free and upgrade when you're ready. No hidden fees, cancel anytime.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Free Plan */}
                            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                                <div className="mb-8">
                                    <span className="text-5xl font-bold text-white">₹0</span>
                                    <span className="text-gray-400 text-lg">/month</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">3 AI interviews per month</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">Basic performance analytics</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">General interview questions</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">Community support</span>
                                    </li>
                                </ul>
                                <Button asChild className="w-full bg-transparent hover:bg-white/10 text-white border-2 border-[#c0fe72]/50 hover:border-[#c0fe72] rounded-xl py-6 text-lg font-semibold">
                                    <Link href={user ? "/dashboard" : "/signup"}>Go to Dashboard</Link>
                                </Button>
                            </div>

                            {/* Pro Plan */}
                            <div className="bg-gradient-to-b from-gray-900 to-black backdrop-blur-sm rounded-3xl p-8 border-2 border-[#c0fe72] relative transform md:scale-105 shadow-2xl shadow-[#c0fe72]/20">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#c0fe72] to-[#d4ff8f] text-black px-6 py-2 rounded-full text-sm font-bold">
                                    Most Popular
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                                <div className="mb-8">
                                    <span className="text-5xl font-bold text-white">₹199</span>
                                    <span className="text-gray-400 text-lg">/month</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-white font-medium">Unlimited AI interviews</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-white font-medium">Company-specific questions</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-white font-medium">Advanced analytics & insights</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-white font-medium">Priority support</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-white font-medium">Resume optimization</span>
                                    </li>
                                </ul>
                                <Button asChild className="w-full bg-gradient-to-r from-[#c0fe72] to-[#d4ff8f] hover:from-[#a8dc5f] hover:to-[#b8ec68] text-black rounded-xl py-6 text-lg font-bold shadow-lg shadow-[#c0fe72]/30">
                                    <Link href={user ? "/dashboard" : "/signup"}>Go to Dashboard</Link>
                                </Button>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                                <div className="mb-8">
                                    <span className="text-5xl font-bold text-white">Custom</span>
                                    <div className="text-gray-400 text-lg">pricing</div>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">Everything in Pro</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">Team management</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">Custom integrations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">Dedicated support</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-6 h-6 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-300">SLA guarantee</span>
                                    </li>
                                </ul>
                                <Button asChild className="w-full bg-transparent hover:bg-white/10 text-white border-2 border-[#c0fe72]/50 hover:border-[#c0fe72] rounded-xl py-6 text-lg font-semibold">
                                    <Link href="/contact">Contact Sales</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Features Grid */}
                <section className="py-20 px-4 md:px-6 bg-white/5 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Everything You Need to <span className="text-[#c0fe72]">Excel</span>
                            </h2>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                Comprehensive tools and resources to help you land your dream job
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* AI Interviews */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all border border-white/10 hover:border-[#c0fe72]/50 group">
                                <div className="w-12 h-12 bg-[#c0fe72]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c0fe72]/30 transition-colors">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">AI-Powered Interviews</h3>
                                <p className="text-gray-400 mb-4">Practice with advanced AI that adapts to your skill level and provides real-time feedback.</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Behavioral & technical rounds</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Real-time voice & text interactions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Adaptive difficulty levels</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Detailed Analytics */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all border border-white/10 hover:border-purple-500/50 group">
                                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Deep Performance Analytics</h3>
                                <p className="text-gray-400 mb-4">Get comprehensive insights into your interview performance with actionable feedback.</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>NLP-powered scoring engine</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Personalized improvement tips</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Progress tracking over time</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Coding Practice */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all border border-white/10 hover:border-[#c0fe72]/50 group">
                                <div className="w-12 h-12 bg-[#c0fe72]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c0fe72]/30 transition-colors">
                                    <span className="text-2xl">⌨️</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">LeetCode-Style Practice</h3>
                                <p className="text-gray-400 mb-4">Sharpen your coding skills with timed challenges and comprehensive solutions.</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Timed coding challenges</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Hints & detailed editorials</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Topic mastery statistics</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Company Insights */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all border border-white/10 hover:border-yellow-500/50 group">
                                <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-600/30 transition-colors">
                                    <span className="text-2xl">🏢</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Company-Specific Prep</h3>
                                <p className="text-gray-400 mb-4">Access curated question banks and insights for your target companies.</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Real interview questions history</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Company culture insights</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Role-specific expectations</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Resume Analysis */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all border border-white/10 hover:border-red-500/50 group">
                                <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600/30 transition-colors">
                                    <span className="text-2xl">📄</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">AI Resume Optimization</h3>
                                <p className="text-gray-400 mb-4">Optimize your resume for ATS systems and stand out to recruiters.</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>ATS compatibility scoring</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Skill gap analysis</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Keyword recommendations</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Career Roadmaps */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all border border-white/10 hover:border-indigo-500/50 group">
                                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600/30 transition-colors">
                                    <span className="text-2xl">🗺️</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Personalized Roadmaps</h3>
                                <p className="text-gray-400 mb-4">Follow structured paths from novice to expert in your chosen field.</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Milestone tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Skill prerequisite mapping</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#c0fe72] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Curated learning resources</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof & Stats */}
                <section className="py-20 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Main Stats Card */}
                        <div className="bg-black border-2 border-[#c0fe72] rounded-3xl p-8 md:p-16 shadow-2xl shadow-[#c0fe72]/30 relative overflow-hidden">
                            {/* Animated background elements */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0fe72]/10 rounded-full blur-3xl animate-pulse"></div>
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                            </div>
                            
                            <div className="relative z-10">
                                {/* Header with badge */}
                                <div className="text-center mb-12">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c0fe72]/20 border border-[#c0fe72]/50 rounded-full mb-6">
                                        <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-[#c0fe72] font-semibold text-sm">TRUSTED PLATFORM</span>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                        Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0fe72] to-[#d4ff8f]">Thousands</span> of
                                        <br />
                                        Successful Candidates
                                    </h2>
                                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                        Our users have landed jobs at top companies worldwide with our AI-powered interview preparation
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                                    {/* Stat 1 */}
                                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#c0fe72]/50 transition-all group">
                                        <div className="flex items-center justify-center w-14 h-14 bg-[#c0fe72]/20 rounded-xl mb-4 mx-auto group-hover:bg-[#c0fe72]/30 transition-colors">
                                            <svg className="w-8 h-8 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl md:text-5xl font-bold text-[#c0fe72] mb-2">10K+</div>
                                            <div className="text-gray-400 font-medium text-sm">Interviews Completed</div>
                                        </div>
                                    </div>

                                    {/* Stat 2 */}
                                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#c0fe72]/50 transition-all group">
                                        <div className="flex items-center justify-center w-14 h-14 bg-[#c0fe72]/20 rounded-xl mb-4 mx-auto group-hover:bg-[#c0fe72]/30 transition-colors">
                                            <svg className="w-8 h-8 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl md:text-5xl font-bold text-[#c0fe72] mb-2">95%</div>
                                            <div className="text-gray-400 font-medium text-sm">Success Rate</div>
                                        </div>
                                    </div>

                                    {/* Stat 3 */}
                                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#c0fe72]/50 transition-all group">
                                        <div className="flex items-center justify-center w-14 h-14 bg-[#c0fe72]/20 rounded-xl mb-4 mx-auto group-hover:bg-[#c0fe72]/30 transition-colors">
                                            <svg className="w-8 h-8 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl md:text-5xl font-bold text-[#c0fe72] mb-2">500+</div>
                                            <div className="text-gray-400 font-medium text-sm">Companies Covered</div>
                                        </div>
                                    </div>

                                    {/* Stat 4 */}
                                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#c0fe72]/50 transition-all group">
                                        <div className="flex items-center justify-center w-14 h-14 bg-[#c0fe72]/20 rounded-xl mb-4 mx-auto group-hover:bg-[#c0fe72]/30 transition-colors">
                                            <svg className="w-8 h-8 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl md:text-5xl font-bold text-[#c0fe72] mb-2">24/7</div>
                                            <div className="text-gray-400 font-medium text-sm">AI Availability</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom CTA */}
                                <div className="text-center mt-12">
                                    <p className="text-gray-400 mb-6 text-lg">
                                        Join our community and start your journey to success
                                    </p>
                                    <Button asChild size="lg" className="px-8 py-6 bg-[#c0fe72] hover:bg-[#d4ff8f] text-black font-bold rounded-full shadow-xl shadow-[#c0fe72]/30 hover:shadow-2xl hover:shadow-[#c0fe72]/40 transition-all duration-300 hover:scale-105">
                                        <Link href={user ? "/dashboard" : "/signup"}>
                                            Get Started Now →
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Ace Your Next Interview?
                        </h2>
                        <p className="text-xl text-gray-400 mb-10">
                            Start practicing today and join thousands of successful job seekers
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="px-10 py-7 text-lg font-semibold bg-[#c0fe72] hover:bg-[#d4ff8f] text-black rounded-full shadow-lg shadow-[#c0fe72]/20 hover:shadow-xl hover:shadow-[#c0fe72]/30 transition-all duration-300 hover:scale-105">
                                <Link href={user ? "/dashboard" : "/signup"} className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                    {user ? "Go to Dashboard" : "Start For Free"}
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="px-10 py-7 text-lg font-semibold border-2 border-gray-600 text-gray-200 hover:bg-white/5 hover:border-gray-500 rounded-full">
                                <Link href="/interviews">
                                    Explore Interviews
                                </Link>
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-6">
                            No credit card required • Free forever plan • Cancel anytime
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
