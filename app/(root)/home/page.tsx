import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Image from 'next/image';

export default async function Home() {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Clean, Subtle Background */}
            <div className="absolute inset-0">
                {/* Refined gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-slate-900/20 to-purple-950/30"></div>

                {/* Minimal floating orbs */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full filter blur-3xl animate-pulse"></div>
                </div>

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="container mx-auto px-6 py-20 text-center">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="inline-flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
                            <Image
                                src="/logo.svg"
                                alt="Prepify Logo"
                                width={140}
                                height={40}
                                className="drop-shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Main Heading */}
                    <div className="mb-8 space-y-6">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                            <span className="block text-white mb-3">
                                Ace Your Next
                            </span>
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                                Interview
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <div className="max-w-2xl mx-auto">
                            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                                Master interview skills with AI-powered practice,
                                <span className="text-blue-300 font-medium"> personalized feedback</span>, and
                                <span className="text-emerald-300 font-medium"> expert guidance</span>.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        {user ? (
                            <>
                                <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    <Link href="/dashboard" className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                        </svg>
                                        Go to Dashboard
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105">
                                    <Link href="/interviews" className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        Start Interview
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild size="lg" className="px-10 py-5 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    <Link href="/signup" className="flex items-center gap-3">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Get Started Free
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" className="px-10 py-5 text-xl font-semibold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105" asChild>
                                    <Link href="#demo" className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l8-5-8-5z" />
                                        </svg>
                                        Watch Demo
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-8 text-sm mb-20">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <span className="text-slate-300 font-medium">No credit card required</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-slate-300 font-medium">Free trial available</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-slate-300 font-medium">10,000+ interviews completed</span>
                        </div>
                    </div>

                </section>

                {/* Demo Section */}
                <section className="container mx-auto px-6 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div id="demo" className="relative group">
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-500">
                                <div className="aspect-video bg-slate-800/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">See Prepify in Action</h3>
                                        <p className="text-slate-400 text-lg">Watch how AI transforms your interview preparation journey</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/20 backdrop-blur-sm">
                                ✨ Powerful Features
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            <span className="text-white">Everything You Need to</span><br />
                            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                Succeed
                            </span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Our comprehensive platform provides cutting-edge tools designed to excel in any interview scenario
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {/* Feature 1 - AI Interviews */}
                        <div className="group">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-all duration-500 h-full group-hover:scale-105">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4">
                                    AI-Powered Interviews
                                </h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    Practice with advanced AI that adapts to your responses and provides realistic interview scenarios.
                                </p>

                                <ul className="space-y-3 text-left">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-slate-300 text-sm">Behavioral questions</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-slate-300 text-sm">Technical challenges</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                        <span className="text-slate-300 text-sm">Adaptive difficulty</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Feature 2 - Feedback */}
                        <div className="group">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-all duration-500 h-full group-hover:scale-105">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4">
                                    Detailed Feedback
                                </h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    Get comprehensive analysis of your performance with actionable insights and improvement suggestions.
                                </p>

                                <ul className="space-y-3 text-left">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                        <span className="text-slate-300 text-sm">Performance scoring</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                        <span className="text-slate-300 text-sm">Improvement areas</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                        <span className="text-slate-300 text-sm">Progress tracking</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Feature 3 - Company Prep */}
                        <div className="group">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-all duration-500 h-full group-hover:scale-105">
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
                                        <span className="text-2xl">🏢</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4">
                                    Company-Specific Prep
                                </h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    Prepare for interviews at specific companies with tailored questions and culture insights.
                                </p>

                                <ul className="space-y-3 text-left">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span className="text-slate-300 text-sm">Company research</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span className="text-slate-300 text-sm">Culture fit questions</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span className="text-slate-300 text-sm">Industry insights</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-blue-400">10K+</div>
                                <div className="text-slate-400 text-sm font-medium">Interviews Completed</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-emerald-400">95%</div>
                                <div className="text-slate-400 text-sm font-medium">Success Rate</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-purple-400">500+</div>
                                <div className="text-slate-400 text-sm font-medium">Companies</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-orange-400">24/7</div>
                                <div className="text-slate-400 text-sm font-medium">AI Support</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="container mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/20 backdrop-blur-sm">
                                🚀 Simple Process
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            <span className="text-white">How</span>
                            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"> Prepify </span>
                            <span className="text-white">Works</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Get interview-ready in just 3 simple steps. Our streamlined process makes preparation effortless and effective.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                        {/* Step 1 */}
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold text-white">1</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4">
                                Choose Your Interview
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                Select from behavioral, technical, or role-specific interviews. Choose your target company and position level.
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                                    Multiple Types
                                </span>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                                    Company Specific
                                </span>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4">
                                Practice with AI
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                Engage in realistic mock interviews with our advanced AI. Answer questions naturally and receive real-time feedback.
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                                    Real-time AI
                                </span>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                                    Natural Speech
                                </span>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold text-white">3</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4">
                                Improve & Excel
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                Review detailed performance analytics, identify improvement areas, and track your progress over time.
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                                    Analytics
                                </span>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                                    Progress Tracking
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center">
                        <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <Link href={user ? "/dashboard" : "/signup"} className="flex items-center gap-2">
                                Start Your Journey
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary-100 mb-4">
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">Plan</span>
                        </h2>
                        <p className="text-xl text-light-400 max-w-3xl mx-auto">
                            Start free and upgrade when you're ready. No hidden fees, cancel anytime.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8 relative group hover:border-primary-200/50 transition-all">
                            <h3 className="text-2xl font-bold text-primary-100 mb-2">Free</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-primary-100">$0</span>
                                <span className="text-light-400 text-lg">/month</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">3 AI interviews per month</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Basic performance analytics</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">General interview questions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Community support</span>
                                </li>
                            </ul>

                            <Button asChild className="w-full bg-dark-100 border border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all">
                                <Link href={user ? "/dashboard" : "/signup"}>
                                    {user ? "Go to Dashboard" : "Get Started"}
                                </Link>
                            </Button>
                        </div>

                        {/* Pro Plan - Most Popular */}
                        <div className="bg-gradient-to-br from-primary-200/10 to-primary-300/10 border-2 border-primary-200 rounded-2xl p-8 relative group transform scale-105 shadow-2xl">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-primary-200 to-primary-300 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-primary-100 mb-2">Pro</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-primary-100">₹199</span>
                                <span className="text-light-400 text-lg">/month</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Unlimited AI interviews</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Company-specific questions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Advanced analytics & insights</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Priority support</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Resume optimization</span>
                                </li>
                            </ul>

                            <Button asChild className="w-full bg-gradient-to-r from-primary-200 to-primary-300 text-white hover:from-primary-300 hover:to-primary-400 transform hover:scale-105 transition-all">
                                <Link href={user ? "/dashboard" : "/signup"}>
                                    {user ? "Go to Dashboard" : "Upgrade to Pro"}
                                </Link>
                            </Button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8 relative group hover:border-primary-200/50 transition-all">
                            <h3 className="text-2xl font-bold text-primary-100 mb-2">Enterprise</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-primary-100">Custom</span>
                                <span className="text-light-400 text-lg block">pricing</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Everything in Pro</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Team management</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Custom integrations</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">Dedicated support</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-success-100 text-lg">✓</span>
                                    <span className="text-light-300">SLA guarantee</span>
                                </li>
                            </ul>

                            <Button asChild className="w-full bg-dark-100 border border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all">
                                <Link href="/contact">Contact Sales</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <div className="bg-gradient-to-br from-dark-200/50 to-dark-300/50 rounded-2xl p-8 max-w-4xl mx-auto border border-dark-300">
                            <h3 className="text-2xl font-bold text-primary-100 mb-4">
                                💰 Money-Back Guarantee
                            </h3>
                            <p className="text-light-400 text-lg mb-4">
                                Not satisfied with your interview performance improvement? Get a full refund within 30 days.
                            </p>
                            <p className="text-light-400 text-sm">Contact our sales team to discuss enterprise solutions and volume discounts.</p>
                        </div>
                    </div>
                </section>

                {/* Enhanced Testimonials Section */}
                <section className="mb-24">
                    <div className="text-center mb-20">
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 bg-yellow-400/10 text-yellow-400 rounded-full text-sm font-semibold border border-yellow-400/20 backdrop-blur-sm">
                                ⭐ Success Stories
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                            <span className="text-white">What Our Users</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Say</span>
                        </h2>
                        <p className="text-xl text-light-300 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of successful candidates who've transformed their interview skills and landed their dream jobs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        {/* Testimonial 1 */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                            <div className="relative bg-gradient-to-br from-dark-200/80 to-dark-300/80 backdrop-blur-xl border border-primary-400/20 rounded-3xl p-8 hover:border-primary-400/40 transition-all duration-500">
                                {/* Quote icon */}
                                <div className="absolute top-6 right-6 text-4xl text-primary-400/20">"</div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            S
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Sarah Chen</h4>
                                        <p className="text-light-400 text-sm">Software Engineer at Google</p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="text-yellow-400 text-sm">⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-light-200 leading-relaxed text-lg italic mb-4">
                                    "Prepify helped me prepare for technical interviews at FAANG companies.
                                    The <span className="text-primary-300 font-medium not-italic">AI feedback was incredibly detailed</span>
                                    and helped me improve my problem-solving approach."
                                </p>

                                <div className="flex items-center gap-2 text-sm text-light-400">
                                    <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                                    Hired at Google in 2 weeks
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-success-100 to-success-200 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                            <div className="relative bg-gradient-to-br from-dark-200/80 to-dark-300/80 backdrop-blur-xl border border-success-100/20 rounded-3xl p-8 hover:border-success-100/40 transition-all duration-500">
                                <div className="absolute top-6 right-6 text-4xl text-success-100/20">"</div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            M
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Michael Rodriguez</h4>
                                        <p className="text-light-400 text-sm">Product Manager at Microsoft</p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="text-yellow-400 text-sm">⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-light-200 leading-relaxed text-lg italic mb-4">
                                    "The <span className="text-success-100 font-medium not-italic">company-specific preparation was a game-changer</span>.
                                    I felt confident going into my Microsoft interview knowing exactly what to expect. Landed the job!"
                                </p>

                                <div className="flex items-center gap-2 text-sm text-light-400">
                                    <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
                                    40% salary increase
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                            <div className="relative bg-gradient-to-br from-dark-200/80 to-dark-300/80 backdrop-blur-xl border border-purple-400/20 rounded-3xl p-8 hover:border-purple-400/40 transition-all duration-500">
                                <div className="absolute top-6 right-6 text-4xl text-purple-400/20">"</div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            A
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Aisha Patel</h4>
                                        <p className="text-light-400 text-sm">Data Scientist at Netflix</p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="text-yellow-400 text-sm">⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-light-200 leading-relaxed text-lg italic mb-4">
                                    "As someone with interview anxiety, <span className="text-purple-300 font-medium not-italic">Prepify's safe practice environment was perfect</span>.
                                    I could practice as many times as I needed until I felt ready."
                                </p>

                                <div className="flex items-center gap-2 text-sm text-light-400">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                    Overcame interview anxiety
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aggregate stats */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-6 px-8 py-4 bg-gradient-to-r from-dark-200/50 to-dark-300/50 backdrop-blur-xl border border-yellow-400/20 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-lg">⭐</span>
                                    ))}
                                </div>
                                <span className="text-white font-semibold">4.9/5</span>
                            </div>
                            <div className="w-px h-6 bg-light-400/30"></div>
                            <span className="text-light-300">Based on 2,500+ reviews</span>
                        </div>
                    </div>
                </section>

                {/* Enhanced Final CTA Section */}
                <section className="py-24">
                    <div className="max-w-6xl mx-auto relative">
                        {/* Animated background elements */}
                        <div className="absolute inset-0 overflow-hidden rounded-3xl">
                            <div className="absolute top-20 left-20 w-40 h-40 bg-primary-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                            <div className="absolute bottom-20 right-20 w-60 h-60 bg-success-100 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
                        </div>

                        {/* Main CTA container */}
                        <div className="relative">
                            {/* Glowing border effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-success-100 to-purple-400 rounded-3xl blur opacity-30"></div>

                            <div className="relative bg-gradient-to-br from-dark-200/90 to-dark-300/90 backdrop-blur-xl rounded-3xl border border-primary-400/20 p-16 text-center overflow-hidden">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                                        backgroundSize: '40px 40px'
                                    }}></div>
                                </div>

                                <div className="relative z-10 space-y-8">
                                    {/* Badge */}
                                    <div className="inline-block">
                                        <span className="px-6 py-3 bg-gradient-to-r from-primary-400/20 to-success-100/20 text-primary-200 rounded-full text-sm font-semibold border border-primary-400/30 backdrop-blur-sm">
                                            🚀 Ready to Transform Your Career?
                                        </span>
                                    </div>

                                    {/* Main headline */}
                                    <div>
                                        <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                                            <span className="text-white">Ready to Ace Your</span><br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-success-100 to-purple-400 animate-glow">
                                                Next Interview?
                                            </span>
                                        </h2>

                                        <p className="text-xl md:text-2xl text-light-200 max-w-4xl mx-auto leading-relaxed font-light">
                                            Join <span className="text-primary-300 font-semibold">10,000+ successful candidates</span> who've
                                            improved their interview skills with Prepify. Start your journey today —
                                            <span className="text-success-100 font-semibold"> completely free</span>.
                                        </p>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-col lg:flex-row gap-6 justify-center items-center pt-4">
                                        <Button asChild size="lg" className="group relative text-xl px-16 py-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 rounded-2xl font-bold min-w-[280px] border-2 border-emerald-400/30 hover:border-emerald-300 animate-pulse-glow">
                                            <Link href={user ? "/dashboard" : "/signup"}>
                                                <span className="relative z-10 flex items-center gap-3">
                                                    <svg className="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                    </svg>
                                                    {user ? "Go to Dashboard" : "Start Free Trial"}
                                                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
                                            </Link>
                                        </Button>

                                        <Button variant="outline" size="lg" className="text-xl px-16 py-8 border-2 border-primary-400/50 text-primary-200 hover:bg-primary-400/10 hover:border-primary-400 transition-all duration-300 backdrop-blur-sm rounded-2xl font-bold min-w-[280px]" asChild>
                                            <Link href="/interviews">
                                                <span className="flex items-center gap-3">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                    </svg>
                                                    Browse Interview Types
                                                </span>
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Trust indicators */}
                                    <div className="pt-8">
                                        <div className="flex flex-wrap justify-center gap-8 text-sm">
                                            <div className="flex items-center gap-3 px-6 py-3 bg-dark-100/30 backdrop-blur-sm rounded-full border border-success-100/20">
                                                <div className="w-3 h-3 bg-success-100 rounded-full animate-pulse"></div>
                                                <span className="text-light-200 font-medium">Free forever plan</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-6 py-3 bg-dark-100/30 backdrop-blur-sm rounded-full border border-primary-400/20">
                                                <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse"></div>
                                                <span className="text-light-200 font-medium">No credit card required</span>
                                            </div>
                                            <div className="flex items-center gap-3 px-6 py-3 bg-dark-100/30 backdrop-blur-sm rounded-full border border-yellow-400/20">
                                                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                                <span className="text-light-200 font-medium">Cancel anytime</span>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
