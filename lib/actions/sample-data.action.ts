'use server';

import { db } from '@/firebase/admin';

// Function to add sample data for testing dashboard functionality
export async function addSampleData(userId: string) {
	try {
		// Add sample interviews
		const sampleInterviews = [
			{
				id: `sample-interview-1-${userId}`,
				userId: userId,
				role: 'Frontend Developer',
				type: 'Technical',
				techstack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
				level: 'Junior',
				questions: [
					'What is React and how does it work?',
					'Explain the difference between props and state',
					'How do you handle side effects in React?',
					'What is TypeScript and why use it?',
				],
				finalized: true,
				createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
			},
			{
				id: `sample-interview-2-${userId}`,
				userId: userId,
				role: 'Full Stack Developer',
				type: 'Mixed',
				techstack: ['Node.js', 'Express', 'MongoDB', 'React'],
				level: 'Senior',
				questions: [
					'Explain RESTful API design principles',
					'How do you handle authentication in a web application?',
					'Describe your experience with databases',
					'How do you ensure code quality in a team?',
				],
				finalized: true,
				createdAt: new Date(
					Date.now() - 14 * 24 * 60 * 60 * 1000
				).toISOString(), // 14 days ago
			},
			{
				id: `sample-interview-3-${userId}`,
				userId: userId,
				role: 'Backend Developer',
				type: 'Technical',
				techstack: ['Python', 'Django', 'PostgreSQL', 'Docker'],
				level: 'Intermediate',
				questions: [
					'Explain object-oriented programming concepts',
					'How do you handle database migrations?',
					'What is Docker and how do you use it?',
					'Describe your testing strategy',
				],
				finalized: true,
				createdAt: new Date(
					Date.now() - 21 * 24 * 60 * 60 * 1000
				).toISOString(), // 21 days ago
			},
			{
				id: `sample-interview-4-${userId}`,
				userId: userId,
				role: 'DevOps Engineer',
				type: 'Technical',
				techstack: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins'],
				level: 'Senior',
				questions: [
					'Explain CI/CD pipeline concepts',
					'How do you handle infrastructure as code?',
					'Describe your experience with cloud platforms',
					'How do you monitor application performance?',
				],
				finalized: false,
				createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
			},
		];

		// Add sample feedback
		const sampleFeedbacks = [
			{
				id: `sample-feedback-1-${userId}`,
				interviewId: `sample-interview-1-${userId}`,
				userId: userId,
				totalScore: 78,
				categoryScores: [
					{
						name: 'Communication Skills',
						score: 82,
						comment:
							'Clear articulation and well-structured responses. Good use of examples.',
					},
					{
						name: 'Technical Knowledge',
						score: 75,
						comment:
							'Solid understanding of React fundamentals. Could improve on advanced concepts.',
					},
					{
						name: 'Problem Solving',
						score: 80,
						comment:
							'Good analytical thinking and logical approach to problem-solving.',
					},
					{
						name: 'Cultural Fit',
						score: 85,
						comment:
							'Excellent cultural alignment and team collaboration mindset.',
					},
					{
						name: 'Confidence and Clarity',
						score: 70,
						comment:
							'Confident delivery but could be more concise in explanations.',
					},
				],
				strengths: [
					'Strong communication skills',
					'Good problem-solving approach',
					'Enthusiastic about learning',
					'Team-oriented mindset',
				],
				areasForImprovement: [
					'Deepen understanding of React internals',
					'Practice more complex technical scenarios',
					'Improve time management in explanations',
				],
				finalAssessment:
					'Strong candidate with good fundamentals. Shows potential for growth with proper mentorship. Recommended for junior-level position with opportunities for advancement.',
				createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
			},
			{
				id: `sample-feedback-2-${userId}`,
				interviewId: `sample-interview-2-${userId}`,
				userId: userId,
				totalScore: 85,
				categoryScores: [
					{
						name: 'Communication Skills',
						score: 88,
						comment:
							'Excellent communication with clear, concise explanations.',
					},
					{
						name: 'Technical Knowledge',
						score: 82,
						comment:
							'Strong technical foundation with good understanding of full-stack concepts.',
					},
					{
						name: 'Problem Solving',
						score: 87,
						comment:
							'Excellent problem-solving skills with systematic approach.',
					},
					{
						name: 'Cultural Fit',
						score: 83,
						comment: 'Good cultural fit with collaborative mindset.',
					},
					{
						name: 'Confidence and Clarity',
						score: 85,
						comment: 'Confident and clear in responses with good examples.',
					},
				],
				strengths: [
					'Excellent communication skills',
					'Strong technical knowledge',
					'Systematic problem-solving approach',
					'Good leadership potential',
				],
				areasForImprovement: [
					'Gain more experience with microservices architecture',
					'Improve knowledge of advanced database optimization',
				],
				finalAssessment:
					'Excellent candidate with strong technical and communication skills. Ready for senior-level responsibilities with potential for technical leadership roles.',
				createdAt: new Date(
					Date.now() - 14 * 24 * 60 * 60 * 1000
				).toISOString(),
			},
			{
				id: `sample-feedback-3-${userId}`,
				interviewId: `sample-interview-3-${userId}`,
				userId: userId,
				totalScore: 72,
				categoryScores: [
					{
						name: 'Communication Skills',
						score: 75,
						comment:
							'Good communication with room for improvement in technical explanations.',
					},
					{
						name: 'Technical Knowledge',
						score: 70,
						comment:
							'Solid Python knowledge but needs improvement in Django advanced features.',
					},
					{
						name: 'Problem Solving',
						score: 75,
						comment: 'Good problem-solving approach with logical thinking.',
					},
					{
						name: 'Cultural Fit',
						score: 78,
						comment: 'Good cultural fit with collaborative attitude.',
					},
					{
						name: 'Confidence and Clarity',
						score: 62,
						comment: 'Needs to build more confidence in technical discussions.',
					},
				],
				strengths: [
					'Good Python fundamentals',
					'Collaborative attitude',
					'Willingness to learn',
					'Logical thinking',
				],
				areasForImprovement: [
					'Improve Django framework knowledge',
					'Build confidence in technical discussions',
					'Practice system design concepts',
					'Enhance database optimization skills',
				],
				finalAssessment:
					'Promising candidate with good fundamentals. Needs mentorship and experience to reach intermediate level. Recommended for junior to mid-level position.',
				createdAt: new Date(
					Date.now() - 21 * 24 * 60 * 60 * 1000
				).toISOString(),
			},
		];

		// Add interviews to Firestore
		for (const interview of sampleInterviews) {
			await db.collection('interviews').doc(interview.id).set(interview);
		}

		// Add feedback to Firestore
		for (const feedback of sampleFeedbacks) {
			await db.collection('feedback').doc(feedback.id).set(feedback);
		}

		return {
			success: true,
			message: `Added ${sampleInterviews.length} interviews and ${sampleFeedbacks.length} feedback records for testing`,
		};
	} catch (error) {
		console.error('Error adding sample data:', error);
		return {
			success: false,
			message: 'Failed to add sample data',
		};
	}
}

// Function to clear sample data
export async function clearSampleData(userId: string) {
	try {
		// Delete sample interviews
		const interviewsSnapshot = await db
			.collection('interviews')
			.where('userId', '==', userId)
			.where('id', '>=', `sample-interview-1-${userId}`)
			.where('id', '<=', `sample-interview-4-${userId}`)
			.get();

		const batch = db.batch();
		interviewsSnapshot.docs.forEach((doc) => {
			batch.delete(doc.ref);
		});

		// Delete sample feedback
		const feedbackSnapshot = await db
			.collection('feedback')
			.where('userId', '==', userId)
			.where('id', '>=', `sample-feedback-1-${userId}`)
			.where('id', '<=', `sample-feedback-3-${userId}`)
			.get();

		feedbackSnapshot.docs.forEach((doc) => {
			batch.delete(doc.ref);
		});

		await batch.commit();

		return {
			success: true,
			message: 'Sample data cleared successfully',
		};
	} catch (error) {
		console.error('Error clearing sample data:', error);
		return {
			success: false,
			message: 'Failed to clear sample data',
		};
	}
}
