import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy — Prepify',
    description: 'Privacy Policy for Prepify explaining data collection and usage.',
};

export default function PrivacyPage() {
    return (
        <main className="max-w-3xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

            <p className="text-slate-300 mb-4">Last updated: November 24, 2025</p>

            <section className="text-slate-300 space-y-4">
                <h2 className="text-2xl font-semibold">Information we collect</h2>
                <p>
                    We collect information you provide (account details, profile information) and usage data
                    (interactions with the site and features). We may also store interview transcripts and
                    feedback generated while you use the platform.
                </p>

                <h2 className="text-2xl font-semibold">How we use data</h2>
                <p>
                    Data is used to provide and improve the service, personalize your experience, and for security
                    and analytics. We do not sell personal data to third parties.
                </p>

                <h2 className="text-2xl font-semibold">Security</h2>
                <p>
                    We use reasonable administrative and technical safeguards to protect data. No method of
                    transmission or storage is 100% secure; use caution when sharing sensitive information.
                </p>

                <h2 className="text-2xl font-semibold">Contact</h2>
                <p>
                    If you have questions about privacy, contact us at <a href="mailto:privacy@prepify.ai" className="underline">privacy@prepify.ai</a>
                    or use the <Link href="/contact" className="underline">Contact</Link> page.
                </p>
            </section>
        </main>
    );
}
