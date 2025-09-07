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
        <section className="text-center py-20 mb-16">
          <div className="mb-8">
            <Image
              src="/logo-full.png"
              alt="Prepify Logo"
              width={200}
              height={60}
              className="mx-auto mb-8"
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-primary-100 mb-6 leading-tight">
            Ace Your Next<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-success-100">
              Interview
            </span>
          </h1>

          <p className="text-xl text-light-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Practice with AI-powered interviews, get personalized feedback,
            and land your dream job with confidence. Join thousands of candidates
            who've improved their interview skills.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>

          <p className="text-light-400 text-sm mt-4">
            No credit card required • Free trial available
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary-100 text-center mb-12">
            Everything You Need to Succeed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-8 text-center hover:border-primary-200 transition-colors">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-primary-100 mb-4">AI Interviewer</h3>
              <p className="text-light-400 leading-relaxed">
                Practice with our advanced AI that conducts realistic interviews
                tailored to your target role and experience level.
              </p>
            </div>

            <div className="bg-dark-200 border border-dark-300 rounded-lg p-8 text-center hover:border-primary-200 transition-colors">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-primary-100 mb-4">Detailed Feedback</h3>
              <p className="text-light-400 leading-relaxed">
                Get comprehensive analysis of your performance with actionable
                insights to improve your interview skills.
              </p>
            </div>

            <div className="bg-dark-200 border border-dark-300 rounded-lg p-8 text-center hover:border-primary-200 transition-colors">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-primary-100 mb-4">Multiple Interview Types</h3>
              <p className="text-light-400 leading-relaxed">
                Technical, behavioral, case studies, and product management
                interviews - all in one platform.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary-200/10 to-success-100/10 border border-primary-200/20 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-primary-100 text-center mb-8">
              Trusted by Thousands
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <h3 className="text-3xl font-bold text-primary-100 mb-2">10,000+</h3>
                <p className="text-light-400">Interviews Completed</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-success-100 mb-2">85%</h3>
                <p className="text-light-400">Success Rate</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary-200 mb-2">500+</h3>
                <p className="text-light-400">Companies Covered</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary-100 mb-2">4.8★</h3>
                <p className="text-light-400">User Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-primary-100 text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-primary-100 mb-3">Choose Interview Type</h3>
              <p className="text-light-400">
                Select from technical, behavioral, case study, or product management interviews
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-primary-100 mb-3">Practice with AI</h3>
              <p className="text-light-400">
                Engage in realistic voice conversations with our AI interviewer
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-primary-100 mb-3">Get Feedback</h3>
              <p className="text-light-400">
                Receive detailed analysis and personalized recommendations for improvement
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16">
          <div className="bg-gradient-to-r from-dark-200 to-dark-300 rounded-lg p-12 border border-dark-300">
            <h2 className="text-4xl font-bold text-primary-100 mb-4">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-xl text-light-400 mb-8 max-w-2xl mx-auto">
              Join thousands of successful candidates who've improved their interview skills with Prepify.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-4">
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/interviews">Browse Interview Types</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-light-400 text-sm">
              <span>✓ No setup required</span>
              <span>✓ Instant feedback</span>
              <span>✓ Practice anytime</span>
              <span>✓ Expert-designed questions</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-dark-300 pt-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image src="/logo.png" alt="Prepify" width={32} height={32} />
              <span className="text-primary-100 font-bold text-lg">Prepify</span>
            </div>

            <div className="flex flex-wrap gap-6 text-light-400">
              <Link href="/about" className="hover:text-primary-200 transition-colors">About</Link>
              <Link href="/pricing" className="hover:text-primary-200 transition-colors">Pricing</Link>
              <Link href="/contact" className="hover:text-primary-200 transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-primary-200 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primary-200 transition-colors">Terms</Link>
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-dark-300">
            <p className="text-light-400 text-sm">
              © 2025 Prepify. All rights reserved. Built to help you land your dream job.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
