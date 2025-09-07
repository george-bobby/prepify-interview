import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const apiKey = process.env.SERPAPI_API_KEY;

		return NextResponse.json({
			configured: !!apiKey,
			message: apiKey
				? 'SerpAPI key is configured'
				: 'SerpAPI key is not configured',
		});
	} catch (error) {
		console.error('Error checking SerpAPI configuration:', error);
		return NextResponse.json(
			{ configured: false, message: 'Error checking configuration' },
			{ status: 500 }
		);
	}
}
