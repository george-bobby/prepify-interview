import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function Home() {
  const user = await getCurrentUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

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
            <Button asChild size="lg" className="text-lg px-10 py-5 bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-400 transform hover:scale-105 transition-all">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-10 py-5 border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all" asChild>
              <Link href="#demo">Watch Demo</Link>
            </Button>
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
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
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
              <h3 className="text-2xl font-bold text-primary-100 mb-4">AI Interviewer</h3>
              <p className="text-light-400 leading-relaxed">
                Practice with our advanced AI that conducts realistic interviews
                tailored to your target role and experience level.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8 text-center hover:border-primary-200 transition-all hover:transform hover:scale-105 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-100 mb-4">Detailed Feedback</h3>
              <p className="text-light-400 leading-relaxed">
                Get comprehensive analysis of your performance with actionable
                insights to improve your interview skills.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8 text-center hover:border-primary-200 transition-all hover:transform hover:scale-105 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-100 mb-4">Multiple Interview Types</h3>
              <p className="text-light-400 leading-relaxed">
                Technical, behavioral, case studies, and product management
                interviews - all in one platform.
              </p>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-200/50 border border-dark-300 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold text-primary-100 mb-2">Instant Setup</h4>
              <p className="text-sm text-light-400">Start practicing immediately with no configuration required</p>
            </div>
            <div className="bg-dark-200/50 border border-dark-300 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">💼</div>
              <h4 className="font-semibold text-primary-100 mb-2">Company-Specific</h4>
              <p className="text-sm text-light-400">Practice with questions from 500+ top companies</p>
            </div>
            <div className="bg-dark-200/50 border border-dark-300 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold text-primary-100 mb-2">Real-time Analysis</h4>
              <p className="text-sm text-light-400">Get instant feedback as you practice</p>
            </div>
            <div className="bg-dark-200/50 border border-dark-300 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold text-primary-100 mb-2">Mobile Ready</h4>
              <p className="text-sm text-light-400">Practice anywhere, anytime on any device</p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-primary-200/10 via-success-100/10 to-primary-300/10 border border-primary-200/20 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-primary-100 text-center mb-8">
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">Thousands</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <h3 className="text-4xl md:text-5xl font-bold text-primary-100 mb-2 group-hover:scale-110 transition-transform">10,000+</h3>
                <p className="text-light-400 font-medium">Interviews Completed</p>
              </div>
              <div className="group">
                <h3 className="text-4xl md:text-5xl font-bold text-success-100 mb-2 group-hover:scale-110 transition-transform">85%</h3>
                <p className="text-light-400 font-medium">Success Rate</p>
              </div>
              <div className="group">
                <h3 className="text-4xl md:text-5xl font-bold text-primary-200 mb-2 group-hover:scale-110 transition-transform">500+</h3>
                <p className="text-light-400 font-medium">Companies Covered</p>
              </div>
              <div className="group">
                <h3 className="text-4xl md:text-5xl font-bold text-primary-100 mb-2 group-hover:scale-110 transition-transform">4.8★</h3>
                <p className="text-light-400 font-medium">User Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-100 mb-4">
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-light-400 max-w-3xl mx-auto">
              Choose a plan that fits your preparation style. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Free Plan */}
            <div className="bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8 relative group hover:border-primary-200/50 transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-primary-100 mb-2">Free</h3>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-light-400 mb-1">/month</span>
                </div>
                <p className="text-light-400 text-sm mt-2">Perfect to get started</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">10 interview credits per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">10 AI resume reviews per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">Basic analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">Community support</span>
                </li>
              </ul>

              <Button asChild className="w-full bg-dark-100 border border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="bg-gradient-to-br from-primary-200/10 to-primary-300/10 border-2 border-primary-200 rounded-2xl p-8 relative group transform scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary-200 to-primary-300 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-primary-100 mb-2">Pro</h3>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-white">$19</span>
                  <span className="text-light-400 mb-1">/month</span>
                </div>
                <p className="text-light-400 text-sm mt-2">For serious job seekers</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">100 interview credits per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">100 AI resume reviews per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">10 professional resume reviews</span>
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
                  <span className="text-light-300">Company-specific prep</span>
                </li>
              </ul>

              <Button asChild className="w-full bg-gradient-to-r from-primary-200 to-primary-300 text-white hover:from-primary-300 hover:to-primary-400 transform hover:scale-105 transition-all">
                <Link href="/signup">Upgrade to Pro</Link>
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gradient-to-br from-dark-200 to-dark-300 border border-dark-300 rounded-2xl p-8 relative group hover:border-primary-200/50 transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-primary-100 mb-2">Enterprise</h3>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">Contact us</span>
                </div>
                <p className="text-light-400 text-sm mt-2">For teams and organizations</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">Custom interview credits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">Custom AI & professional reviews</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">SSO, security reviews, SLAs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">Admin console & team management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success-100 text-lg">✓</span>
                  <span className="text-light-300">Dedicated success manager</span>
                </li>
              </ul>

              <Button asChild className="w-full bg-dark-100 border border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-dark-200/50 to-dark-300/50 border border-dark-300 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-primary-100 mb-4">Frequently Asked Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-primary-100 mb-2">What are interview credits?</h4>
                  <p className="text-light-400 text-sm">Credits are used for AI interview sessions. Each practice session consumes one credit.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-100 mb-2">Can I cancel anytime?</h4>
                  <p className="text-light-400 text-sm">Yes! Cancel your subscription at any time. No long-term commitments required.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-100 mb-2">Do credits roll over?</h4>
                  <p className="text-light-400 text-sm">Unused credits expire at the end of each billing cycle to ensure fair usage.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-100 mb-2">Need a custom plan?</h4>
                  <p className="text-light-400 text-sm">Contact our sales team to discuss enterprise solutions and volume discounts.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-100 mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">Works</span>
            </h2>
            <p className="text-xl text-light-400 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-success-100 to-primary-300 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary-200/20 to-primary-300/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-2xl font-bold text-primary-100 mb-4">Choose Interview Type</h3>
                <p className="text-light-400 leading-relaxed">
                  Select from technical, behavioral, case study, or product management interviews
                  tailored to your target role and company.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-success-100/20 to-success-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-2xl font-bold text-primary-100 mb-4">Practice with AI</h3>
                <p className="text-light-400 leading-relaxed">
                  Engage in realistic voice conversations with our AI interviewer
                  that adapts to your responses and experience level.
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-2xl font-bold text-primary-100 mb-4">Get Feedback</h3>
                <p className="text-light-400 leading-relaxed">
                  Receive detailed analysis and personalized recommendations for improvement
                  with actionable insights to boost your performance.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Steps */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-dark-200/50 to-dark-300/50 border border-dark-300 rounded-xl p-6 flex items-center gap-4 hover:border-primary-200/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-primary-300 rounded-lg flex items-center justify-center text-xl">
                  📈
                </div>
                <div>
                  <h4 className="font-semibold text-primary-100 mb-1">Track Progress</h4>
                  <p className="text-light-400 text-sm">Monitor your improvement over time with detailed analytics</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-dark-200/50 to-dark-300/50 border border-dark-300 rounded-xl p-6 flex items-center gap-4 hover:border-primary-200/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-lg flex items-center justify-center text-xl">
                  🎯
                </div>
                <div>
                  <h4 className="font-semibold text-primary-100 mb-1">Land Your Job</h4>
                  <p className="text-light-400 text-sm">Apply your improved skills to real interviews with confidence</p>
                </div>
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
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-10 py-5 border-primary-200 text-primary-200 hover:bg-primary-200 hover:text-white transition-all" asChild>
                    <Link href="/interviews">Browse Interview Types</Link>
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-light-400">
                  <span className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                    No setup required
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                    Instant feedback
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                    Practice anytime
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-success-100 rounded-full"></span>
                    Expert-designed questions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-dark-300 pt-12 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="Prepify" width={32} height={32} />
                <span className="text-primary-100 font-bold text-xl">Prepify</span>
              </div>
              <p className="text-light-400 text-sm leading-relaxed">
                Ace your next interview with AI-powered practice sessions and personalized feedback.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-primary-100 mb-4">Product</h4>
              <div className="space-y-3 text-sm">
                <Link href="#features" className="block text-light-400 hover:text-primary-200 transition-colors">Features</Link>
                <Link href="#pricing" className="block text-light-400 hover:text-primary-200 transition-colors">Pricing</Link>
                <Link href="/interviews" className="block text-light-400 hover:text-primary-200 transition-colors">Interview Types</Link>
                <Link href="/dashboard" className="block text-light-400 hover:text-primary-200 transition-colors">Dashboard</Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-primary-100 mb-4">Resources</h4>
              <div className="space-y-3 text-sm">
                <Link href="/courses" className="block text-light-400 hover:text-primary-200 transition-colors">Courses</Link>
                <Link href="/roadmaps" className="block text-light-400 hover:text-primary-200 transition-colors">Roadmaps</Link>
                <Link href="/companies" className="block text-light-400 hover:text-primary-200 transition-colors">Companies</Link>
                <Link href="/insights" className="block text-light-400 hover:text-primary-200 transition-colors">Insights</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-primary-100 mb-4">Company</h4>
              <div className="space-y-3 text-sm">
                <Link href="/about" className="block text-light-400 hover:text-primary-200 transition-colors">About</Link>
                <Link href="/contact" className="block text-light-400 hover:text-primary-200 transition-colors">Contact</Link>
                <Link href="/privacy" className="block text-light-400 hover:text-primary-200 transition-colors">Privacy</Link>
                <Link href="/terms" className="block text-light-400 hover:text-primary-200 transition-colors">Terms</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-dark-300 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-light-400 text-sm">
                © 2025 Prepify. All rights reserved. Built to help you land your dream job.
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-light-400">
                  <span className="text-xs">Follow us:</span>
                  <div className="flex gap-3">
                    <a href="#" className="w-8 h-8 bg-dark-200 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
                      <span className="text-xs">𝕏</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-dark-200 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
                      <span className="text-xs">in</span>
                    </a>
                    <a href="#" className="w-8 h-8 bg-dark-200 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
                      <span className="text-xs">@</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
