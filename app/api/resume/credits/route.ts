import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { interviewService } from '@/lib/firebase/interview-service';

export async function GET(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const [interviewCredits, resumeCredits] = await Promise.all([
			interviewService.getUserCredits(user.id),
			interviewService.getResumeCredits(user.id),
		]);

		return NextResponse.json({ interviewCredits, resumeCredits });
	} catch (error) {
		console.error('Error fetching credits:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch credits' },
			{ status: 500 }
		);
	}
}
