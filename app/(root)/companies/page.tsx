'use client';

import React, { useCallback, useMemo, useState } from 'react';
import AutocompleteSearchBar from '@/components/AutocompleteSearchBar';
import { findCompanyMatch, getCompanyLogo } from '@/constants/companies';

type CompanyInsights = {
    name: string;
    website?: string;
    headquarters?: string;
    foundedYear?: number | null;
    size?: string;
    industry?: string;
    averageSalary?: {
        overall?: string;
        byRole?: Array<{ role: string; salaryRange: string; median?: string }>;
    };
    benefits?: string[];
    culture?: string[];
    interviewDifficulty?: string;
    growthOutlook?: string;
    keyTechnologies?: string[];
    notableFacts?: string[];
    sources?: { name: string; url?: string }[];
    glassdoor?: {
        rating?: number;
        workLifeBalanceRating?: number;
        compensationAndBenefitsRating?: number;
        cultureAndValuesRating?: number;
        careerOpportunitiesRating?: number;
        featuredReview?: {
            headline?: string;
            pros?: string;
            cons?: string;
            jobTitle?: string;
        } | null;
    } | null;
};

type FamousCompany = {
    name: string;
    logo: string;
    industry: string;
    headquarters: string;
    description: string;
    keyTech: string[];
};

