import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Image from 'next/image';

export default async function Home() {
    const user = await getCurrentUser();

    const features = [
        {
            icon: '🤖',
            title: 'AI Interviews',
            color: 'blue',
            description: 'Adaptive mock interviews covering behavioral & technical domains.',
            points: ['Adaptive difficulty', 'Behavioral & technical rounds', 'Real-time voice / text']
        },
        {
            icon: '🧠',
            title: 'Detailed Feedback',
            color: 'emerald',
            description: 'Deep performance analytics: soft skills, structure, clarity & pacing.',
            points: ['NLP scoring engine', 'Improvement suggestions', 'Progress trends']
        },
        {
            icon: '⌨️',
            title: 'Coding Practice',
            color: 'purple',
            description: 'LeetCode‑style workspace with hints, editorials & timed sessions.',
            points: ['Timed challenges', 'Hints & editorials', 'Topic mastery stats']
        },
        {
            icon: '🏢',
            title: 'Company Insights',
            color: 'yellow',
            description: 'Curated question sets, culture insights & role‑specific expectations.',
            points: ['Real questions history', 'Culture & values', 'Role leveling guides']
        },
        {
            icon: '🗺️',
            title: 'Role Roadmaps',
            color: 'red',
            description: 'Structured skill progression paths to move from novice to expert.',
            points: ['Milestone tracking', 'Prerequisite mapping', 'Learning resources']
        },
        {
            icon: '💬',
            title: 'Social Feed',
            color: 'blue',
            description: 'Share wins, discuss strategies & learn from peers in real time.',
            points: ['Post progress', 'Comment & react', 'Peer encouragement']
        },
        {
            icon: '📂',
            title: 'Projects & Research',
            color: 'emerald',
            description: 'Practice projects & summarized research papers to sharpen depth.',
            points: ['Project templates', 'Research digests', 'Practical applications']
        },
        {
            icon: '📰',
            title: 'Tech News',
            color: 'purple',
            description: 'Daily curated technology & industry updates to stay interview‑ready.',
            points: ['Trending stacks', 'Industry shifts', 'Key announcements']
        },
        {
            icon: '🔍',
            title: 'AI Job Search',
            color: 'yellow',
            description: 'Smart matching, alerts & relevance ranking for roles you’ll love.',
            points: ['Personalized matches', 'Auto alerts', 'Skill–role alignment']
        },
        {
            icon: '📄',
            title: 'AI Resume Analysis',
            color: 'orange',
            description: 'ATS optimization & skill gap detection with targeted improvement tips.',
            points: ['ATS scoring', 'Gap analysis', 'Keyword recommendations']
        },
        {
            icon: '📊',
            title: 'Unified Dashboard',
            color: 'blue',
            description: 'All progress in one place: interviews, coding, roadmap & goals.',
            points: ['Central progress view', 'Upcoming events', 'Goal tracking']
        }
        , {
            icon: '🔔',
            title: 'Real-time Notifications',
            color: 'yellow',
            description: 'Instant alerts for interview events, feedback releases & community activity.',
            points: ['Interview status updates', 'Feedback ready alerts', 'Community & mention pings']
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="relative z-10">

                {/* Hero Section */}
                <section className="pt-8 pb-8 md:pt-20 md:pb-16 px-4 md:px-6">
                    <div className="max-w-6xl mx-auto relative">

                        {/* Main CTA container */}
                        <div className="relative">
                            {/* Glowing border effect */}
                            {/* <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-success-100 to-purple-400 rounded-3xl blur opacity-30"></div> */}

                            <div className="relative bg-gradient-to-br from-dark-200/90 to-dark-300/90 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-primary-400/20 p-6 md:p-14 text-center overflow-hidden">
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                                        backgroundSize: '40px 40px'
                                    }}></div>
                                </div>

                                <div className="relative z-10 space-y-6 md:space-y-8">
                                    {/* Badge */}
                                    <div className="inline-block">
                                        <span className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-primary-400/20 to-success-100/20 text-primary-200 rounded-full text-xs md:text-sm font-semibold border border-primary-400/30 backdrop-blur-sm">
                                            🚀 Ready to Transform Your Career?
                                        </span>
                                    </div>

                                    {/* Main headline */}
                                    <div>
                                        <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold leading-tight mb-4 md:mb-6">
                                            <span className="text-white">Ace Your Next</span><br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300 animate-glow">
                                                Interview
                                            </span>
                                        </h2>

                                        <p className="text-base sm:text-lg md:text-2xl text-light-200 max-w-4xl mx-auto leading-relaxed font-light px-2">
                                            Master interview skills with AI-powered practice, personalized feedback, and expert guidance – <span className="text-success-100 font-semibold"> completely free</span>.
                                        </p>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center items-stretch sm:items-center pt-2 w-full sm:w-auto">
                                        <Button asChild size="lg" className="group relative text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-white transition-colors duration-200 rounded-xl font-semibold w-full sm:w-auto sm:min-w-[200px] md:min-w-[240px] border border-emerald-500/40">
                                            <Link href={user ? "/dashboard" : "/signup"}>
                                                <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                    </svg>
                                                    {user ? "Go to Dashboard" : "Start Free Trial"}
                                                    <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="lg" className="group text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-4 md:py-6 border border-primary-400/50 text-primary-200 hover:bg-primary-400/10 transition-colors duration-200 rounded-xl font-semibold w-full sm:w-auto sm:min-w-[200px] md:min-w-[240px]" asChild>
                                            <Link href="/interviews">
                                                <span className="flex items-center justify-center gap-2 md:gap-3">
                                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                    </svg>
                                                    Browse Interview Types
                                                </span>
                                            </Link>
                                        </Button>
                                    </div>

                                    {/* Trust indicators */}
                                    <div className="pt-4 md:pt-6">
                                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 text-xs sm:text-sm">
                                            <div className="flex items-center gap-2 md:gap-3 px-3 sm:px-4 md:px-6 py-2 md:py-3 bg-dark-100/30 backdrop-blur-sm rounded-full border border-success-100/20">
                                                <div className="w-2 h-2 md:w-3 md:h-3 bg-success-100 rounded-full animate-pulse flex-shrink-0"></div>
                                                <span className="text-light-200 font-medium whitespace-nowrap">Free forever plan</span>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3 px-3 sm:px-4 md:px-6 py-2 md:py-3 bg-dark-100/30 backdrop-blur-sm rounded-full border border-primary-400/20">
                                                <div className="w-2 h-2 md:w-3 md:h-3 bg-primary-400 rounded-full animate-pulse flex-shrink-0"></div>
                                                <span className="text-light-200 font-medium whitespace-nowrap">No credit card required</span>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3 px-3 sm:px-4 md:px-6 py-2 md:py-3 bg-dark-100/30 backdrop-blur-sm rounded-full border border-yellow-400/20">
                                                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full animate-pulse flex-shrink-0"></div>
                                                <span className="text-light-200 font-medium whitespace-nowrap">Cancel anytime</span>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 md:px-6 py-8 md:py-16">
                    <div className="text-center mb-8 md:mb-16">
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 bg-blue-500/10 text-blue-300 rounded-full text-sm font-semibold border border-blue-500/20 backdrop-blur-sm">
                                ✨ Complete Platform
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-8 mb-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Static color map to avoid purged dynamic classes */}
                        {features.map((f) => (
                            <div key={f.title} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 flex flex-col hover:border-white/20 transition-all duration-400">
                                <div className="mb-5">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto text-2xl bg-white/10 group-hover:scale-105 transition-transform">
                                        {f.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3 text-center">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-5 text-center">{f.description}</p>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    {f.points.map(p => {
                                        const colorMap: Record<string, string> = {
                                            blue: 'bg-blue-400',
                                            emerald: 'bg-emerald-400',
                                            purple: 'bg-purple-400',
                                            yellow: 'bg-yellow-400',
                                            orange: 'bg-orange-400'
                                        };
                                        return (
                                            <li key={p} className="flex items-start gap-2">
                                                <span className={`mt-1 inline-block h-2 w-2 rounded-full ${colorMap[f.color] || 'bg-slate-400'}`}></span>
                                                <span>{p}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                            <div className="space-y-1 md:space-y-2">
                                <div className="text-2xl md:text-3xl font-bold text-blue-400">10K+</div>
                                <div className="text-slate-400 text-xs md:text-sm font-medium">Interviews Completed</div>
                            </div>
                            <div className="space-y-1 md:space-y-2">
                                <div className="text-2xl md:text-3xl font-bold text-emerald-400">95%</div>
                                <div className="text-slate-400 text-xs md:text-sm font-medium">Success Rate</div>
                            </div>
                            <div className="space-y-1 md:space-y-2">
                                <div className="text-2xl md:text-3xl font-bold text-purple-400">500+</div>
                                <div className="text-slate-400 text-xs md:text-sm font-medium">Companies</div>
                            </div>
                            <div className="space-y-1 md:space-y-2">
                                <div className="text-2xl md:text-3xl font-bold text-orange-400">24/7</div>
                                <div className="text-slate-400 text-xs md:text-sm font-medium">AI Support</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="mb-8 md:mb-12 px-4 md:px-6">
                    <div className="text-center mb-8 md:mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-primary-100 mb-4">
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">Plan</span>
                        </h2>
                        <p className="text-base md:text-xl text-light-400 max-w-3xl mx-auto px-4">
                            Start free and upgrade when you're ready. No hidden fees, cancel anytime.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-6 md:p-8 relative group hover:border-primary-200/50 transition-all">
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

                            <Button asChild className="w-full bg-dark-100 border border-green-200 text-green-200 hover:bg-green-200 hover:text-white transition-all">
                                <Link href={user ? "/dashboard" : "/signup"}>
                                    {user ? "Go to Dashboard" : "Get Started"}
                                </Link>
                            </Button>
                        </div>

                        {/* Pro Plan - Most Popular */}
                        <div className="bg-gradient-to-br from-primary-200/10 to-primary-300/10 border-2 border-primary-200 rounded-2xl p-6 md:p-8 relative group md:transform md:scale-105 shadow-2xl">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
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

                            <Button asChild className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-300 hover:to-green-400 transform hover:scale-105 transition-all">
                                <Link href={user ? "/dashboard" : "/signup"}>
                                    {user ? "Go to Dashboard" : "Upgrade to Pro"}
                                </Link>
                            </Button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-6 md:p-8 relative group hover:border-primary-200/50 transition-all">
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

                            <Button asChild className="w-full bg-dark-100 border border-green-200 text-green-200 hover:bg-green-200 hover:text-white transition-all">
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

                {/* How It Works Section */}
                <section className="container mx-auto px-4 md:px-6 py-8 md:py-16">
                    <div className="text-center mb-8 md:mb-16">
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/20 backdrop-blur-sm">
                                🚀 Simple Process
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 md:mb-6">
                            <span className="text-white">How</span>
                            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"> Prepify </span>
                            <span className="text-white">Works</span>
                        </h2>
                        <p className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed px-4">
                            Get interview-ready in just 3 simple steps. Our streamlined process makes preparation effortless and effective.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-16">
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
                        <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <Link href={user ? "/dashboard" : "/signup"} className="flex items-center gap-2">
                                Start Your Journey
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
