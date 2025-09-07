import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InterviewCard } from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";
import ClientContent from "@/components/ClientContent";
import { redirect } from 'next/navigation';

const InterviewsPage = async () => {
    const user: any = await getCurrentUser();

    // Redirect to signin if not authenticated
    if (!user) {
        redirect('/signin');
    }

    const userInterviews: any = user?.id ? await getInterviewsByUserId(user.id) : [];
    const latestInterviews: any = user?.id ? await getLatestInterviews({ userId: user.id }) : [];

    const hasPastInterviews = userInterviews.length > 0;
    const hasUpcomingInterviews = latestInterviews?.length > 0;

    const interviewTypes = [
        {
            type: "Technical",
            title: "Technical Interview",
            description: "Practice coding problems, algorithms, and system design questions.",
            icon: "💻",
            difficulty: "All Levels",
            duration: "45-60 min",
            color: "from-blue-500/20 to-blue-600/20 border-blue-500/30"
        },
        {
            type: "Behavioral",
            title: "Behavioral Interview",
            description: "Master storytelling and showcase your soft skills and experiences.",
            icon: "🗣️",
            difficulty: "All Levels",
            duration: "30-45 min",
            color: "from-green-500/20 to-green-600/20 border-green-500/30"
        },
        {
            type: "Case Study",
            title: "Case Study Interview",
            description: "Solve business problems and demonstrate analytical thinking.",
            icon: "📈",
            difficulty: "Intermediate+",
            duration: "60-90 min",
            color: "from-purple-500/20 to-purple-600/20 border-purple-500/30"
        },
        {
            type: "Product",
            title: "Product Management",
            description: "Design products, analyze metrics, and showcase PM skills.",
            icon: "🎯",
            difficulty: "Advanced",
            duration: "45-60 min",
            color: "from-orange-500/20 to-orange-600/20 border-orange-500/30"
        }
    ];

    const recentInterviews = [
        // This would come from your database
        // For now, showing placeholder data
    ];

    return (
        <main className="flex flex-col gap-10 relative">
            {/* Hero Section */}
            <section className="card-cta flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                    <p className="text-lg">
                        Practice on real interview questions & get instant feedback
                    </p>

                    {user?.credits > 0 ? (
                        <div>
                            <Button asChild className="btn-primary w-full sm:w-auto m-1">
                                <Link href="/interview">Start an Interview</Link>
                            </Button>
                            <Button className="btn-primary w-full sm:w-auto m-1">
                                Credits: {user?.credits}
                            </Button>
                        </div>
                    ) : (
                        <ClientContent user={user} />
                    )}
                </div>

                <Image
                    src="/robot.png"
                    alt="robot"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section>

            {/* User Interviews Section */}
            <section className="flex flex-col gap-6">
                <h2>Your Interviews</h2>
                <div className="interviews-section">
                    {hasPastInterviews ? (
                        userInterviews.map((interview: any) => (
                            <InterviewCard {...interview} key={interview.id} />
                        ))
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
                    )}
                </div>
            </section>

            {/* Latest Interviews Section */}
            <section className="flex flex-col gap-6">
                <h2>Take an Interview</h2>
                <div className="interviews-section">
                    {hasUpcomingInterviews ? (
                        latestInterviews.map((interview: any) => (
                            <InterviewCard {...interview} key={interview.id} />
                        ))
                    ) : (
                        <p>There are no new interviews available</p>
                    )}
                </div>
            </section>

            {/* Interview Types */}
            <div>
                <h2 className="text-2xl font-bold text-primary-100 mb-6">Choose Interview Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interviewTypes.map((interview) => (
                        <div
                            key={interview.type}
                            className={`bg-gradient-to-br ${interview.color} rounded-lg p-6 border hover:scale-105 transition-all duration-200 group`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-3xl">{interview.icon}</div>
                                <span className="bg-primary-100/10 text-primary-100 px-2 py-1 rounded text-xs">
                                    {interview.difficulty}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-primary-100 group-hover:text-primary-200 transition-colors">
                                    {interview.title}
                                </h3>

                                <p className="text-light-100 text-sm leading-relaxed">
                                    {interview.description}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-light-100">
                                    <span>⏱️ {interview.duration}</span>
                                </div>

                                <Button
                                    className="w-full mt-4"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href={`/interview?type=${interview.type.toLowerCase()}`}>
                                        Start {interview.title}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Interviews */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-primary-100">Recent Interviews</h2>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/interview/history">View All</Link>
                    </Button>
                </div>

                {recentInterviews.length === 0 ? (
                    <div className="bg-dark-200 border border-dark-300 rounded-lg p-8 text-center">
                        <div className="text-4xl mb-4">🎤</div>
                        <h3 className="text-primary-100 font-semibold mb-2">No interviews yet</h3>
                        <p className="text-light-400 mb-4">Start your first AI interview to begin tracking your progress</p>
                        <Button asChild>
                            <Link href="/interview">Start Your First Interview</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* This would map over actual interview history */}
                    </div>
                )}
            </div>

            {/* Tips Section */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-primary-100 font-semibold mb-4">💡 Interview Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="text-primary-200 font-medium mb-2">Before You Start</h4>
                        <ul className="text-light-400 space-y-1">
                            <li>• Ensure you have a quiet environment</li>
                            <li>• Test your microphone and camera</li>
                            <li>• Have a notepad ready for problem-solving</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-primary-200 font-medium mb-2">During the Interview</h4>
                        <ul className="text-light-400 space-y-1">
                            <li>• Think out loud to show your reasoning</li>
                            <li>• Ask clarifying questions when needed</li>
                            <li>• Take your time to understand the problem</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default InterviewsPage;