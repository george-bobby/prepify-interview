import { generateObject, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import {
	questionGenerationSchema,
	responseEvaluationSchema,
	interviewSummarySchema,
	type InterviewConfig,
	type QuestionGeneration,
	type ResponseEvaluation,
	type InterviewSummary,
} from './schemas/interview';

export class GeminiInterviewEngine {
	private model = google('gemini-2.0-flash-001');

	/**
	 * Generate interview questions based on configuration
	 */
	async generateQuestions(config: InterviewConfig, questionCount: number = 5): Promise<QuestionGeneration> {
		const prompt = this.buildQuestionPrompt(config, questionCount);

		const result = await generateObject({
			model: this.model,
			schema: questionGenerationSchema,
			prompt,
		});

		return result.object;
	}

	/**
	 * Evaluate a candidate's response to a question
	 */
	async evaluateResponse(
		question: string,
		answer: string,
		config: InterviewConfig,
		context?: string
	): Promise<ResponseEvaluation> {
		const prompt = this.buildEvaluationPrompt(question, answer, config, context);

		const result = await generateObject({
			model: this.model,
			schema: responseEvaluationSchema,
			prompt,
		});

		return result.object;
	}

	/**
	 * Generate a follow-up question based on the candidate's response
	 */
	async generateFollowUp(
		originalQuestion: string,
		answer: string,
		config: InterviewConfig
	): Promise<string> {
		const prompt = `Based on the candidate's response, generate a relevant follow-up question.

Original Question: ${originalQuestion}
Candidate's Answer: ${answer}
Interview Type: ${config.mode}
Role: ${config.role}
Level: ${config.level}

Generate a follow-up question that:
- Digs deeper into their response
- Tests their understanding further
- Is appropriate for the role and level
- Maintains professional interview tone

Follow-up Question:`;

		const result = await generateText({
			model: this.model,
			prompt,
		});

		return result.text.trim();
	}

	/**
	 * Generate final interview summary and feedback
	 */
	async generateSummary(
		responses: Array<{
			question: string;
			answer: string;
			score: number;
			feedback: string;
		}>,
		config: InterviewConfig,
		duration: string
	): Promise<InterviewSummary> {
		const prompt = this.buildSummaryPrompt(responses, config, duration);

		const result = await generateObject({
			model: this.model,
			schema: interviewSummarySchema,
			prompt,
		});

		return result.object;
	}

	/**
	 * Generate an AI interviewer response during conversation
	 */
	async generateInterviewerResponse(
		context: string,
		lastCandidateResponse?: string,
		nextQuestion?: string
	): Promise<string> {
		const prompt = `You are a professional AI interviewer. Generate a natural, conversational response.

Context: ${context}
${lastCandidateResponse ? `Last candidate response: ${lastCandidateResponse}` : ''}
${nextQuestion ? `Next question to ask: ${nextQuestion}` : ''}

Generate a professional, warm response that:
- Acknowledges the candidate's response (if provided)
- Transitions smoothly to the next question (if provided)
- Maintains a conversational, encouraging tone
- Keeps the response concise (1-2 sentences)

Response:`;

		const result = await generateText({
			model: this.model,
			prompt,
		});

		return result.text.trim();
	}

	private buildQuestionPrompt(config: InterviewConfig, questionCount: number): string {
		let prompt = `Generate ${questionCount} interview questions for a ${config.role} position at ${config.level} level.

Interview Type: ${config.mode}
`;

		if (config.mode === 'technical' || config.mode === 'mixed') {
			prompt += `Tech Stack: ${config.techStack.join(', ')}
`;
			if ('focusAreas' in config) {
				prompt += `Focus Areas: ${config.focusAreas.join(', ')}
`;
			}
		}

		if (config.mode === 'behavioral') {
			prompt += `Focus Areas: ${config.focusAreas.join(', ')}
`;
		}

		prompt += `
Requirements:
- Questions should be appropriate for ${config.level} level
- Mix of difficulty levels (but appropriate for the role level)
- Clear, professional language
- Avoid overly complex or trick questions
- For technical questions: focus on practical knowledge and problem-solving
- For behavioral questions: use STAR method format expectations
- Estimate total interview duration

Return the questions in the specified JSON format.`;

		return prompt;
	}

	private buildEvaluationPrompt(
		question: string,
		answer: string,
		config: InterviewConfig,
		context?: string
	): string {
		return `Evaluate this interview response:

Question: ${question}
Answer: ${answer}
Interview Type: ${config.mode}
Role: ${config.role}
Level: ${config.level}
${context ? `Additional Context: ${context}` : ''}

Evaluation Criteria:
- Technical accuracy (for technical questions)
- Communication clarity
- Depth of understanding
- Practical experience demonstration
- Problem-solving approach
- Cultural fit indicators

Provide:
- Score (0-10)
- Constructive feedback
- Specific strengths demonstrated
- Areas for improvement
- Whether to continue with follow-up
- Optional follow-up question

Be fair but thorough in evaluation.`;
	}

	private buildSummaryPrompt(
		responses: Array<{
			question: string;
			answer: string;
			score: number;
			feedback: string;
		}>,
		config: InterviewConfig,
		duration: string
	): string {
		const responseSummary = responses
			.map((r, i) => `Q${i + 1}: ${r.question}\nA${i + 1}: ${r.answer}\nScore: ${r.score}/10\n`)
			.join('\n');

		return `Generate a comprehensive interview summary:

Interview Details:
- Role: ${config.role}
- Level: ${config.level}
- Type: ${config.mode}
- Duration: ${duration}
- Questions Answered: ${responses.length}

Responses:
${responseSummary}

Generate a professional summary including:
- Overall score (average with contextual adjustment)
- Category-specific scores and feedback
- Key strengths demonstrated
- Areas needing improvement
- Specific recommendations for growth
- Overall assessment and feedback
- Professional, constructive tone throughout`;
	}
}

// Singleton instance
export const geminiInterviewEngine = new GeminiInterviewEngine();
