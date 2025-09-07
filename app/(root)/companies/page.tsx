'use client';

import React, { useCallback, useMemo, useState } from 'react';
import SearchBar from '@/components/SearchBar';

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
        try {
            const res = await fetch('/api/companies/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company: q })
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || 'Failed to fetch insights');
            }
            const body = await res.json();
            setData(body.insights as CompanyInsights);
        } catch (e: any) {
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

            <SearchBar
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

            {!isLoading && data && (
                <div className="mt-8 space-y-6">
                    <div className="bg-dark-200 rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                                <h2 className="text-xl font-semibold text-light-100">{data.name}</h2>
                                {data.website && (
                                    <a href={data.website} target="_blank" rel="noreferrer" className="text-primary-200 text-sm">
                                        {data.website}
                                    </a>
                                )}
                            </div>
                            <div className="text-sm text-light-300">
                                {data.industry && <span className="mr-3">Industry: {data.industry}</span>}
                                {data.size && <span className="mr-3">Size: {data.size}</span>}
                                {data.headquarters && <span>HQ: {data.headquarters}</span>}
                            </div>
                        </div>
                    </div>

                    {data.averageSalary && (
                        <div className="bg-dark-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-3">Average Salary</h3>
                            {data.averageSalary.overall && (
                                <p className="text-light-200 mb-2">Overall: {data.averageSalary.overall}</p>
                            )}
                            {data.averageSalary.byRole?.length ? (
                                <div className="grid md:grid-cols-2 gap-3">
                                    {data.averageSalary.byRole.map((r) => (
                                        <div key={r.role} className="bg-dark-300 rounded p-3">
                                            <div className="font-medium">{r.role}</div>
                                            <div className="text-sm text-light-300">{r.salaryRange}{r.median ? ` • Median ${r.median}` : ''}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    )}

                    {(data.culture?.length || data.benefits?.length || data.keyTechnologies?.length) && (
                        <div className="grid md:grid-cols-3 gap-6">
                            {data.culture?.length ? (
                                <div className="bg-dark-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Culture</h3>
                                    <ul className="list-disc ml-5 space-y-1 text-light-200">
                                        {data.culture.map((c, idx) => (
                                            <li key={idx}>{c}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            {data.benefits?.length ? (
                                <div className="bg-dark-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                                    <ul className="list-disc ml-5 space-y-1 text-light-200">
                                        {data.benefits.map((b, idx) => (
                                            <li key={idx}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            {data.keyTechnologies?.length ? (
                                <div className="bg-dark-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Key Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.keyTechnologies.map((t, idx) => (
                                            <span key={idx} className="px-2 py-1 rounded bg-dark-300 text-sm">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}

                    {(data.growthOutlook || data.interviewDifficulty || data.notableFacts?.length) && (
                        <div className="bg-dark-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-3">Insights</h3>
                            {data.growthOutlook && <p className="mb-2 text-light-200">{data.growthOutlook}</p>}
                            {data.interviewDifficulty && (
                                <p className="text-sm text-light-300">Interview difficulty: {data.interviewDifficulty}</p>
                            )}
                            {data.notableFacts?.length ? (
                                <ul className="list-disc ml-5 mt-3 space-y-1 text-light-200">
                                    {data.notableFacts.map((f, idx) => (
                                        <li key={idx}>{f}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    )}

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


