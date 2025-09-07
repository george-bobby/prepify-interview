import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

type Insights = {
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
	glassdoor?: any | null;
};

export async function POST(request: NextRequest) {
	try {
		const { company } = await request.json();
		if (!company || typeof company !== 'string') {
			return NextResponse.json({ error: 'Missing company' }, { status: 400 });
		}

		// Enhanced prompt for better results
		const prompt = `You are a comprehensive company research assistant. Provide detailed information about ${company} in the following JSON format:

{
  "name": "${company}",
  "website": "official website URL",
  "headquarters": "city, state/country",
  "foundedYear": year_as_number,
  "size": "employee count range (e.g., '10,000-50,000 employees')",
  "industry": "primary industry",
  "averageSalary": {
    "overall": "overall salary range in USD",
    "byRole": [
      {"role": "Software Engineer", "salaryRange": "$120k-180k", "median": "$150k"},
      {"role": "Product Manager", "salaryRange": "$140k-200k", "median": "$170k"}
    ]
  },
  "benefits": ["health insurance", "401k matching", "flexible work", "stock options"],
  "culture": ["innovation-focused", "collaborative", "fast-paced", "data-driven"],
  "interviewDifficulty": "Medium to Hard",
  "growthOutlook": "brief growth outlook description",
  "keyTechnologies": ["primary technologies used"],
  "notableFacts": ["interesting facts about the company"],
  "sources": [{"name": "source name", "url": "optional url"}]
}

IMPORTANT: 
- Provide real, accurate information about ${company}
- Include specific salary ranges based on known market data
- List actual technologies the company uses
- Include real benefits and culture aspects
- Output ONLY valid JSON, no markdown or explanations
- If you don't know specific details, provide reasonable estimates based on company size and industry`;

		const result = await generateText({
			model: google('gemini-1.5-flash'),
			prompt,
		});

		let insights: Insights;
		try {
			insights = JSON.parse(result.text);
		} catch {
			// Fallback minimal object
			insights = { name: company } as Insights;
		}

		// Optional Glassdoor enrichment if configured
		const glassdoorPartnerId = process.env.GLASSDOOR_PARTNER_ID;
		const glassdoorKey = process.env.GLASSDOOR_PARTNER_KEY;
		let glassdoorPayload: any = null;
		if (glassdoorPartnerId && glassdoorKey) {
			try {
				const userAgent = 'PrepifyBot/1.0 (+https://prepify.app)';
				const url = `http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=${encodeURIComponent(
					glassdoorPartnerId
				)}&t.k=${encodeURIComponent(
					glassdoorKey
				)}&userip=0.0.0.0&useragent=${encodeURIComponent(
					userAgent
				)}&action=employers&q=${encodeURIComponent(company)}`;
				const res = await fetch(url, { cache: 'no-store' });
				if (res.ok) {
					const gd = await res.json();
					const emp = gd?.response?.employers?.[0];
					if (emp) {
						glassdoorPayload = {
							rating: Number(emp.overallRating) || null,
							workLifeBalanceRating: Number(emp.workLifeBalanceRating) || null,
							compensationAndBenefitsRating:
								Number(emp.compensationAndBenefitsRating) || null,
							cultureAndValuesRating:
								Number(emp.cultureAndValuesRating) || null,
							careerOpportunitiesRating:
								Number(emp.careerOpportunitiesRating) || null,
							featuredReview: emp.featuredReview
								? {
										headline: emp.featuredReview.headline,
										pros: emp.featuredReview.pros,
										cons: emp.featuredReview.cons,
										jobTitle: emp.featuredReview.jobTitle,
								  }
								: null,
							sourceAttributionHtml:
								"<a href='http://www.glassdoor.co.in/index.htm'>powered by <img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search' /></a>",
						};
					}
				}
			} catch (err) {
				// ignore enrichment errors
			}
		}

		const combined: Insights = {
			...insights,
			glassdoor: glassdoorPayload,
		} as Insights;

		return NextResponse.json({ insights: combined });
	} catch (err) {
		return NextResponse.json(
			{ error: 'Failed to generate insights' },
			{ status: 500 }
		);
	}
}
