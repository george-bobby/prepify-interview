import { NextRequest, NextResponse } from 'next/server';
import { getJson } from 'serpapi';
import { saveJobSearch, findSimilarSearch } from '@/lib/actions/jobs.action';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('q');
		const location = searchParams.get('location');
		const jobType = searchParams.get('job_type');
		const experienceLevel = searchParams.get('experience_level');
		const datePosted = searchParams.get('date_posted');
		const salaryRange = searchParams.get('salary_range');

		if (!query) {
			return NextResponse.json(
				{ error: 'Job title query is required' },
				{ status: 400 }
			);
		}

		const searchQuery: JobSearchParams = {
			query,
			location: location || '',
			jobType: jobType || '',
			experienceLevel: experienceLevel || '',
			datePosted: datePosted || '',
			salaryRange: salaryRange || '',
		};

		// Check if we have a recent similar search
		const cachedResult = await findSimilarSearch(searchQuery);
		if (cachedResult.success && cachedResult.search) {
			console.log('Returning cached search results');
			return NextResponse.json({
				success: true,
				jobs: cachedResult.search.results,
				total: cachedResult.search.results.length,
				search_parameters: searchQuery,
				cached: true,
				cached_at: cachedResult.search.createdAt,
			});
		}

		// Check if SERPAPI_API_KEY is set
		const apiKey = process.env.SERPAPI_API_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{
					error:
						'SERPAPI_API_KEY not configured. Please add your SerpAPI key to environment variables.',
				},
				{ status: 500 }
			);
		}

		// Build search parameters for SerpAPI
		const searchQuery_serpapi = `${query}${location ? ` in ${location}` : ''}`;

		const searchParams_serpapi: any = {
			engine: 'google_jobs',
			api_key: apiKey,
			q: searchQuery_serpapi,
			hl: 'en',
			gl: 'us',
		};

		// Add optional filters
		if (location) {
			searchParams_serpapi.location = location;
		}

		if (datePosted) {
			const dateMap: { [key: string]: string } = {
				'today': 'today',
				'3days': '3days',
				'week': 'week',
				'month': 'month',
			};
			searchParams_serpapi.date_posted = dateMap[datePosted] || datePosted;
		}

		if (jobType && jobType !== '') {
			const typeMap: { [key: string]: string } = {
				FULLTIME: 'FULLTIME',
				PARTTIME: 'PARTTIME',
				CONTRACTOR: 'CONTRACTOR',
				INTERN: 'INTERN',
			};
			searchParams_serpapi.chips = `employment_type:${
				typeMap[jobType] || jobType
			}`;
		}

		console.log('SerpAPI search parameters:', searchParams_serpapi);

		// Make the API call to SerpAPI
		const response = await getJson(searchParams_serpapi);

		if (!response) {
			throw new Error('No response from SerpAPI');
		}

		// Extract job results
		const jobs = response.jobs_results || [];

		// Transform the data to our desired format
		const transformedJobs: Job[] = jobs.map((job: any) => ({
			id:
				job.job_id ||
				`job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			title: job.title || 'No Title',
			company: job.company_name || 'Unknown Company',
			location: job.location || location || 'Location not specified',
			description: job.description || 'No description available',
			salary: job.detected_extensions?.salary || job.salary_range,
			employment_type: job.detected_extensions?.schedule || job.schedule_type,
			posted_at: job.detected_extensions?.posted_at || job.posted_at,
			apply_link: job.apply_options?.[0]?.link || job.share_link,
			thumbnail: job.thumbnail,
			via: job.via || 'Google Jobs',
			searchQuery: searchQuery_serpapi,
		}));

		// Save search results to database for future caching
		try {
			await saveJobSearch(searchQuery, transformedJobs);
		} catch (saveError) {
			console.error('Failed to save job search, but continuing:', saveError);
			// Don't fail the request if saving fails
		}

		return NextResponse.json({
			success: true,
			jobs: transformedJobs,
			total: transformedJobs.length,
			search_parameters: searchQuery,
			cached: false,
		});
	} catch (error) {
		console.error('Job search error:', error);

		// Provide more specific error messages
		let errorMessage = 'Failed to search for jobs';
		let statusCode = 500;

		if (error instanceof Error) {
			if (error.message.includes('API key')) {
				errorMessage =
					'Invalid API key. Please check your SerpAPI configuration.';
				statusCode = 401;
			} else if (
				error.message.includes('quota') ||
				error.message.includes('limit')
			) {
				errorMessage = 'API quota exceeded. Please try again later.';
				statusCode = 429;
			} else if (error.message.includes('timeout')) {
				errorMessage = 'Search request timed out. Please try again.';
				statusCode = 408;
			} else {
				errorMessage = error.message;
			}
		}

		return NextResponse.json(
			{
				error: errorMessage,
				details: error instanceof Error ? error.message : 'Unknown error',
				success: false,
			},
			{ status: statusCode }
		);
	}
}
