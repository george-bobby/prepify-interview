import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Image from 'next/image';

export default async function Home() {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0">
                {/* Primary gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-blue-900/20"></div>
                
                {/* Floating orbs with enhanced effects */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full filter blur-3xl animate-pulse animate-float"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full filter blur-3xl animate-pulse animate-float animation-delay-1000"></div>
                    <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full filter blur-3xl animate-pulse animate-float animation-delay-2000"></div>
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full filter blur-3xl animate-pulse animate-float animation-delay-3000 opacity-70"></div>
                </div>
                
                {/* Enhanced Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                        radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
                        linear-gradient(45deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(-45deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '100px 100px, 150px 150px, 20px 20px, 20px 20px'
                }}></div>
                
                {/* Subtle noise texture */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-2">
                {/* Enhanced Hero Section */}
                <section id="hero" className="text-center py-4 mb-8">
                    {/* Enhanced Floating Logo */}
                    <div className="mb-4 relative animate-slideDown">
                        <div className="relative inline-block group">
                            {/* Multiple glow layers for depth */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-emerald-500/40 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-600/30 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                            
                            {/* Enhanced container with glass morphism */}
                            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 group-hover:scale-105 group-hover:border-white/30">
                                <Image
                                    src="/logo.svg"
                                    alt="Prepify Logo"
                                    width={120}
                                    height={32}
                                    className="mx-auto animate-float drop-shadow-lg"
                                />
                                
                                {/* Shimmer effect overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 rounded-2xl"></div>
                            </div>
                            
                            {/* Floating particles */}
                            <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
                            <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
                            <div className="absolute top-1/2 -right-4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-50 animation-delay-500"></div>
                        </div>
                    </div>

                    {/* Enhanced Title with Advanced Typography */}
                    <div className="mb-4 animate-fadeIn animation-delay-500">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3">
                            <span className="block text-white mb-2 animate-slideUp drop-shadow-2xl bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                                Ace Your Next
                            </span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 animate-glow animate-slideUp animation-delay-300 drop-shadow-xl relative">
                                Interview
                                {/* Text glow effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent blur-sm opacity-60 -z-10">
                                    Interview
                                </span>
                            </span>
                        </h1>
                        
                        {/* Enhanced Subtitle with better styling */}
                        <div className="relative inline-block animate-fadeIn animation-delay-1000 max-w-3xl mx-auto">
                            <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed font-light px-4">
                                Master interview skills with 
                                <span className="relative inline-block mx-2">
                                    <span className="text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-300 relative z-10">
                                        AI-powered practice sessions
                                    </span>
                                    <span className="absolute inset-0 bg-blue-400/20 blur-lg rounded-lg"></span>
                                </span>, get 
                                <span className="relative inline-block mx-2">
                                    <span className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors duration-300 relative z-10">
                                        personalized feedback
                                    </span>
                                    <span className="absolute inset-0 bg-emerald-400/20 blur-lg rounded-lg"></span>
                                </span>, and 
                                <span className="relative inline-block mx-2">
                                    <span className="text-purple-400 font-semibold hover:text-purple-300 transition-colors duration-300 relative z-10">
                                        land your dream job
                                    </span>
                                    <span className="absolute inset-0 bg-purple-400/20 blur-lg rounded-lg"></span>
                                </span> with confidence.
                            </p>
                            
                            {/* Enhanced decorative underline */}
                            <div className="flex justify-center mt-2">
                                <div className="relative">
                                    <div className="w-24 h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 rounded-full animate-pulse"></div>
                                    <div className="absolute inset-0 w-24 h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 rounded-full blur-md opacity-60"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-slideUp animation-delay-1500">
                        {user ? (
                            <>
                                <Button asChild size="lg" className="group relative text-sm px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-blue-500/30 rounded-2xl font-bold border border-white/20 hover:border-white/40 overflow-hidden">
                                    <Link href="/dashboard">
                                        <span className="relative z-10 flex items-center gap-2">
                                            <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                            </svg>
                                            Go to Dashboard
                                            <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        {/* Animated background overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        {/* Moving shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                                        {/* Glow effect */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="group text-sm px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-500 backdrop-blur-xl rounded-2xl font-semibold hover:scale-105 hover:shadow-xl hover:shadow-white/10 relative overflow-hidden">
                                    <Link href="/interviews">
                                        <span className="relative z-10 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                            </svg>
                                            Start Interview
                                        </span>
                                        {/* Subtle shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild size="lg" className="group relative text-base px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white transform hover:scale-110 transition-all duration-500 shadow-2xl hover:shadow-blue-500/30 rounded-2xl font-bold border border-white/20 hover:border-white/40 overflow-hidden">
                                    <Link href="/signup">
                                        <span className="relative z-10 flex items-center gap-3">
                                            <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Get Started Free
                                            <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        {/* Animated background overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        {/* Moving shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                                        {/* Glow effect */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" className="group text-base px-10 py-5 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-500 backdrop-blur-xl rounded-2xl font-semibold hover:scale-105 hover:shadow-xl hover:shadow-white/10 relative overflow-hidden" asChild>
                                    <Link href="#demo">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 5v10l8-5-8-5z"/>
                                            </svg>
                                            Watch Demo
                                        </span>
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Enhanced Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm mb-10 animate-fadeIn animation-delay-2000">
                        <div className="group flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 backdrop-blur-xl rounded-full border border-emerald-400/30 hover:border-emerald-400/60 hover:scale-105 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/20 animate-slideUp animation-delay-2000">
                            <div className="relative">
                                <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-40"></div>
                            </div>
                            <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">No credit card required</span>
                        </div>
                        <div className="group flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-full border border-blue-400/30 hover:border-blue-400/60 hover:scale-105 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 animate-slideUp animation-delay-2200">
                            <div className="relative">
                                <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-40"></div>
                            </div>
                            <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">Free trial available</span>
                        </div>
                        <div className="group flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-xl rounded-full border border-purple-400/30 hover:border-purple-400/60 hover:scale-105 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20 animate-slideUp animation-delay-2400">
                            <div className="relative">
                                <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-40"></div>
                            </div>
                            <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">10,000+ interviews completed</span>
                        </div>
                    </div>

                    {/* Enhanced Demo Section */}
                    <div className="max-w-3xl mx-auto animate-fadeIn animation-delay-2500">
                        <div id="demo" className="relative group hover:scale-[1.02] transition-transform duration-500">
                            {/* Glowing border effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-primary-500 to-success-100 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse-glow"></div>
                            
                            <div className="relative bg-gradient-to-br from-dark-200/90 to-dark-300/90 backdrop-blur-xl rounded-2xl border border-primary-400/20 p-4 shadow-2xl hover:border-primary-400/40 transition-all duration-500">
                                <div className="aspect-video bg-gradient-to-br from-dark-100/50 to-dark-200/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(99,102,241,0.1) 50%, transparent 70%)`,
                                            backgroundSize: '20px 20px',
                                            animation: 'slide 3s linear infinite'
                                        }}></div>
                                    </div>
                                    
                                    <div className="text-center relative z-10">
                                        <div className="relative mb-3">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                </svg>
                                            </div>
                                            {/* Ripple effect */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 border-2 border-primary-400 rounded-full animate-ping opacity-20"></div>
                                                <div className="absolute w-20 h-20 border border-primary-300 rounded-full animate-ping opacity-10 animation-delay-1000"></div>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-primary-100 mb-2">See Prepify in Action</h3>
                                        <p className="text-light-400 text-sm">Watch how AI transforms your interview preparation journey</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced Features Section */}
                <section id="features" className="mb-16">
                    <div className="text-center mb-12">
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 bg-primary-500/10 text-primary-300 rounded-full text-sm font-semibold border border-primary-500/20 backdrop-blur-sm">
                                ✨ Powerful Features
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                            <span className="text-white">Everything You Need to</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-success-100">
                                Succeed
                            </span>
                        </h2>
                        <p className="text-lg text-light-300 max-w-2xl mx-auto leading-relaxed">
                            Our comprehensive platform provides cutting-edge tools designed to excel in any interview scenario
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        {/* Feature 1 - AI Interviews */}
                        <div className="group relative">
                            {/* Hover glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                            
                            <div className="relative bg-gradient-to-br from-dark-200/80 to-dark-300/80 backdrop-blur-xl border border-primary-400/20 rounded-3xl p-8 text-center hover:border-primary-400/40 transition-all duration-500 h-full group-hover:transform group-hover:scale-[1.02]">
                                {/* Animated Icon */}
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl">🤖</span>
                                    </div>
                                    {/* Floating particles */}
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary-300 rounded-full animate-ping opacity-40"></div>
                                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-success-100 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-100 transition-colors">
                                    AI-Powered Interviews
                                </h3>
                                <p className="text-light-300 mb-6 leading-relaxed text-lg">
                                    Practice with advanced AI that adapts to your responses and provides 
                                    <span className="text-primary-300 font-medium"> realistic interview scenarios</span>.
                                </p>
                                
                                {/* Feature highlights */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-dark-100/30 rounded-xl border border-primary-500/10">
                                        <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                                        <span className="text-light-200 text-sm font-medium">Behavioral questions</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-dark-100/30 rounded-xl border border-primary-500/10">
                                        <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                                        <span className="text-light-200 text-sm font-medium">Technical assessments</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-dark-100/30 rounded-xl border border-primary-500/10">
                                        <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                                        <span className="text-light-200 text-sm font-medium">Role-specific scenarios</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Detailed Feedback */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-success-100 to-success-200 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                            
                            <div className="relative bg-gradient-to-br from-dark-200/80 to-dark-300/80 backdrop-blur-xl border border-success-100/20 rounded-3xl p-8 text-center hover:border-success-100/40 transition-all duration-500 h-full group-hover:transform group-hover:scale-[1.02]">
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl">📊</span>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-success-200 rounded-full animate-ping opacity-40"></div>
                                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-primary-400 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-success-100 transition-colors">
                                    Detailed Feedback
                                </h3>
                                <p className="text-light-300 mb-6 leading-relaxed text-lg">
                                    Get comprehensive analysis with 
                                    <span className="text-success-100 font-medium"> actionable insights</span> and 
                                    personalized improvement suggestions.
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-dark-100/30 rounded-xl border border-success-100/10">
                                        <div className="w-2 h-2 bg-success-100 rounded-full"></div>
                                        <span className="text-light-200 text-sm font-medium">Performance scoring</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-dark-100/30 rounded-xl border border-success-100/10">
                                        <div className="w-2 h-2 bg-success-100 rounded-full"></div>
                                        <span className="text-light-200 text-sm font-medium">Improvement areas</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-dark-100/30 rounded-xl border border-success-100/10">
                                        <div className="w-2 h-2 bg-success-100 rounded-full"></div>
                                        <span className="text-light-200 text-sm font-medium">Progress tracking</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - Company Prep */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                            
                            <div className="relative bg-gradient-to-br from-dark-200/80 to-dark-300/80 backdrop-blur-xl border border-purple-400/20 rounded-3xl p-8 text-center hover:border-purple-400/40 transition-all duration-500 h-full group-hover:transform group-hover:scale-[1.02]">
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl">🏢</span>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-40"></div>
                                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                                    Company-Specific Prep
                                </h3>
                                <p className="text-light-300 mb-6 leading-relaxed text-lg">
                                    Prepare for interviews at 
                                    <span className="text-purple-300 font-medium"> specific companies</span> with 
                                    tailored questions and culture insights.
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-dark-100/30 rounded-xl border border-purple-400/10">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span className="text-light-200 text-sm font-medium">Company research</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-dark-100/30 rounded-xl border border-purple-400/10">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span className="text-light-200 text-sm font-medium">Culture fit questions</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-dark-100/30 rounded-xl border border-purple-400/10">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span className="text-light-200 text-sm font-medium">Industry insights</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-success-100/10 rounded-3xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-dark-200/50 to-dark-300/50 backdrop-blur-xl border border-primary-400/20 rounded-3xl p-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div className="space-y-2">
                                    <div className="text-4xl font-bold text-primary-300">10K+</div>
                                    <div className="text-light-400 text-sm font-medium">Interviews Completed</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl font-bold text-success-100">95%</div>
                                    <div className="text-light-400 text-sm font-medium">Success Rate</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl font-bold text-purple-400">500+</div>
                                    <div className="text-light-400 text-sm font-medium">Companies</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl font-bold text-pink-400">24/7</div>
                                    <div className="text-light-400 text-sm font-medium">AI Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced How It Works Section */}
                <section id="how-it-works" className="mb-24">
                    <div className="text-center mb-20">
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 bg-success-100/10 text-success-100 rounded-full text-sm font-semibold border border-success-100/20 backdrop-blur-sm">
                                🚀 Simple Process
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                            <span className="text-white">How</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-success-100"> Prepify </span>
                            <span className="text-white">Works</span>
                        </h2>
                        <p className="text-xl text-light-300 max-w-3xl mx-auto leading-relaxed">
                            Get interview-ready in just 3 simple steps. Our streamlined process makes preparation effortless and effective.
                        </p>
                    </div>

                    <div className="relative max-w-6xl mx-auto">
                        {/* Background connecting line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 transform -translate-y-1/2">
                            <div className="w-full h-full bg-gradient-to-r from-primary-400 via-success-100 to-purple-400 rounded-full opacity-30"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                            {/* Step 1 */}
                            <div className="group relative text-center">
                                <div className="relative">
                                    {/* Glowing background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 w-28 h-28 mx-auto"></div>
                                    
                                    {/* Step number */}
                                    <div className="relative w-28 h-28 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-primary-300/30">
                                        <span className="text-3xl font-bold text-white">1</span>
                                        
                                        {/* Rotating border */}
                                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-300 animate-spin opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors">
                                        Choose Your Interview
                                    </h3>
                                    <p className="text-light-300 leading-relaxed text-lg max-w-sm mx-auto">
                                        Select from <span className="text-primary-300 font-medium">behavioral</span>, 
                                        <span className="text-success-100 font-medium"> technical</span>, or 
                                        <span className="text-purple-300 font-medium"> role-specific</span> interviews. 
                                        Choose your target company and position level.
                                    </p>
                                    
                                    {/* Feature tags */}
                                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                                        <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs font-medium border border-primary-500/30">
                                            Multiple Types
                                        </span>
                                        <span className="px-3 py-1 bg-success-100/20 text-success-100 rounded-full text-xs font-medium border border-success-100/30">
                                            Company Specific
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="group relative text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-success-100 to-success-200 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 w-28 h-28 mx-auto"></div>
                                    
                                    <div className="relative w-28 h-28 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-success-100/30">
                                        <span className="text-3xl font-bold text-white">2</span>
                                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-success-200 animate-spin opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-success-100 transition-colors">
                                        Practice with AI
                                    </h3>
                                    <p className="text-light-300 leading-relaxed text-lg max-w-sm mx-auto">
                                        Engage in <span className="text-success-100 font-medium">realistic mock interviews</span> 
                                        with our advanced AI. Answer questions naturally and receive 
                                        <span className="text-primary-300 font-medium"> real-time feedback</span>.
                                    </p>
                                    
                                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                                        <span className="px-3 py-1 bg-success-100/20 text-success-100 rounded-full text-xs font-medium border border-success-100/30">
                                            Real-time AI
                                        </span>
                                        <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs font-medium border border-primary-500/30">
                                            Natural Speech
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="group relative text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 w-28 h-28 mx-auto"></div>
                                    
                                    <div className="relative w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-purple-300/30">
                                        <span className="text-3xl font-bold text-white">3</span>
                                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-300 animate-spin opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                        Improve & Excel
                                    </h3>
                                    <p className="text-light-300 leading-relaxed text-lg max-w-sm mx-auto">
                                        Review <span className="text-purple-300 font-medium">detailed performance analytics</span>, 
                                        identify improvement areas, and 
                                        <span className="text-success-100 font-medium"> track your progress</span> over time.
                                    </p>
                                    
                                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                                        <span className="px-3 py-1 bg-purple-400/20 text-purple-300 rounded-full text-xs font-medium border border-purple-400/30">
                                            Analytics
                                        </span>
                                        <span className="px-3 py-1 bg-success-100/20 text-success-100 rounded-full text-xs font-medium border border-success-100/30">
                                            Progress Tracking
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Bottom CTA */}
                        <div className="text-center mt-16">
                            <div className="inline-block">
                                <Button asChild size="lg" className="group relative text-lg px-12 py-6 bg-gradient-to-r from-primary-400 to-success-100 hover:from-primary-500 hover:to-success-200 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/50 rounded-2xl font-semibold">
                                    <Link href="#pricing">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Start Your Journey
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                </Button>
                            </div>
                        </div>
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
                                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
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
                                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
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
