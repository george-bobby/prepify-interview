import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const InterviewsPage = async () => {
    const user = await getCurrentUser();

    // Redirect to signin if not authenticated
    if (!user) {
        redirect('/signin');
    }

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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-100">AI Interview Practice</h1>
                    <p className="text-light-400">Choose your interview type and start practicing with our AI interviewer</p>
                </div>
                <div className="flex items-center gap-2 text-light-400">
                    <span>Credits: </span>
                    <span className="text-success-100 font-semibold">{user?.credits || 0}</span>
                </div>
            </div>

            {/* Quick Start Section */}
            <div className="bg-gradient-to-r from-dark-200 to-dark-300 rounded-lg p-6 border border-dark-300">
                <h2 className="text-xl font-bold text-primary-100 mb-3">Quick Start</h2>
                <p className="text-light-400 mb-4">Jump right into a general technical interview or customize your experience below.</p>
                <Button asChild>
                    <Link href="/interview">Start General Interview</Link>
                </Button>
            </div>

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
        </div>
    );
};

export default InterviewsPage;
