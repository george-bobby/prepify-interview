"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.svg" width={32} height={32} alt="Prepify" />
                            <span className="text-white font-semibold text-lg">Prepify</span>
                        </div>
                        <p className="text-light-400 text-sm leading-relaxed">
                            Master interviews with AI-powered practice, feedback, and expert guidance.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Product</h4>
                        <ul className="space-y-2 text-sm text-light-300">
                            <li><Link href="/interviews" className="hover:text-white transition-colors">Interviews</Link></li>
                            <li><Link href="/companies" className="hover:text-white transition-colors">Companies</Link></li>
                            <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Resources</h4>
                        <ul className="space-y-2 text-sm text-light-300">
                            <li><Link href="/feed" className="hover:text-white transition-colors">Feed</Link></li>
                            <li><Link href="/ideas" className="hover:text-white transition-colors">Ideas</Link></li>
                            <li><Link href="/insights" className="hover:text-white transition-colors">Insights</Link></li>
                            <li><Link href="/resume" className="hover:text-white transition-colors">Resume</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-light-300">
                            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                    <p className="text-xs text-light-400">© {new Date().getFullYear()} Prepify. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-sm text-light-300">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <span className="opacity-20">•</span>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <span className="opacity-20">•</span>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