// Static fallback data for when API fails or returns minimal data
const COMPANY_FALLBACK_DATA: Record<string, CompanyInsights> = {
    "Google": {
        name: "Google",
        website: "https://www.google.com",
        headquarters: "Mountain View, CA",
        foundedYear: 1998,
        size: "100,000+ employees",
        industry: "Technology",
        averageSalary: {
            overall: "$150k-300k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$120k-250k", median: "$180k" },
                { role: "Product Manager", salaryRange: "$150k-300k", median: "$220k" },
                { role: "Data Scientist", salaryRange: "$130k-280k", median: "$200k" }
            ]
        },
        benefits: ["Health insurance", "401k matching", "Free meals", "Stock options", "Flexible work"],
        culture: ["Innovation-focused", "Data-driven", "Collaborative", "Fast-paced", "Learning-oriented"],
        interviewDifficulty: "Hard",
        growthOutlook: "Strong growth in cloud computing and AI services",
        keyTechnologies: ["Go", "Python", "Java", "C++", "JavaScript", "TensorFlow", "Kubernetes"],
        notableFacts: ["World's most popular search engine", "Parent company Alphabet", "Major player in AI and cloud computing"],
        sources: [{ name: "Glassdoor", url: "https://glassdoor.com" }, { name: "Levels.fyi" }]
    },
    "Microsoft": {
        name: "Microsoft",
        website: "https://www.microsoft.com",
        headquarters: "Redmond, WA",
        foundedYear: 1975,
        size: "200,000+ employees",
        industry: "Technology",
        averageSalary: {
            overall: "$140k-280k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$110k-240k", median: "$170k" },
                { role: "Product Manager", salaryRange: "$140k-280k", median: "$210k" },
                { role: "Cloud Architect", salaryRange: "$150k-300k", median: "$220k" }
            ]
        },
        benefits: ["Health insurance", "401k matching", "Stock purchase plan", "Flexible work", "Learning budget"],
        culture: ["Inclusive", "Growth mindset", "Collaborative", "Customer-focused", "Innovation-driven"],
        interviewDifficulty: "Medium to Hard",
        growthOutlook: "Strong growth in cloud services (Azure) and productivity software",
        keyTechnologies: ["C#", ".NET", "TypeScript", "Azure", "Python", "React", "SQL Server"],
        notableFacts: ["Second largest company by market cap", "Leading cloud provider", "Office 365 has 300M+ users"],
        sources: [{ name: "Glassdoor" }, { name: "Microsoft Careers" }]
    },
    "Apple": {
        name: "Apple",
        website: "https://www.apple.com",
        headquarters: "Cupertino, CA",
        foundedYear: 1976,
        size: "150,000+ employees",
        industry: "Technology",
        averageSalary: {
            overall: "$160k-320k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$130k-280k", median: "$200k" },
                { role: "Hardware Engineer", salaryRange: "$140k-300k", median: "$220k" },
                { role: "Product Manager", salaryRange: "$160k-320k", median: "$240k" }
            ]
        },
        benefits: ["Health insurance", "Stock purchase plan", "Product discounts", "Wellness programs", "Flexible work"],
        culture: ["Design-focused", "Innovation-driven", "Quality-oriented", "Secretive", "High standards"],
        interviewDifficulty: "Hard",
        growthOutlook: "Continued growth in services and wearables",
        keyTechnologies: ["Swift", "Objective-C", "C++", "Metal", "WebKit", "iOS", "macOS"],
        notableFacts: ["Most valuable company by market cap", "iPhone generates 50%+ of revenue", "Strong ecosystem of products"],
        sources: [{ name: "Glassdoor" }, { name: "Apple Careers" }]
    },
    "Amazon": {
        name: "Amazon",
        website: "https://www.amazon.com",
        headquarters: "Seattle, WA",
        foundedYear: 1994,
        size: "1,500,000+ employees",
        industry: "E-commerce/Cloud Computing",
        averageSalary: {
            overall: "$130k-270k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$115k-230k", median: "$165k" },
                { role: "Product Manager", salaryRange: "$140k-270k", median: "$200k" },
                { role: "Solutions Architect", salaryRange: "$130k-250k", median: "$185k" }
            ]
        },
        benefits: ["Health insurance", "401k matching", "Stock options", "Career Choice program", "Parental leave"],
        culture: ["Customer obsession", "Ownership", "Invent and simplify", "High performance", "Data-driven"],
        interviewDifficulty: "Hard",
        growthOutlook: "Continued dominance in cloud computing and e-commerce expansion",
        keyTechnologies: ["Java", "Python", "C++", "AWS", "React", "DynamoDB", "Lambda"],
        notableFacts: ["Largest e-commerce platform", "AWS leads cloud market", "Prime has 200M+ subscribers"],
        sources: [{ name: "Glassdoor" }, { name: "Amazon Jobs" }]
    },
    "Meta": {
        name: "Meta",
        website: "https://www.meta.com",
        headquarters: "Menlo Park, CA",
        foundedYear: 2004,
        size: "70,000+ employees",
        industry: "Social Media/Technology",
        averageSalary: {
            overall: "$170k-350k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$140k-300k", median: "$210k" },
                { role: "Product Manager", salaryRange: "$180k-350k", median: "$260k" },
                { role: "Data Scientist", salaryRange: "$150k-320k", median: "$220k" }
            ]
        },
        benefits: ["Health insurance", "Stock options", "Free meals", "Wellness programs", "Learning budget"],
        culture: ["Move fast", "Be bold", "Focus on impact", "Be open", "Build social value"],
        interviewDifficulty: "Hard",
        growthOutlook: "Heavy investment in metaverse and VR technologies",
        keyTechnologies: ["React", "PHP", "Python", "C++", "GraphQL", "PyTorch", "Oculus SDK"],
        notableFacts: ["3.8B+ monthly active users across platforms", "Leading VR/AR development", "Owns Instagram, WhatsApp"],
        sources: [{ name: "Glassdoor" }, { name: "Meta Careers" }]
    },
    "Netflix": {
        name: "Netflix",
        website: "https://www.netflix.com",
        headquarters: "Los Gatos, CA",
        foundedYear: 1997,
        size: "12,000+ employees",
        industry: "Entertainment/Streaming",
        averageSalary: {
            overall: "$150k-400k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$130k-350k", median: "$220k" },
                { role: "Data Engineer", salaryRange: "$140k-320k", median: "$210k" },
                { role: "Product Manager", salaryRange: "$160k-400k", median: "$280k" }
            ]
        },
        benefits: ["Unlimited PTO", "Stock options", "Health insurance", "Parental leave", "Learning budget"],
        culture: ["Freedom and responsibility", "High performance", "Candid feedback", "Innovation", "Inclusion"],
        interviewDifficulty: "Hard",
        growthOutlook: "Global expansion and original content investment",
        keyTechnologies: ["Java", "Python", "JavaScript", "React", "Scala", "Kafka", "Cassandra"],
        notableFacts: ["230M+ subscribers globally", "Spends $15B+ on content annually", "Available in 190+ countries"],
        sources: [{ name: "Glassdoor" }, { name: "Netflix Jobs" }]
    },
    "Tesla": {
        name: "Tesla",
        website: "https://www.tesla.com",
        headquarters: "Austin, TX",
        foundedYear: 2003,
        size: "120,000+ employees",
        industry: "Automotive/Clean Energy",
        averageSalary: {
            overall: "$100k-200k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$110k-180k", median: "$140k" },
                { role: "Mechanical Engineer", salaryRange: "$90k-160k", median: "$120k" },
                { role: "Product Manager", salaryRange: "$130k-200k", median: "$165k" }
            ]
        },
        benefits: ["Health insurance", "Stock options", "401k matching", "Employee discounts", "Wellness programs"],
        culture: ["Innovation", "Sustainability", "Fast-paced", "Mission-driven", "High expectations"],
        interviewDifficulty: "Medium to Hard",
        growthOutlook: "Rapid expansion in EVs, energy storage, and autonomous driving",
        keyTechnologies: ["Python", "C++", "JavaScript", "React", "MATLAB", "TensorFlow", "ROS"],
        notableFacts: ["Leading EV manufacturer", "Autopilot technology pioneer", "Gigafactory network expansion"],
        sources: [{ name: "Glassdoor" }, { name: "Tesla Careers" }]
    },
    "Spotify": {
        name: "Spotify",
        website: "https://www.spotify.com",
        headquarters: "Stockholm, Sweden",
        foundedYear: 2006,
        size: "9,000+ employees",
        industry: "Music Streaming/Technology",
        averageSalary: {
            overall: "$120k-250k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$110k-200k", median: "$150k" },
                { role: "Data Scientist", salaryRange: "$120k-220k", median: "$170k" },
                { role: "Product Manager", salaryRange: "$130k-250k", median: "$190k" }
            ]
        },
        benefits: ["Health insurance", "Spotify Premium", "Flexible work", "Parental leave", "Learning budget"],
        culture: ["Agile", "Collaborative", "Innovation", "Diversity", "Work-life balance"],
        interviewDifficulty: "Medium",
        growthOutlook: "Expansion in podcasts and audio content beyond music",
        keyTechnologies: ["Java", "Python", "Scala", "React", "TypeScript", "Kafka", "BigQuery"],
        notableFacts: ["400M+ monthly active users", "Leading podcast platform", "Available in 180+ markets"],
        sources: [{ name: "Glassdoor" }, { name: "Spotify Jobs" }]
    },
    "Airbnb": {
        name: "Airbnb",
        website: "https://www.airbnb.com",
        headquarters: "San Francisco, CA",
        foundedYear: 2008,
        size: "6,000+ employees",
        industry: "Travel/Hospitality Technology",
        averageSalary: {
            overall: "$140k-280k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$130k-250k", median: "$185k" },
                { role: "Product Manager", salaryRange: "$150k-280k", median: "$210k" },
                { role: "Data Scientist", salaryRange: "$140k-260k", median: "$195k" }
            ]
        },
        benefits: ["Health insurance", "Stock options", "Annual travel credit", "Flexible work", "Wellness programs"],
        culture: ["Belong anywhere", "Champion the mission", "Be a host", "Embrace the adventure", "Be a cereal entrepreneur"],
        interviewDifficulty: "Medium to Hard",
        growthOutlook: "Recovery and expansion post-pandemic, focus on experiences",
        keyTechnologies: ["Ruby", "JavaScript", "React", "Java", "Python", "Kafka", "Elasticsearch"],
        notableFacts: ["4M+ hosts worldwide", "Available in 220+ countries", "Experiences platform expansion"],
        sources: [{ name: "Glassdoor" }, { name: "Airbnb Careers" }]
    },
    "Uber": {
        name: "Uber",
        website: "https://www.uber.com",
        headquarters: "San Francisco, CA",
        foundedYear: 2009,
        size: "29,000+ employees",
        industry: "Transportation/Technology",
        averageSalary: {
            overall: "$130k-260k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$120k-230k", median: "$170k" },
                { role: "Product Manager", salaryRange: "$140k-260k", median: "$195k" },
                { role: "Data Scientist", salaryRange: "$130k-240k", median: "$180k" }
            ]
        },
        benefits: ["Health insurance", "Stock options", "Uber credits", "Flexible work", "Parental leave"],
        culture: ["Customer obsession", "Make magic", "Big bold bets", "Do the right thing", "Earn growth"],
        interviewDifficulty: "Medium to Hard",
        growthOutlook: "Expansion in delivery, freight, and autonomous vehicles",
        keyTechnologies: ["Go", "Java", "Python", "React", "Swift", "Kafka", "Cassandra"],
        notableFacts: ["Available in 70+ countries", "5B+ trips completed", "Leading food delivery platform"],
        sources: [{ name: "Glassdoor" }, { name: "Uber Careers" }]
    },
    "LinkedIn": {
        name: "LinkedIn",
        website: "https://www.linkedin.com",
        headquarters: "Sunnyvale, CA",
        foundedYear: 2003,
        size: "20,000+ employees",
        industry: "Professional Networking/Technology",
        averageSalary: {
            overall: "$140k-280k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$130k-250k", median: "$185k" },
                { role: "Product Manager", salaryRange: "$150k-280k", median: "$210k" },
                { role: "Data Scientist", salaryRange: "$140k-260k", median: "$195k" }
            ]
        },
        benefits: ["Health insurance", "Stock options", "LinkedIn Learning", "Flexible work", "InDay volunteer time"],
        culture: ["Members first", "Relationships matter", "Be open honest and constructive", "Demand excellence", "Take intelligent risks"],
        interviewDifficulty: "Medium to Hard",
        growthOutlook: "Growth in learning platform and talent solutions",
        keyTechnologies: ["Java", "Scala", "JavaScript", "Python", "Kafka", "Voldemort", "Espresso"],
        notableFacts: ["900M+ members globally", "Owned by Microsoft", "Leading professional network"],
        sources: [{ name: "Glassdoor" }, { name: "LinkedIn Careers" }]
    },
    "Salesforce": {
        name: "Salesforce",
        website: "https://www.salesforce.com",
        headquarters: "San Francisco, CA",
        foundedYear: 1999,
        size: "73,000+ employees",
        industry: "CRM/Cloud Computing",
        averageSalary: {
            overall: "$130k-270k",
            byRole: [
                { role: "Software Engineer", salaryRange: "$120k-240k", median: "$175k" },
                { role: "Product Manager", salaryRange: "$140k-270k", median: "$200k" },
                { role: "Solutions Engineer", salaryRange: "$110k-220k", median: "$160k" }
            ]
        },
        benefits: ["Health insurance", "Stock options", "Volunteer time off", "Mindfulness programs", "Career development"],
        culture: ["Trust", "Customer success", "Innovation", "Equality", "Sustainability"],
        interviewDifficulty: "Medium",
        growthOutlook: "Continued growth in CRM and enterprise cloud solutions",
        keyTechnologies: ["Java", "JavaScript", "Apex", "Lightning", "React", "Heroku", "Tableau"],
        notableFacts: ["#1 CRM platform globally", "150,000+ customers", "Trailhead learning platform"],
        sources: [{ name: "Glassdoor" }, { name: "Salesforce Careers" }]
    }
};

