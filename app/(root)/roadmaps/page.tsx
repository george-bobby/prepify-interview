"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const RoadmapsPage = () => {
    const [activeTab, setActiveTab] = useState<'role' | 'skill'>('role');
    const [searchTerm, setSearchTerm] = useState('');

    // Role-based Roadmaps from roadmap.sh
    const roleBasedRoadmaps = [
        {
            id: 1,
            title: "Frontend Developer",
            description: "Complete roadmap from junior to senior frontend developer covering HTML, CSS, JavaScript, React, and modern frontend tools",
            duration: "6-12 months",
            difficulty: "Beginner to Advanced",
            steps: 8,
            technologies: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Next.js", "Tailwind CSS"],
            icon: "🎨",
            color: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/frontend"
        },
        {
            id: 2,
            title: "Backend Developer",
            description: "Master server-side development, APIs, databases, and system architecture",
            duration: "8-14 months",
            difficulty: "Intermediate to Advanced",
            steps: 10,
            technologies: ["Node.js", "Python", "PostgreSQL", "Docker", "REST APIs", "GraphQL"],
            icon: "⚙️",
            color: "from-green-500/20 to-teal-500/20 border-green-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/backend"
        },
        {
            id: 3,
            title: "Full Stack Developer",
            description: "Become proficient in both frontend and backend development with modern frameworks",
            duration: "12-18 months",
            difficulty: "Beginner to Expert",
            steps: 12,
            technologies: ["React", "Node.js", "MongoDB", "AWS", "Docker", "TypeScript"],
            icon: "🚀",
            color: "from-orange-500/20 to-red-500/20 border-orange-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/full-stack"
        },
        {
            id: 4,
            title: "DevOps Engineer",
            description: "Master CI/CD, cloud infrastructure, automation, and containerization",
            duration: "8-12 months",
            difficulty: "Intermediate to Advanced",
            steps: 7,
            technologies: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins", "GitLab CI"],
            icon: "🔧",
            color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/devops"
        },
        {
            id: 5,
            title: "Data Analyst",
            description: "Learn data analysis, visualization, and business intelligence tools",
            duration: "6-10 months",
            difficulty: "Beginner to Intermediate",
            steps: 6,
            technologies: ["Python", "SQL", "Excel", "Tableau", "Power BI", "Pandas"],
            icon: "📊",
            color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/data-analyst"
        },
        {
            id: 6,
            title: "AI Engineer",
            description: "Journey into artificial intelligence, machine learning, and deep learning",
            duration: "10-16 months",
            difficulty: "Intermediate to Expert",
            steps: 9,
            technologies: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Jupyter"],
            icon: "🤖",
            color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/ai-engineer"
        },
        {
            id: 7,
            title: "Data Engineer",
            description: "Build and maintain data infrastructure, pipelines, and warehouses",
            duration: "8-14 months",
            difficulty: "Intermediate to Advanced",
            steps: 8,
            technologies: ["Python", "SQL", "Apache Spark", "Airflow", "AWS", "Docker"],
            icon: "🏗️",
            color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/data-engineer"
        },
        {
            id: 8,
            title: "Android Developer",
            description: "Build native Android applications using Kotlin and modern Android development practices",
            duration: "6-10 months",
            difficulty: "Beginner to Advanced",
            steps: 7,
            technologies: ["Kotlin", "Java", "Android Studio", "Jetpack Compose", "Firebase"],
            icon: "📱",
            color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/android"
        },
        {
            id: 9,
            title: "iOS Developer",
            description: "Develop iOS applications using Swift and SwiftUI",
            duration: "6-10 months",
            difficulty: "Beginner to Advanced",
            steps: 6,
            technologies: ["Swift", "SwiftUI", "Xcode", "Core Data", "Combine"],
            icon: "🍎",
            color: "from-gray-500/20 to-slate-500/20 border-gray-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/ios"
        },
        {
            id: 10,
            title: "Blockchain Developer",
            description: "Learn blockchain technology, smart contracts, and decentralized applications",
            duration: "8-12 months",
            difficulty: "Intermediate to Advanced",
            steps: 8,
            technologies: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "DeFi"],
            icon: "⛓️",
            color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/blockchain"
        },
        {
            id: 11,
            title: "QA Engineer",
            description: "Master software testing, automation, and quality assurance practices",
            duration: "4-8 months",
            difficulty: "Beginner to Intermediate",
            steps: 6,
            technologies: ["Selenium", "Cypress", "Jest", "Postman", "Test Automation"],
            icon: "🔍",
            color: "from-red-500/20 to-pink-500/20 border-red-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/qa"
        },
        {
            id: 12,
            title: "Software Architect",
            description: "Design scalable systems and lead technical architecture decisions",
            duration: "12-18 months",
            difficulty: "Advanced to Expert",
            steps: 10,
            technologies: ["System Design", "Microservices", "Cloud Architecture", "Design Patterns"],
            icon: "🏛️",
            color: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
            category: "role",
            externalLink: "https://roadmap.sh/software-architect"
        }
    ];

    // Skill-based Roadmaps from roadmap.sh
    const skillBasedRoadmaps = [
        {
            id: 13,
            title: "SQL",
            description: "Master database querying, optimization, and data manipulation",
            duration: "2-4 months",
            difficulty: "Beginner to Intermediate",
            steps: 5,
            technologies: ["MySQL", "PostgreSQL", "SQLite", "Query Optimization"],
            icon: "🗄️",
            color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/sql"
        },
        {
            id: 14,
            title: "React",
            description: "Learn React.js from basics to advanced concepts including hooks, state management, and testing",
            duration: "3-6 months",
            difficulty: "Beginner to Advanced",
            steps: 6,
            technologies: ["React Hooks", "Redux", "Next.js", "Testing Library"],
            icon: "⚛️",
            color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/react"
        },
        {
            id: 15,
            title: "Vue.js",
            description: "Master Vue.js framework for building modern web applications",
            duration: "2-4 months",
            difficulty: "Beginner to Intermediate",
            steps: 5,
            technologies: ["Vue 3", "Vuex", "Nuxt.js", "Composition API"],
            icon: "💚",
            color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/vue"
        },
        {
            id: 16,
            title: "Angular",
            description: "Learn Angular framework for enterprise-level applications",
            duration: "4-6 months",
            difficulty: "Intermediate to Advanced",
            steps: 7,
            technologies: ["TypeScript", "RxJS", "Angular CLI", "NgRx"],
            icon: "🔺",
            color: "from-red-500/20 to-pink-500/20 border-red-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/angular"
        },
        {
            id: 17,
            title: "JavaScript",
            description: "Master JavaScript from ES6+ features to advanced concepts",
            duration: "4-8 months",
            difficulty: "Beginner to Advanced",
            steps: 8,
            technologies: ["ES6+", "Async/Await", "Promises", "Modules", "DOM"],
            icon: "🟨",
            color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/javascript"
        },
        {
            id: 18,
            title: "TypeScript",
            description: "Learn TypeScript for type-safe JavaScript development",
            duration: "2-4 months",
            difficulty: "Intermediate",
            steps: 4,
            technologies: ["Types", "Interfaces", "Generics", "Decorators"],
            icon: "🔷",
            color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/typescript"
        },
        {
            id: 19,
            title: "Node.js",
            description: "Master server-side JavaScript development with Node.js",
            duration: "3-6 months",
            difficulty: "Intermediate to Advanced",
            steps: 6,
            technologies: ["Express", "NPM", "Async Programming", "File System"],
            icon: "🟢",
            color: "from-green-500/20 to-teal-500/20 border-green-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/nodejs"
        },
        {
            id: 20,
            title: "Python",
            description: "Learn Python programming from basics to advanced applications",
            duration: "4-8 months",
            difficulty: "Beginner to Advanced",
            steps: 7,
            technologies: ["Django", "Flask", "Pandas", "NumPy", "FastAPI"],
            icon: "🐍",
            color: "from-yellow-500/20 to-green-500/20 border-yellow-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/python"
        },
        {
            id: 21,
            title: "System Design",
            description: "Learn to design scalable and distributed systems",
            duration: "6-10 months",
            difficulty: "Advanced",
            steps: 8,
            technologies: ["Microservices", "Load Balancing", "Caching", "Databases"],
            icon: "🏗️",
            color: "from-gray-500/20 to-slate-500/20 border-gray-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/system-design"
        },
        {
            id: 22,
            title: "Java",
            description: "Master Java programming and enterprise development",
            duration: "6-12 months",
            difficulty: "Beginner to Advanced",
            steps: 8,
            technologies: ["Spring Boot", "Maven", "JUnit", "Hibernate"],
            icon: "☕",
            color: "from-orange-500/20 to-red-500/20 border-orange-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/java"
        },
        {
            id: 23,
            title: "Docker",
            description: "Learn containerization and container orchestration",
            duration: "2-4 months",
            difficulty: "Intermediate",
            steps: 4,
            technologies: ["Dockerfile", "Docker Compose", "Registry", "Best Practices"],
            icon: "🐳",
            color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/docker"
        },
        {
            id: 24,
            title: "Kubernetes",
            description: "Master container orchestration and cloud-native applications",
            duration: "3-6 months",
            difficulty: "Advanced",
            steps: 6,
            technologies: ["Pods", "Services", "Deployments", "Helm"],
            icon: "⚓",
            color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
            category: "skill",
            externalLink: "https://roadmap.sh/kubernetes"
        }
    ];

    const allRoadmaps = [...roleBasedRoadmaps, ...skillBasedRoadmaps];
    const filteredRoadmaps = allRoadmaps.filter(roadmap =>
        roadmap.category === activeTab &&
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const learningPhases = [
        {
            phase: "Foundation",
            description: "Build strong fundamentals",
            duration: "2-3 months",
            icon: "🏗️"
        },
        {
            phase: "Practice",
            description: "Apply knowledge through projects",
            duration: "3-4 months",
            icon: "💻"
        },
        {
            phase: "Interview Prep",
            description: "Master technical interviews",
            duration: "1-2 months",
            icon: "🎯"
        },
        {
            phase: "Specialization",
            description: "Deepen expertise in chosen areas",
            duration: "Ongoing",
            icon: "🏆"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-primary-100">Developer Roadmaps</h1>
                <p className="text-light-400 text-lg max-w-3xl mx-auto">
                    Community created roadmaps, guides and articles to help developers grow in their career.
                    Based on the comprehensive roadmaps from <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer" className="text-primary-200 hover:text-primary-100 underline">roadmap.sh</a>.
                </p>
            </div>

            {/* Learning Process */}
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-primary-100 mb-6 text-center">How Our Roadmaps Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                    {learningPhases.map((phase, index) => (
                        <div key={phase.phase} className="text-center relative">
                            <div className="w-16 h-16 bg-primary-200/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">{phase.icon}</span>
                            </div>
                            <h3 className="text-primary-100 font-semibold mb-2">{phase.phase}</h3>
                            <p className="text-light-400 text-sm mb-2">{phase.description}</p>
                            <span className="text-primary-200 text-xs font-medium">{phase.duration}</span>
                            {index < learningPhases.length - 1 && (
                                <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2">
                                    <svg className="w-6 h-6 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex bg-dark-200 rounded-lg p-1 border border-dark-300">
                    <button
                        onClick={() => setActiveTab('role')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'role'
                            ? 'bg-primary-100 text-white'
                            : 'text-light-400 hover:text-primary-100'
                            }`}
                    >
                        Role-based Roadmaps
                    </button>
                    <button
                        onClick={() => setActiveTab('skill')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'skill'
                            ? 'bg-primary-100 text-white'
                            : 'text-light-400 hover:text-primary-100'
                            }`}
                    >
                        Skill-based Roadmaps
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search roadmaps..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-dark-200 border border-dark-300 rounded-lg px-4 py-2 pl-10 text-light-100 placeholder-light-400 focus:outline-none focus:border-primary-200 w-64"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-light-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Roadmaps Count */}
            <div className="text-center">
                <p className="text-light-400">
                    Showing {filteredRoadmaps.length} {activeTab === 'role' ? 'role-based' : 'skill-based'} roadmaps
                </p>
            </div>

            {/* Roadmaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoadmaps.map((roadmap) => (
                    <div
                        key={roadmap.id}
                        className={`bg-gradient-to-br ${roadmap.color} rounded-lg p-6 border hover:scale-105 transition-all duration-200 group cursor-pointer`}
                    >
                        {/* Roadmap Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="text-4xl">{roadmap.icon}</div>
                            <span className="bg-primary-100/10 text-primary-100 px-3 py-1 rounded-full text-xs font-medium">
                                {roadmap.steps} Steps
                            </span>
                        </div>

                        {/* Roadmap Content */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-primary-100 group-hover:text-primary-200 transition-colors">
                                {roadmap.title}
                            </h3>

                            <p className="text-light-100 leading-relaxed text-sm">
                                {roadmap.description}
                            </p>

                            {/* Roadmap Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-primary-200">⏱️</span>
                                    <span className="text-light-100">Duration: {roadmap.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-primary-200">📈</span>
                                    <span className="text-light-100">Level: {roadmap.difficulty}</span>
                                </div>
                            </div>

                            {/* Technologies */}
                            <div className="flex flex-wrap gap-2">
                                {roadmap.technologies.slice(0, 3).map((tech) => (
                                    <span
                                        key={tech}
                                        className="bg-primary-100/10 text-primary-100 px-2 py-1 rounded text-xs"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {roadmap.technologies.length > 3 && (
                                    <span className="bg-primary-100/10 text-primary-100 px-2 py-1 rounded text-xs">
                                        +{roadmap.technologies.length - 3} more
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button className="flex-1" size="sm" asChild>
                                    <a href={roadmap.externalLink} target="_blank" rel="noopener noreferrer">
                                        View Roadmap
                                    </a>
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    Start Journey
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredRoadmaps.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-primary-100 mb-2">No roadmaps found</h3>
                    <p className="text-light-400 mb-4">Try adjusting your search terms or switch between role-based and skill-based roadmaps.</p>
                    <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
                </div>
            )}

            {/* External Resources Section */}
            <div className="bg-gradient-to-r from-dark-200 to-dark-300 rounded-lg p-8 border border-dark-300">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-primary-100 mb-2">Powered by roadmap.sh</h2>
                    <p className="text-light-400">
                        These roadmaps are based on the comprehensive guides from roadmap.sh,
                        the 6th most starred project on GitHub with 335K+ stars.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary-200 mb-2">335K+</div>
                        <div className="text-light-400">GitHub Stars</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary-200 mb-2">2.1M+</div>
                        <div className="text-light-400">Registered Users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary-200 mb-2">40K+</div>
                        <div className="text-light-400">Discord Members</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                        <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer">
                            Visit roadmap.sh
                        </a>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoadmapsPage;
