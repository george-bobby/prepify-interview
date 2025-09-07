"use server";

export interface LeetCodeProblem {
    id: number;
    title: string;
    titleSlug: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topicTags: string[];
    likes: number;
    dislikes: number;
    acceptance: string;
    description?: string;
    exampleTestcases?: string;
    constraints?: string;
    similarQuestions?: string;
}

export interface LeetCodeProblemsResponse {
    problems: LeetCodeProblem[];
    total: number;
}

export interface DailyChallenge {
    date: string;
    problem: LeetCodeProblem;
}

const LEETCODE_API_BASE = 'https://leetcode-api-pied.vercel.app';

export async function fetchLeetCodeProblems(limit: number = 50): Promise<LeetCodeProblemsResponse> {
    try {
        const response = await fetch(`${LEETCODE_API_BASE}/problems`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch problems: ${response.status}`);
        }

        const data = await response.json();
        
        // Take only the requested number of problems
        const problems = data.slice(0, limit).map((problem: any) => ({
            id: problem.id,
            title: problem.title,
            titleSlug: problem.titleSlug,
            difficulty: problem.difficulty,
            topicTags: problem.topicTags || [],
            likes: problem.likes || 0,
            dislikes: problem.dislikes || 0,
            acceptance: problem.acceptance || '0%'
        }));

        return {
            problems,
            total: data.length
        };
    } catch (error) {
        console.error('Error fetching LeetCode problems:', error);
        throw new Error('Failed to fetch LeetCode problems');
    }
}

export async function fetchProblemsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard', limit: number = 20): Promise<LeetCodeProblem[]> {
    try {
        const response = await fetch(`${LEETCODE_API_BASE}/problems`, {
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch problems: ${response.status}`);
        }

        const data = await response.json();
        
        const filteredProblems = data
            .filter((problem: any) => problem.difficulty === difficulty)
            .slice(0, limit)
            .map((problem: any) => ({
                id: problem.id,
                title: problem.title,
                titleSlug: problem.titleSlug,
                difficulty: problem.difficulty,
                topicTags: problem.topicTags || [],
                likes: problem.likes || 0,
                dislikes: problem.dislikes || 0,
                acceptance: problem.acceptance || '0%'
            }));

        return filteredProblems;
    } catch (error) {
        console.error('Error fetching problems by difficulty:', error);
        throw new Error('Failed to fetch problems by difficulty');
    }
}

export async function fetchDailyChallenge(): Promise<DailyChallenge> {
    try {
        const response = await fetch(`${LEETCODE_API_BASE}/daily`, {
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch daily challenge: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            date: data.date,
            problem: {
                id: data.id,
                title: data.title,
                titleSlug: data.titleSlug,
                difficulty: data.difficulty,
                topicTags: data.topicTags || [],
                likes: data.likes || 0,
                dislikes: data.dislikes || 0,
                acceptance: data.acceptance || '0%'
            }
        };
    } catch (error) {
        console.error('Error fetching daily challenge:', error);
        throw new Error('Failed to fetch daily challenge');
    }
}

export async function fetchRandomProblem(): Promise<LeetCodeProblem> {
    try {
        const response = await fetch(`${LEETCODE_API_BASE}/random`, {
            cache: 'no-store' // Always fetch fresh for random
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch random problem: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            id: data.id,
            title: data.title,
            titleSlug: data.titleSlug,
            difficulty: data.difficulty,
            topicTags: data.topicTags || [],
            likes: data.likes || 0,
            dislikes: data.dislikes || 0,
            acceptance: data.acceptance || '0%'
        };
    } catch (error) {
        console.error('Error fetching random problem:', error);
        throw new Error('Failed to fetch random problem');
    }
}

export async function searchProblems(query: string): Promise<LeetCodeProblem[]> {
    try {
        const response = await fetch(`${LEETCODE_API_BASE}/search?query=${encodeURIComponent(query)}`, {
            next: { revalidate: 1800 } // Cache for 30 minutes
        });

        if (!response.ok) {
            throw new Error(`Failed to search problems: ${response.status}`);
        }

        const data = await response.json();
        
        return data.map((problem: any) => ({
            id: problem.id,
            title: problem.title,
            titleSlug: problem.titleSlug,
            difficulty: problem.difficulty,
            topicTags: problem.topicTags || [],
            likes: problem.likes || 0,
            dislikes: problem.dislikes || 0,
            acceptance: problem.acceptance || '0%'
        }));
    } catch (error) {
        console.error('Error searching problems:', error);
        throw new Error('Failed to search problems');
    }
}

export function getLeetCodeProblemUrl(titleSlug: string): string {
    return `https://leetcode.com/problems/${titleSlug}/`;
}