const FAMOUS_COMPANIES: FamousCompany[] = [
    {
        name: "Google",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
        industry: "Technology",
        headquarters: "Mountain View, CA",
        description: "Leading search engine and cloud services provider",
        keyTech: ["Go", "Python", "Java", "C++", "JavaScript"]
    },
    {
        name: "Microsoft",
        logo: "https://logo.clearbit.com/microsoft.com",
        industry: "Technology",
        headquarters: "Redmond, WA",
        description: "Software giant and cloud computing leader",
        keyTech: ["C#", ".NET", "TypeScript", "Azure", "Python"]
    },
    {
        name: "Apple",
        logo: "https://logo.clearbit.com/apple.com",
        industry: "Technology",
        headquarters: "Cupertino, CA",
        description: "Consumer electronics and software innovator",
        keyTech: ["Swift", "Objective-C", "C++", "Metal", "WebKit"]
    },
    {
        name: "Amazon",
        logo: "https://logo.clearbit.com/amazon.com",
        industry: "E-commerce/Cloud",
        headquarters: "Seattle, WA",
        description: "E-commerce and cloud computing giant",
        keyTech: ["Java", "Python", "C++", "AWS", "React"]
    },
    {
        name: "Meta",
        logo: "https://logo.clearbit.com/meta.com",
        industry: "Social Media",
        headquarters: "Menlo Park, CA",
        description: "Social networking and metaverse company",
        keyTech: ["React", "PHP", "Python", "C++", "GraphQL"]
    },
    {
        name: "Netflix",
        logo: "https://logo.clearbit.com/netflix.com",
        industry: "Entertainment",
        headquarters: "Los Gatos, CA",
        description: "Streaming entertainment service",
        keyTech: ["Java", "Python", "JavaScript", "React", "Scala"]
    },
    {
        name: "Tesla",
        logo: "https://logo.clearbit.com/tesla.com",
        industry: "Automotive",
        headquarters: "Austin, TX",
        description: "Electric vehicles and clean energy",
        keyTech: ["Python", "C++", "JavaScript", "React", "MATLAB"]
    },
    {
        name: "Spotify",
        logo: "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png",
        industry: "Music Streaming",
        headquarters: "Stockholm, Sweden",
        description: "Digital music streaming platform",
        keyTech: ["Java", "Python", "Scala", "React", "TypeScript"]
    },
    {
        name: "Airbnb",
        logo: "https://logo.clearbit.com/airbnb.com",
        industry: "Travel",
        headquarters: "San Francisco, CA",
        description: "Online marketplace for lodging and experiences",
        keyTech: ["Ruby", "JavaScript", "React", "Java", "Python"]
    },
    {
        name: "Uber",
        logo: "https://logo.clearbit.com/uber.com",
        industry: "Transportation",
        headquarters: "San Francisco, CA",
        description: "Ride-sharing and delivery platform",
        keyTech: ["Go", "Java", "Python", "React", "Swift"]
    },
    {
        name: "LinkedIn",
        logo: "https://logo.clearbit.com/linkedin.com",
        industry: "Professional Network",
        headquarters: "Sunnyvale, CA",
        description: "Professional networking platform",
        keyTech: ["Java", "Scala", "JavaScript", "Python", "Kafka"]
    },
    {
        name: "Salesforce",
        logo: "https://logo.clearbit.com/salesforce.com",
        industry: "CRM/Cloud",
        headquarters: "San Francisco, CA",
        description: "Customer relationship management platform",
        keyTech: ["Java", "JavaScript", "Apex", "Lightning", "React"]
    }
];

const CompaniesPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<CompanyInsights | null>(null);
    const [error, setError] = useState<string | null>(null);

    const placeholder = useMemo(
        () => 'Search a company (e.g., Google, Microsoft, Airbnb) ...',
        []
    );

    const onSearch = useCallback(async (q: string) => {
        if (!q) {
            // Clear search results and show default companies
            setData(null);
            setError(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        setData(null);
        
        console.log('Searching for company:', q); // Debug log
        
        try {
            const res = await fetch('/api/companies/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company: q })
            });
            
            console.log('API Response status:', res.status); // Debug log
            
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                console.error('API Error:', body); // Debug log
                throw new Error(body.error || 'Failed to fetch insights');
            }
            const body = await res.json();
            console.log('API Response data:', body); // Debug log
            console.log('Setting data:', body.insights); // Debug log
            
            // Check if API returned minimal data and use fallback if available
            const apiData = body.insights as CompanyInsights;
            const hasMinimalData = !apiData.industry && !apiData.size && !apiData.headquarters && !apiData.averageSalary;
            
            // Try to find exact match or fuzzy match for fallback data
            const matchedCompany = findCompanyMatch(q);
            
            if (hasMinimalData && matchedCompany && COMPANY_FALLBACK_DATA[matchedCompany]) {
                console.log('Using fallback data for:', matchedCompany);
                setData(COMPANY_FALLBACK_DATA[matchedCompany]);
            } else {
                setData(apiData);
            }
        } catch (e: any) {
            console.error('Search error:', e); // Debug log
            setError(e.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCompanyClick = useCallback((companyName: string) => {
        setQuery(companyName);
        onSearch(companyName);
    }, [onSearch]);

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-2xl md:text-3xl font-semibold text-light-100 mb-6">Companies</h1>

            <AutocompleteSearchBar
                onSearch={onSearch}
                placeholder={placeholder}
                isLoading={isLoading}
                value={query}
                onChange={setQuery}
            />

            {error && (
                <div className="mt-6 text-red-400 bg-red-950/30 border border-red-900 rounded-lg p-4">
                    {error}
                </div>
            )}

            {/* Default Famous Companies Grid */}
            {!isLoading && !data && !query && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-light-100 mb-6">Popular Companies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FAMOUS_COMPANIES.map((company) => (
                            <div 
                                key={company.name}
                                onClick={() => handleCompanyClick(company.name)}
                                className="bg-dark-200 rounded-lg p-6 cursor-pointer hover:bg-dark-300 transition-colors duration-200 border border-transparent hover:border-primary-200/30"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-white p-1 flex items-center justify-center">
                                        <img 
                                            src={company.logo} 
                                            alt={`${company.name} logo`}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `<div class="w-full h-full bg-primary-200 rounded flex items-center justify-center text-white text-xs font-bold">${company.name.charAt(0)}</div>`;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-light-100">{company.name}</h3>
                                        <p className="text-sm text-light-300">{company.industry}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-light-200 mb-3">{company.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-light-400">{company.headquarters}</span>
                                    <div className="flex flex-wrap gap-1">
                                        {company.keyTech.slice(0, 3).map((tech) => (
                                            <span key={tech} className="px-2 py-1 rounded text-xs bg-dark-300 text-light-300">
                                                {tech}
                                            </span>
                                        ))}
                                        {company.keyTech.length > 3 && (
                                            <span className="px-2 py-1 rounded text-xs bg-dark-300 text-light-300">
                                                +{company.keyTech.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="mt-8 flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-200"></div>
                        <span className="text-light-300">Fetching company insights...</span>
                    </div>
                </div>
            )}

            {!isLoading && data && (
                <div className="mt-8 space-y-6">
                    {/* Back to companies button */}
                    <button 
                        onClick={() => {
                            setQuery('');
                            setData(null);
                        }}
                        className="text-primary-200 hover:text-primary-100 text-sm flex items-center gap-2"
                    >
                        ← Back to companies
                    </button>
                    
                    <div className="bg-dark-200 rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-white p-2 flex items-center justify-center flex-shrink-0">
                                    <img 
                                        src={getCompanyLogo(data.name)} 
                                        alt={`${data.name} logo`}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            const parent = target.parentElement;
                                            if (parent) {
                                                parent.innerHTML = `<div class="w-full h-full bg-primary-200 rounded flex items-center justify-center text-white text-lg font-bold">${data.name.charAt(0)}</div>`;
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-light-100">{data.name}</h2>
                                    {data.website ? (
                                        <a href={data.website} target="_blank" rel="noreferrer" className="text-primary-200 text-sm hover:text-primary-100">
                                            {data.website}
                                        </a>
                                    ) : (
                                        <span className="text-light-400 text-sm">Website: Data unavailable</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm text-light-300">
                                <span className="mr-3">Industry: {data.industry || 'Data unavailable'}</span>
                                <span className="mr-3">Size: {data.size || 'Data unavailable'}</span>
                                <span>HQ: {data.headquarters || 'Data unavailable'}</span>
                            </div>
                        </div>
                        
                    </div>

                    {/* Always show salary section */}
                    <div className="bg-dark-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-3">Average Salary</h3>
                        {data.averageSalary?.overall ? (
                            <p className="text-light-200 mb-2">Overall: {data.averageSalary.overall}</p>
                        ) : (
                            <p className="text-light-400 mb-2">Overall: Data unavailable</p>
                        )}
                        {data.averageSalary?.byRole?.length ? (
                            <div className="grid md:grid-cols-2 gap-3">
                                {data.averageSalary.byRole.map((r) => (
                                    <div key={r.role} className="bg-dark-300 rounded p-3">
                                        <div className="font-medium">{r.role}</div>
                                        <div className="text-sm text-light-300">{r.salaryRange}{r.median ? ` • Median ${r.median}` : ''}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-light-400 text-sm">Role-specific data: Data unavailable</p>
                        )}
                    </div>

                    {/* Always show culture, benefits, and technologies sections */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-dark-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-3">Culture</h3>
                            {data.culture?.length ? (
                                <ul className="list-disc ml-5 space-y-1 text-light-200">
                                    {data.culture.map((c, idx) => (
                                        <li key={idx}>{c}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-light-400 text-sm">Data unavailable</p>
                            )}
                        </div>

                        <div className="bg-dark-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                            {data.benefits?.length ? (
                                <ul className="list-disc ml-5 space-y-1 text-light-200">
                                    {data.benefits.map((b, idx) => (
                                        <li key={idx}>{b}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-light-400 text-sm">Data unavailable</p>
                            )}
                        </div>

                        <div className="bg-dark-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-3">Key Technologies</h3>
                            {data.keyTechnologies?.length ? (
                                <div className="flex flex-wrap gap-2">
                                    {data.keyTechnologies.map((t, idx) => (
                                        <span key={idx} className="px-2 py-1 rounded bg-dark-300 text-sm">{t}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-light-400 text-sm">Data unavailable</p>
                            )}
                        </div>
                    </div>

                    {/* Always show insights section */}
                    <div className="bg-dark-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-3">Insights</h3>
                        <div className="space-y-3">
                            <p className="text-light-200">
                                Growth Outlook: {data.growthOutlook || <span className="text-light-400">Data unavailable</span>}
                            </p>
                            <p className="text-light-300">
                                Interview Difficulty: {data.interviewDifficulty || <span className="text-light-400">Data unavailable</span>}
                            </p>
                            <div>
                                <p className="text-light-200 mb-2">Notable Facts:</p>
                                {data.notableFacts?.length ? (
                                    <ul className="list-disc ml-5 space-y-1 text-light-200">
                                        {data.notableFacts.map((f, idx) => (
                                            <li key={idx}>{f}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-light-400 text-sm ml-5">Data unavailable</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {data.glassdoor && (
                        <div className="bg-dark-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Glassdoor</h3>
                                <a href={`http://www.glassdoor.co.in/index.htm`} target="_blank" rel="noreferrer" className="text-xs text-light-400">
                                    powered by <img src="https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png" alt="Job Search" className="inline h-4 align-middle ml-1" />
                                </a>
                            </div>
                            {typeof data.glassdoor.rating === 'number' && (
                                <p className="text-light-200">Overall rating: {data.glassdoor.rating.toFixed(1)}</p>
                            )}
                            {data.glassdoor.featuredReview && (
                                <div className="mt-3 text-sm text-light-300">
                                    <div className="font-medium text-light-100">Featured review{data.glassdoor.featuredReview.jobTitle ? ` • ${data.glassdoor.featuredReview.jobTitle}` : ''}</div>
                                    {data.glassdoor.featuredReview.headline && <div className="mt-1">“{data.glassdoor.featuredReview.headline}”</div>}
                                    {data.glassdoor.featuredReview.pros && <div className="mt-1">Pros: {data.glassdoor.featuredReview.pros}</div>}
                                    {data.glassdoor.featuredReview.cons && <div className="mt-1">Cons: {data.glassdoor.featuredReview.cons}</div>}
                                </div>
                            )}
                        </div>
                    )}

                    {data.sources?.length ? (
                        <div className="bg-dark-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-3">Sources</h3>
                            <ul className="list-disc ml-5 space-y-1 text-light-300 text-sm">
                                {data.sources.map((s, idx) => (
                                    <li key={idx}>
                                        {s.url ? (
                                            <a className="text-primary-200" href={s.url} target="_blank" rel="noreferrer">{s.name}</a>
                                        ) : (
                                            <span>{s.name}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default CompaniesPage;


