import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Image from 'next/image';

export default async function Home() {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-100 via-dark-200 to-dark-300">
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <section id="hero" className="text-center py-20 mb-16">
                    <div className="mb-8">
                        <Image
                            src="/logo-full.png"
                            alt="Prepify Logo"
                            width={200}
                            height={60}
                            className="mx-auto mb-8"
                        />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-primary-100 mb-6 leading-tight">
                        Ace Your Next<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 via-success-100 to-primary-300">
                            Interview
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-light-400 mb-8 max-w-4xl mx-auto leading-relaxed">
                        Practice with AI-powered interviews, get personalized feedback,
                        and land your dream job with confidence. Join thousands of candidates
                        who've improved their interview skills.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                        {user ? (
                            <>
                                <Button asChild size="lg" className="text-lg px-10 py-5 bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-400 transform hover:scale-105 transition-all">
                                    <Link href="/dashboard">Go to Dashboard</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="text-lg px-10 py-5 border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all">
                                    <Link href="/interviews">Start Interview</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild size="lg" className="text-lg px-10 py-5 bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-400 transform hover:scale-105 transition-all">
                                    <Link href="/signup">Get Started Free</Link>
                                </Button>
                                <Button variant="outline" size="lg" className="text-lg px-10 py-5 border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all" asChild>
                                    <Link href="#demo">Watch Demo</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-sm text-light-400 mb-12">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                            No credit card required
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                            Free trial available
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                            10,000+ interviews completed
                        </span>
                    </div>

                    {/* Demo Video/Image Placeholder */}
                    <div className="max-w-4xl mx-auto">
                        <div id="demo" className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-2xl border border-dark-300 p-8 shadow-2xl">
                            <div className="aspect-video bg-dark-100 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                        </svg>
                                    </div>
                                    <p className="text-light-400">Watch how Prepify transforms your interview preparation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary-100 mb-4">
                            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">Succeed</span>
                        </h2>
                        <p className="text-xl text-light-400 max-w-3xl mx-auto">
                            Our comprehensive platform provides all the tools you need to excel in any interview scenario
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="group bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8 text-center hover:border-primary-200 transition-all hover:transform hover:scale-105 shadow-lg">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-200 to-primary-300 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-100 mb-4">AI-Powered Interviews</h3>
                            <p className="text-light-400 mb-6 leading-relaxed">
                                Practice with advanced AI that adapts to your responses and provides realistic interview scenarios.
                            </p>
                            <ul className="text-sm text-light-300 space-y-2">
                                <li>• Behavioral questions</li>
                                <li>• Technical assessments</li>
                                <li>• Role-specific scenarios</li>
                            </ul>
                        </div>

                        <div className="group bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8 text-center hover:border-primary-200 transition-all hover:transform hover:scale-105 shadow-lg">
                            <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-100 mb-4">Detailed Feedback</h3>
                            <p className="text-light-400 mb-6 leading-relaxed">
                                Get comprehensive analysis of your performance with actionable insights and improvement suggestions.
                            </p>
                            <ul className="text-sm text-light-300 space-y-2">
                                <li>• Performance scoring</li>
                                <li>• Improvement areas</li>
                                <li>• Progress tracking</li>
                            </ul>
                        </div>

                        <div className="group bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8 text-center hover:border-primary-200 transition-all hover:transform hover:scale-105 shadow-lg">
                            <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🏢</span>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-100 mb-4">Company-Specific Prep</h3>
                            <p className="text-light-400 mb-6 leading-relaxed">
                                Prepare for interviews at specific companies with tailored questions and company culture insights.
                            </p>
                            <ul className="text-sm text-light-300 space-y-2">
                                <li>• Company research</li>
                                <li>• Culture fit questions</li>
                                <li>• Industry insights</li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button asChild size="lg" className="text-lg px-8 py-4">
                            <Link href="#how-it-works">See How It Works</Link>
                        </Button>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary-100 mb-4">
                            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">Prepify</span> Works
                        </h2>
                        <p className="text-xl text-light-400 max-w-3xl mx-auto">
                            Our simple 3-step process gets you interview-ready in no time
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="text-center relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                                1
                            </div>
                            <h3 className="text-2xl font-bold text-primary-100 mb-4">Choose Your Interview</h3>
                            <p className="text-light-400 leading-relaxed">
                                Select from behavioral, technical, or role-specific interviews.
                                Choose your target company and position level.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                                2
                            </div>
                            <h3 className="text-2xl font-bold text-primary-100 mb-4">Practice with AI</h3>
                            <p className="text-light-400 leading-relaxed">
                                Engage in realistic mock interviews with our advanced AI.
                                Answer questions naturally and receive real-time feedback.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                                3
                            </div>
                            <h3 className="text-2xl font-bold text-primary-100 mb-4">Improve & Excel</h3>
                            <p className="text-light-400 leading-relaxed">
                                Review detailed performance analytics, identify improvement areas,
                                and track your progress over time.
                            </p>
                        </div>

                        {/* Connection Lines */}
                        <div className="hidden md:block absolute top-10 left-1/4 w-1/4 h-0.5 bg-gradient-to-r from-primary-200 to-success-100"></div>
                        <div className="hidden md:block absolute top-10 right-1/4 w-1/4 h-0.5 bg-gradient-to-r from-success-100 to-accent-100"></div>
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

                {/* Testimonials Section */}
                <section className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary-100 mb-4">
                            What Our Users <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">Say</span>
                        </h2>
                        <p className="text-xl text-light-400 max-w-3xl mx-auto">
                            Join thousands of successful candidates who've transformed their interview skills
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center text-white font-bold">
                                    S
                                </div>
                                <div>
                                    <h4 className="font-semibold text-primary-100">Sarah Chen</h4>
                                    <p className="text-light-400 text-sm">Software Engineer at Google</p>
                                </div>
                            </div>
                            <p className="text-light-300 leading-relaxed">
                                "Prepify helped me prepare for technical interviews at FAANG companies.
                                The AI feedback was incredibly detailed and helped me improve my problem-solving approach."
                            </p>
                            <div className="flex gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">⭐</span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center text-white font-bold">
                                    M
                                </div>
                                <div>
                                    <h4 className="font-semibold text-primary-100">Michael Rodriguez</h4>
                                    <p className="text-light-400 text-sm">Product Manager at Microsoft</p>
                                </div>
                            </div>
                            <p className="text-light-300 leading-relaxed">
                                "The company-specific preparation was a game-changer. I felt confident going into my Microsoft
                                interview knowing exactly what to expect. Landed the job!"
                            </p>
                            <div className="flex gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">⭐</span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <div>
                                    <h4 className="font-semibold text-primary-100">Aisha Patel</h4>
                                    <p className="text-light-400 text-sm">Data Scientist at Netflix</p>
                                </div>
                            </div>
                            <p className="text-light-300 leading-relaxed">
                                "As someone with interview anxiety, Prepify's safe practice environment was perfect.
                                I could practice as many times as I needed until I felt ready."
                            </p>
                            <div className="flex gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">⭐</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="text-center py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-3xl p-12 border border-dark-300 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-200 to-success-100"></div>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-bold text-primary-100 mb-6">
                                    Ready to Ace Your<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">Next Interview?</span>
                                </h2>
                                <p className="text-xl md:text-2xl text-light-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                                    Join thousands of successful candidates who've improved their interview skills with Prepify.
                                    Start your journey today - completely free.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                                    <Button asChild size="lg" className="text-lg px-10 py-5 bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-400 transform hover:scale-105 transition-all shadow-2xl">
                                        <Link href={user ? "/dashboard" : "/signup"}>
                                            {user ? "Go to Dashboard" : "Start Free Trial"}
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" className="text-lg px-10 py-5 border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all" asChild>
                                        <Link href="/interviews">Browse Interview Types</Link>
                                    </Button>
                                </div>

                                <div className="flex flex-wrap justify-center gap-8 text-sm text-light-400">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                                        Free forever plan
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                                        No credit card required
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                                        Cancel anytime
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
