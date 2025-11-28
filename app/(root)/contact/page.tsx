import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Contact — Prepify',
    description: 'Contact Prepify — get in touch for support, partnerships or feedback.',
};

export default function ContactPage() {
    return (
        <main className="max-w-3xl mx-auto py-20 px-6">
            <h1 className="text-4xl font-bold mb-6">Contact</h1>

            <p className="text-slate-300 mb-4">
                We&apos;d love to hear from you. Whether you have a question about features, partnerships,
                enterprise plans, or need help with your account, reach out and we&apos;ll respond as soon
                as possible.
            </p>

            <div className="mt-6 space-y-4 text-slate-300">
                <div>
                    <strong>Email:</strong> <a href="mailto:support@prepify.ai" className="underline">support@prepify.ai</a>
                </div>
                <div>
                    <strong>Sales:</strong> <a href="mailto:sales@prepify.ai" className="underline">sales@prepify.ai</a>
                </div>
                <div>
                    <strong>Twitter:</strong> <Link href="https://twitter.com/prepify" className="underline">@prepify</Link>
                </div>
            </div>

            <p className="mt-8 text-slate-300">
                For privacy details, visit our <Link href="/privacy" className="underline">Privacy Policy</Link>.
                By using Prepify you agree to our <Link href="/terms" className="underline">Terms of Service</Link>.
            </p>
        </main>
    );
}
