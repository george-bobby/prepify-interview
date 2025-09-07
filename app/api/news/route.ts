import { NextRequest, NextResponse } from 'next/server';

interface NewsApiResponse {
	articles: Array<{
		title: string;
		description: string;
		url: string;
		urlToImage: string;
		publishedAt: string;
		source: {
			name: string;
		};
	}>;
}

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Fallback news data when API is not available
const fallbackNews = [
	{
		id: '1',
		title: 'The Future of AI in Software Development',
		description:
			'Exploring how artificial intelligence is transforming the way we write, test, and deploy software applications.',
		url: 'https://example.com/ai-software-development',
		urlToImage: '/tech.svg',
		publishedAt: new Date().toISOString(),
		source: { name: 'Tech Insights' },
		category: 'technology',
	},
	{
		id: '2',
		title: 'Top 10 Interview Questions for Software Engineers',
		description:
			'Essential technical and behavioral questions that every software engineer should be prepared to answer.',
		url: 'https://example.com/interview-questions',
		urlToImage: '/profile.svg',
		publishedAt: new Date().toISOString(),
		source: { name: 'Career Guide' },
		category: 'interview',
	},
	{
		id: '3',
		title: 'Remote Work Best Practices for Developers',
		description:
			'Tips and strategies for maintaining productivity and work-life balance while working remotely.',
		url: 'https://example.com/remote-work-tips',
		urlToImage: '/globe.svg',
		publishedAt: new Date().toISOString(),
		source: { name: 'Workplace Insights' },
		category: 'career',
	},
	{
		id: '4',
		title: 'JavaScript Frameworks Comparison 2024',
		description:
			'A comprehensive comparison of React, Vue, Angular, and other popular JavaScript frameworks.',
		url: 'https://example.com/js-frameworks-2024',
		urlToImage: '/react.svg',
		publishedAt: new Date().toISOString(),
		source: { name: 'Dev Weekly' },
		category: 'programming',
	},
	{
		id: '5',
		title: 'Machine Learning Trends in 2024',
		description:
			'Latest developments and emerging trends in machine learning and artificial intelligence.',
		url: 'https://example.com/ml-trends-2024',
		urlToImage: '/robot.png',
		publishedAt: new Date().toISOString(),
		source: { name: 'AI Today' },
		category: 'ai',
	},
	{
		id: '6',
		title: 'Building Scalable Web Applications',
		description:
			'Architecture patterns and best practices for creating web applications that can handle millions of users.',
		url: 'https://example.com/scalable-web-apps',
		urlToImage: '/window.svg',
		publishedAt: new Date().toISOString(),
		source: { name: 'Architecture Weekly' },
		category: 'programming',
	},
];

export async function POST(request: NextRequest) {
	try {
		const { category, query } = await request.json();

		// If no API key is provided, return fallback data
		if (!NEWS_API_KEY) {
			console.log('No NEWS_API_KEY found, returning fallback data');

			let filteredNews = fallbackNews;

			if (category && category !== 'all') {
				filteredNews = fallbackNews.filter(
					(article) => article.category === category
				);
			}

			if (query) {
				filteredNews = filteredNews.filter(
					(article) =>
						article.title.toLowerCase().includes(query.toLowerCase()) ||
						article.description.toLowerCase().includes(query.toLowerCase())
				);
			}

			return NextResponse.json({
				articles: filteredNews,
				source: 'fallback',
			});
		}

		// Build query parameters for NewsAPI
		const queryParams = new URLSearchParams({
			apiKey: NEWS_API_KEY,
			language: 'en',
			sortBy: 'publishedAt',
			pageSize: '20',
		});

		// Add category-specific keywords
		let searchQuery = '';
		switch (category) {
			case 'technology':
				searchQuery = 'technology software programming development';
				break;
			case 'interview':
				searchQuery = 'interview tips career job hiring';
				break;
			case 'career':
				searchQuery = 'career development professional growth';
				break;
			case 'programming':
				searchQuery = 'programming coding software development';
				break;
			case 'ai':
				searchQuery = 'artificial intelligence machine learning AI';
				break;
			default:
				searchQuery = 'technology programming interview career';
		}

		// Add user search query if provided
		if (query) {
			searchQuery = `${searchQuery} ${query}`;
		}

		queryParams.append('q', searchQuery);

		// Fetch from NewsAPI
		const response = await fetch(
			`${NEWS_API_BASE_URL}/everything?${queryParams}`
		);

		if (!response.ok) {
			throw new Error(`NewsAPI error: ${response.status}`);
		}

		const data: NewsApiResponse = await response.json();

		// Transform the data to include our custom fields
		const transformedArticles = data.articles.map((article, index) => ({
			id: `news-${index}`,
			title: article.title,
			description: article.description,
			url: article.url,
			urlToImage: article.urlToImage,
			publishedAt: article.publishedAt,
			source: article.source,
			category: category || 'technology',
		}));

		return NextResponse.json({
			articles: transformedArticles,
			source: 'newsapi',
		});
	} catch (error) {
		console.error('Error fetching news:', error);

		// Return fallback data on error
		return NextResponse.json({
			articles: fallbackNews.slice(0, 6),
			source: 'fallback',
			error: 'Failed to fetch live news, showing sample data',
		});
	}
}

