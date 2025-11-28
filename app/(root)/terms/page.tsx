import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Terms of Service — Prepify',
    description: 'Terms of Service for Prepify.',
};

export default function TermsPage() {
    return (
        <main className="max-w-4xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

            <p className="text-slate-300 mb-4">
                Last updated: November 24, 2025
            </p>

            <section className="text-slate-300 space-y-4">
                <h2 className="text-2xl font-semibold">1. Acceptance</h2>
                <p>
                    By using Prepify you agree to these Terms. If you don&apos;t agree, please do not use the service.
                </p>

                <h2 className="text-2xl font-semibold">2. Use of Service</h2>
                <p>
                    Prepify provides interview preparation tools. You must not misuse the service or attempt to interfere
                    with its operation.
                </p>

                <h2 className="text-2xl font-semibold">3. Content</h2>
                <p>
                    Prepify may provide content that is for educational purposes only. We do not guarantee any specific
                    outcome from using the service.
                </p>

                <h2 className="text-2xl font-semibold">4. Contact</h2>
                <p>
                    Questions about these terms? Reach out via <Link href="/contact" className="underline">Contact</Link>.
                </p>
            </section>
        </main>
    );
}
