// LeetCode utility functions that can be used on both client and server

export function getLeetCodeProblemUrl(titleSlug: string): string {
	if (!titleSlug) {
		console.error('titleSlug is undefined or empty');
		return `https://leetcode.com/problems/two-sum/`; // Return a default problem URL
	}
	return `https://leetcode.com/problems/${titleSlug}/`;
}
