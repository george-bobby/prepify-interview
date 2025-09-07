import { NextRequest, NextResponse } from 'next/server';
import { getJobTitleSuggestions } from '@/lib/actions/jobs.action';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('q');

		if (!query || query.length < 2) {
			return NextResponse.json({
				success: true,
				suggestions: [],
			});
		}

		const result = await getJobTitleSuggestions(query);
		return NextResponse.json(result);
	} catch (error) {
		console.error('Error getting job title suggestions:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to get suggestions', suggestions: [] },
			{ status: 500 }
		);
	}
}
