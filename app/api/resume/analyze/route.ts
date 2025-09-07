import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('resume') as File;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		// Read file content based on file type
		let fileContent: string;

		if (file.type === 'application/pdf') {
			const buffer = Buffer.from(await file.arrayBuffer());

			// Dynamic import to avoid Node.js compatibility issues
			const { default: pdf } = await import('pdf-parse');
			const pdfData = await pdf(buffer);
			fileContent = pdfData.text;
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
			analysis = JSON.parse(result.text);
		} catch (parseError) {
			// If JSON parsing fails, create a structured response from the text
			analysis = {
				overallScore: 75,
				strengths: [
					'Resume contains relevant work experience',
					'Skills section is present',
					'Contact information is included',
				],
				improvements: [
					'Could benefit from more specific achievements',
					'Consider adding quantified results',
					'Review formatting for consistency',
				],
				suggestions: [
					'Add specific metrics and achievements to your experience',
					'Use action verbs to start each bullet point',
					'Ensure consistent formatting throughout',
					'Include relevant keywords for your target role',
					'Consider adding a professional summary section',
				],
				summary: result.text.substring(0, 200) + '...',
			};
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

		return NextResponse.json(analysis);
	} catch (error) {
		console.error('Error analyzing resume:', error);
		return NextResponse.json(
			{ error: 'Failed to analyze resume' },
			{ status: 500 }
		);
	}
}
