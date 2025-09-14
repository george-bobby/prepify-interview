import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Image from 'next/image';

export default async function Home() {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-100 via-dark-200 to-dark-300">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-success-100 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary-300 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
                </div>
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                }}></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Enhanced Hero Section */}
                <section id="hero" className="text-center py-24 mb-20">
                    {/* Floating Logo */}
                    <div className="mb-12 relative">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-dark-200/80 to-dark-300/80 backdrop-blur-sm border border-primary-400/30 rounded-2xl p-6">
                                <Image
                                    src="/logo-full.png"
                                    alt="Prepify Logo"
                                    width={220}
                                    height={66}
                                    className="mx-auto"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Title with Animation */}
                    <div className="mb-8">
                        <h1 className="text-6xl md:text-8xl font-extrabold leading-tight mb-6">
                            <span className="block text-white mb-2 animate-fadeIn">Ace Your Next</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-400 to-success-100 animate-glow">
                                Interview
                            </span>
                        </h1>
                        
                        {/* Subtitle with typewriter effect styling */}
                        <div className="relative inline-block">
                            <p className="text-xl md:text-2xl text-light-300 max-w-4xl mx-auto leading-relaxed font-light">
                                Master interview skills with AI-powered practice sessions, get 
                                <span className="text-primary-300 font-medium"> personalized feedback</span>, and 
                                <span className="text-success-100 font-medium"> land your dream job</span> with confidence.
                            </p>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary-400 to-success-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                        {user ? (
                            <>
                                <Button asChild size="lg" className="group relative text-lg px-12 py-6 bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/50 rounded-2xl font-semibold">
                                    <Link href="/dashboard">
                                        <span className="relative z-10">Go to Dashboard</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="text-lg px-12 py-6 border-2 border-primary-400/50 text-primary-300 hover:bg-primary-400/10 hover:border-primary-400 transition-all duration-300 backdrop-blur-sm rounded-2xl font-semibold">
                                    <Link href="/interviews">Start Interview</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild size="lg" className="group relative text-lg px-12 py-6 bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/50 rounded-2xl font-semibold">
                                    <Link href="/signup">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Get Started Free
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" className="text-lg px-12 py-6 border-2 border-primary-400/50 text-primary-300 hover:bg-primary-400/10 hover:border-primary-400 transition-all duration-300 backdrop-blur-sm rounded-2xl font-semibold" asChild>
                                    <Link href="#demo">
                                        <span className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
                    <div className="flex flex-wrap justify-center gap-8 text-sm mb-16">
                        <div className="flex items-center gap-3 px-4 py-2 bg-dark-200/50 backdrop-blur-sm rounded-full border border-success-100/30">
                            <div className="w-3 h-3 bg-success-100 rounded-full animate-pulse"></div>
                            <span className="text-light-300 font-medium">No credit card required</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-dark-200/50 backdrop-blur-sm rounded-full border border-primary-400/30">
                            <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse"></div>
                            <span className="text-light-300 font-medium">Free trial available</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-dark-200/50 backdrop-blur-sm rounded-full border border-yellow-400/30">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-light-300 font-medium">10,000+ interviews completed</span>
                        </div>
                    </div>

                    {/* Enhanced Demo Section */}
                    <div className="max-w-5xl mx-auto">
                        <div id="demo" className="relative group">
                            {/* Glowing border effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-primary-500 to-success-100 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                            
                            <div className="relative bg-gradient-to-br from-dark-200/90 to-dark-300/90 backdrop-blur-xl rounded-3xl border border-primary-400/20 p-8 shadow-2xl">
                                <div className="aspect-video bg-gradient-to-br from-dark-100/50 to-dark-200/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(99,102,241,0.1) 50%, transparent 70%)`,
                                            backgroundSize: '20px 20px',
                                            animation: 'slide 3s linear infinite'
                                        }}></div>
                                    </div>
                                    
                                    <div className="text-center relative z-10">
                                        <div className="relative mb-6">
                                            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                </svg>
                                            </div>
                                            {/* Ripple effect */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-24 h-24 border-2 border-primary-400 rounded-full animate-ping opacity-20"></div>
                                                <div className="absolute w-32 h-32 border border-primary-300 rounded-full animate-ping opacity-10 animation-delay-1000"></div>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-primary-100 mb-2">See Prepify in Action</h3>
                                        <p className="text-light-400 text-lg">Watch how AI transforms your interview preparation journey</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced Features Section */}
                <section id="features" className="mb-24">
                    <div className="text-center mb-20">
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 bg-primary-500/10 text-primary-300 rounded-full text-sm font-semibold border border-primary-500/20 backdrop-blur-sm">
                                ✨ Powerful Features
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                            <span className="text-white">Everything You Need to</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-success-100">
                                Succeed
                            </span>
                        </h2>
                        <p className="text-xl text-light-300 max-w-3xl mx-auto leading-relaxed">
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
                                        <Button asChild size="lg" className="group relative text-xl px-16 py-8 bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/50 rounded-2xl font-bold min-w-[280px]">
                                            <Link href={user ? "/dashboard" : "/signup"}>
                                                <span className="relative z-10 flex items-center gap-3">
                                                    {user ? "Go to Dashboard" : "Start Free Trial"}
                                                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
