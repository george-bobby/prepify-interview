import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'About — Prepify',
    description: 'About Prepify — mission, values and what we build to help candidates ace interviews.',
};

export default function AboutPage() {
    return (
        <main className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold mb-6">About Prepify</h1>

            <p className="text-lg text-slate-300 mb-4">
                Prepify helps software engineers and technical candidates prepare for interviews with
                practical, hands-on practice and clear, actionable feedback. We combine AI-driven mock
                interviews, curated company question sets and guided learning roadmaps so you can
                confidently demonstrate your skills.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Our mission</h2>
            <p className="text-slate-300 mb-4">
                We believe everyone should have access to high-quality interview practice and
                feedback — regardless of background. Our tools are designed to make practicing
                efficient, measurable and motivating.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">What we build</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
                <li>AI-powered mock interviews with behavioral and technical rounds</li>
                <li>Coding practice with hints, editorials and timed sessions</li>
                <li>Resume analysis and role-specific roadmaps</li>
                <li>Community features to share learnings and get peer feedback</li>
            </ul>

            <p className="mt-8 text-slate-300">
                Questions or feedback? Reach out via the <Link href="/contact" className="underline">Contact</Link> page.
            </p>
        </main>
    );
}
