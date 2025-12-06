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
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#9cd052]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#7cb342]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#c0fe72]/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 bg-[#c0fe72]/10 border border-[#c0fe72]/30 rounded-full px-4 py-2">
                                <span className="text-[#c0fe72]">⭐</span>
                                <span className="text-[#c0fe72] font-bold text-sm uppercase tracking-wide">Career Roadmaps</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                                <span className="text-white">Navigate Your Career with </span>
                                <span className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">Expert Roadmaps</span>
                            </h1>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
                                Follow community-created roadmaps and guides to grow your skills and advance your career. Based on <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer" className="text-[#c0fe72] hover:text-[#9cd052] underline font-semibold">roadmap.sh</a>
                            </p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-[#c0fe72]">✓</span>
                                    <span>Step-by-Step Guides</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-[#c0fe72]">✓</span>
                                    <span>Community Verified</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-[#c0fe72]">✓</span>
                                    <span>Track Progress</span>
                                </div>
                            </div>
                        </div>
                        {/* Animated Roadmap Path */}
                        <div className="hidden md:block relative w-64 h-64 flex-shrink-0">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-48 h-48">
                                    {/* Outer glow rings */}
                                    <div className="absolute inset-0 rounded-full bg-[#c0fe72]/5 animate-pulse"></div>
                                    <div className="absolute inset-4 rounded-full bg-[#9cd052]/5 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                    <div className="absolute inset-8 rounded-full bg-[#7cb342]/5 animate-pulse" style={{animationDelay: '1s'}}></div>
                                    
                                    {/* Roadmap Path */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-32 h-40">
                                            {/* Path line */}
                                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 120">
                                                <path d="M 20 10 Q 30 30 20 50 T 20 90 L 20 110" stroke="#c0fe72" strokeWidth="2" fill="none" strokeOpacity="0.3" strokeDasharray="5,5">
                                                    <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
                                                </path>
                                            </svg>
                                            
                                            {/* Milestone 1 - Start */}
                                            <div className="absolute top-2 left-4 w-8 h-8 bg-[#c0fe72]/20 border-2 border-[#c0fe72]/60 rounded-full flex items-center justify-center animate-pulse">
                                                <div className="w-3 h-3 bg-[#c0fe72] rounded-full"></div>
                                            </div>
                                            
                                            {/* Milestone 2 */}
                                            <div className="absolute top-12 left-8 w-8 h-8 bg-[#9cd052]/20 border-2 border-[#9cd052]/60 rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: '0.3s'}}>
                                                <div className="w-3 h-3 bg-[#9cd052] rounded-full"></div>
                                            </div>
                                            
                                            {/* Milestone 3 */}
                                            <div className="absolute top-24 left-4 w-8 h-8 bg-[#7cb342]/20 border-2 border-[#7cb342]/60 rounded-full flex items-center justify-center animate-pulse" style={{animationDelay: '0.6s'}}>
                                                <div className="w-3 h-3 bg-[#7cb342] rounded-full"></div>
                                            </div>
                                            
                                            {/* Milestone 4 - End (with bounce) */}
                                            <div className="absolute bottom-2 left-4 w-10 h-10 bg-gradient-to-br from-[#c0fe72]/30 to-[#9cd052]/40 border-2 border-[#c0fe72]/80 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-[#c0fe72]/40">
                                                <div className="w-4 h-4 bg-[#c0fe72] rounded-full animate-ping"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Process */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#c0fe72]/10">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#c0fe72] mb-6 text-center flex items-center justify-center gap-2">
                        <span>✨</span>
                        <span>How Our Roadmaps Work</span>
                        <span>✨</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {learningPhases.map((phase, index) => (
                            <div key={phase.phase} className="text-center relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-[#c0fe72]/20 rounded-xl p-4 hover:border-[#c0fe72]/40 transition-all hover:scale-105">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-[#c0fe72]/30 shadow-lg shadow-[#c0fe72]/20">
                                    <span className="text-2xl sm:text-3xl">{phase.icon}</span>
                                </div>
                                <h3 className="text-white font-bold mb-2 text-sm sm:text-base">{phase.phase}</h3>
                                <p className="text-gray-400 text-xs sm:text-sm mb-2">{phase.description}</p>
                                <span className="inline-block bg-[#c0fe72]/10 text-[#c0fe72] px-2 py-1 rounded-full text-xs font-semibold border border-[#c0fe72]/30">{phase.duration}</span>
                                {index < learningPhases.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                        <svg className="w-6 h-6 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-4 shadow-xl shadow-[#c0fe72]/10">
                    <div className="flex bg-gray-800/50 rounded-xl p-1 border border-[#c0fe72]/20">
                        <button
                            onClick={() => setActiveTab('role')}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === 'role'
                                    ? 'bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black shadow-lg shadow-[#c0fe72]/30'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            🎯 Role-based Roadmaps
                        </button>
                        <button
                            onClick={() => setActiveTab('skill')}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === 'skill'
                                    ? 'bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black shadow-lg shadow-[#c0fe72]/30'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            🛠️ Skill-based Roadmaps
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="🔍 Search roadmaps..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-800/50 border border-[#c0fe72]/30 rounded-xl px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#c0fe72] w-full sm:w-64 transition-all"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Roadmaps Count */}
                <div className="text-center">
                    <p className="text-gray-400 flex items-center justify-center gap-2">
                        <span className="text-[#c0fe72] font-bold text-lg">{filteredRoadmaps.length}</span>
                        <span>{activeTab === 'role' ? 'role-based' : 'skill-based'} roadmaps available</span>
                    </p>
                </div>

                {/* Roadmaps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredRoadmaps.map((roadmap) => (
                        <div
                            key={roadmap.id}
                            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-5 sm:p-6 border-2 border-[#c0fe72]/30 hover:border-[#c0fe72]/50 hover:scale-[1.02] transition-all duration-300 group shadow-xl shadow-[#c0fe72]/10 hover:shadow-[#c0fe72]/20"
                        >
                            {/* Roadmap Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-4xl sm:text-5xl">{roadmap.icon}</div>
                                <span className="bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 text-[#c0fe72] px-3 py-1 rounded-full text-xs font-bold border border-[#c0fe72]/30">
                                    {roadmap.steps} Steps
                                </span>
                            </div>

                            {/* Roadmap Content */}
                            <div className="space-y-4">
                                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#c0fe72] transition-colors">
                                    {roadmap.title}
                                </h3>

                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {roadmap.description}
                                </p>

                                {/* Roadmap Details */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#9cd052]">⏱️</span>
                                        <span className="text-gray-300">Duration: <span className="text-white font-semibold">{roadmap.duration}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#9cd052]">📈</span>
                                        <span className="text-gray-300">Level: <span className="text-white font-semibold">{roadmap.difficulty}</span></span>
                                    </div>
                                </div>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-2">
                                    {roadmap.technologies.slice(0, 3).map((tech) => (
                                        <span
                                            key={tech}
                                            className="bg-[#c0fe72]/10 text-[#c0fe72] px-2 py-1 rounded-lg text-xs font-semibold border border-[#c0fe72]/30"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {roadmap.technologies.length > 3 && (
                                        <span className="bg-[#9cd052]/10 text-[#9cd052] px-2 py-1 rounded-lg text-xs font-semibold border border-[#9cd052]/30">
                                            +{roadmap.technologies.length - 3} more
                                        </span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <Button className="flex-1 bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold hover:shadow-lg hover:shadow-[#c0fe72]/40 border-0" size="sm" asChild>
                                        <a href={roadmap.externalLink} target="_blank" rel="noopener noreferrer">
                                            View Roadmap
                                        </a>
                                    </Button>
                                    <Button className="flex-1 bg-gray-800/50 text-white border-[#c0fe72]/30 hover:bg-gray-700 hover:border-[#c0fe72]/50" size="sm">
                                        Start Journey
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredRoadmaps.length === 0 && (
                    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
                        <div className="text-5xl sm:text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-[#c0fe72] mb-2">No roadmaps found</h3>
                        <p className="text-gray-400 mb-6">Try adjusting your search terms or switch between role-based and skill-based roadmaps.</p>
                        <Button onClick={() => setSearchTerm('')} className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold hover:shadow-lg hover:shadow-[#c0fe72]/40 border-0">
                            Clear Search
                        </Button>
                    </div>
                )}

                {/* External Resources Section */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 sm:p-8 border-2 border-[#c0fe72]/30 shadow-2xl shadow-[#c0fe72]/20">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
                            <span>⭐</span>
                            <span>Powered by roadmap.sh</span>
                            <span>⭐</span>
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base">
                            These roadmaps are based on the comprehensive guides from roadmap.sh,
                            the 6th most starred project on GitHub with 335K+ stars.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                        <div className="text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-[#c0fe72]/20 rounded-xl p-4">
                            <div className="text-2xl sm:text-3xl font-bold text-[#c0fe72] mb-2">335K+</div>
                            <div className="text-gray-400 text-sm">GitHub Stars ⭐</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-[#9cd052]/20 rounded-xl p-4">
                            <div className="text-2xl sm:text-3xl font-bold text-[#9cd052] mb-2">2.1M+</div>
                            <div className="text-gray-400 text-sm">Registered Users 👥</div>
                        </div>
                        <div className="text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-[#7cb342]/20 rounded-xl p-4">
                            <div className="text-2xl sm:text-3xl font-bold text-[#7cb342] mb-2">40K+</div>
                            <div className="text-gray-400 text-sm">Discord Members 💬</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold hover:shadow-lg hover:shadow-[#c0fe72]/40 border-0">
                            <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer">
                                🌐 Visit roadmap.sh
                            </a>
                        </Button>
                        <Button asChild className="bg-gray-800/50 text-white border-[#c0fe72]/30 hover:bg-gray-700 hover:border-[#c0fe72]/50">
                            <Link href="/dashboard">← Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapsPage;
