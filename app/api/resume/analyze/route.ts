import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { interviewService } from '@/lib/firebase/interview-service';

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Ensure user has resume credits (auto-renews monthly)
		const credits = await interviewService.getResumeCredits(user.id);
		if (credits <= 0) {
			return NextResponse.json(
				{ error: 'No resume review credits remaining' },
				{ status: 402 }
			);
		}

		const formData = await request.formData();
		const file = formData.get('resume') as File;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		// Read file content based on file type
		let fileContent: string;

		if (file.type === 'application/pdf') {
			try {
				const buffer = Buffer.from(await file.arrayBuffer());

				// Try multiple PDF parsing approaches
				let pdfData;
				try {
					// First try: Use pdf-parse with require
					const pdf = require('pdf-parse');
					pdfData = await pdf(buffer);
				} catch (parseError) {
					console.warn(
						'pdf-parse failed, trying alternative approach:',
						parseError
					);
					// Alternative: Basic text extraction (fallback)
					const textContent = buffer.toString('utf8');
					pdfData = { text: textContent };
				}

				fileContent = pdfData.text;

				// If no text extracted, return error
				if (!fileContent || fileContent.trim().length === 0) {
					return NextResponse.json(
						{
							error:
								'Could not extract text from PDF. Please ensure the PDF contains readable text and try again.',
						},
						{ status: 400 }
					);
				}
			} catch (pdfError) {
				console.error('PDF parsing error:', pdfError);
				return NextResponse.json(
					{
						error:
							'Failed to parse PDF file. Please try uploading a different format or ensure the PDF is not corrupted.',
					},
					{ status: 400 }
				);
			}
		} else {
			fileContent = await file.text();
		}

		// Generate AI analysis using Gemini
		const result = await generateText({
			model: google('gemini-1.5-flash'),
			prompt: `Analyze the following resume and provide comprehensive feedback. Please respond with a JSON object containing the following structure:

{
  "overallScore": number (0-100),
  "strengths": string[],
  "improvements": string[],
  "suggestions": string[],
  "summary": string
}

Focus on:
1. Content quality and relevance
2. Structure and formatting
3. Skills and experience presentation
4. Keywords and ATS optimization
5. Action verbs and impact statements
6. Contact information and professional presentation

Resume content:
${fileContent}

Provide specific, actionable feedback that will help improve the resume's effectiveness.`,
		});

		// Parse the AI response
		let analysis;
		try {
			// First try to parse as JSON directly
			analysis = JSON.parse(result.text);
		} catch (parseError) {
			console.log(
				'Direct JSON parsing failed, trying to extract JSON from text'
			);
			console.log('Gemini response:', result.text);

			try {
				// Try to extract JSON from the response text
				const jsonMatch = result.text.match(/\{[\s\S]*\}/);
				if (jsonMatch) {
					analysis = JSON.parse(jsonMatch[0]);
				} else {
					throw new Error('No JSON found in response');
				}
			} catch (extractError) {
				console.log('JSON extraction also failed, using intelligent parsing');

				// If JSON parsing fails completely, try to extract data intelligently
				const text = result.text;

				// Try to extract score
				const scoreMatch = text.match(/(?:score|rating).*?(\d+)/i);
				const overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 75;

				// Try to extract sections
				const strengthsMatch = text.match(
					/strengths?[:\s]*(.*?)(?=improvements?|suggestions?|summary|$)/gi
				);
				const improvementsMatch = text.match(
					/improvements?[:\s]*(.*?)(?=strengths?|suggestions?|summary|$)/gi
				);
				const suggestionsMatch = text.match(
					/suggestions?[:\s]*(.*?)(?=strengths?|improvements?|summary|$)/gi
				);

				analysis = {
					overallScore,
					strengths: strengthsMatch
						? strengthsMatch[1]
								.split(/[,\n]/)
								.map((s) => s.trim())
								.filter((s) => s)
						: [
								'Resume contains relevant work experience',
								'Skills section is present',
								'Contact information is included',
						  ],
					improvements: improvementsMatch
						? improvementsMatch[1]
								.split(/[,\n]/)
								.map((s) => s.trim())
								.filter((s) => s)
						: [
								'Could benefit from more specific achievements',
								'Consider adding quantified results',
								'Review formatting for consistency',
						  ],
					suggestions: suggestionsMatch
						? suggestionsMatch[1]
								.split(/[,\n]/)
								.map((s) => s.trim())
								.filter((s) => s)
						: [
								'Add specific metrics and achievements to your experience',
								'Use action verbs to start each bullet point',
								'Ensure consistent formatting throughout',
								'Include relevant keywords for your target role',
								'Consider adding a professional summary section',
						  ],
					summary: text.substring(0, 200) + '...',
				};
			}
		}

		// Validate the response structure
		if (
			!analysis.overallScore ||
			!analysis.strengths ||
			!analysis.improvements ||
			!analysis.suggestions ||
			!analysis.summary
		) {
			throw new Error('Invalid analysis structure');
		}

		// Deduct a resume review credit after successful analysis
		await interviewService.deductResumeCredit(user.id);

		return NextResponse.json(analysis);
	} catch (error) {
		console.error('Error analyzing resume:', error);
		return NextResponse.json(
			{ error: 'Failed to analyze resume' },
			{ status: 500 }
		);
	}
}
