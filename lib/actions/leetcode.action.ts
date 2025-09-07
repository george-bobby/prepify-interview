'use server';

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

export interface CompanyQuestion {
	title: string;
	link: string;
}

export interface CompanyQuestions {
	company: string;
	questions: CompanyQuestion[];
}

const LEETCODE_API_BASE = 'https://leetcode-api-pied.vercel.app';

export async function fetchLeetCodeProblems(
	limit: number = 10
): Promise<LeetCodeProblemsResponse> {
	try {
		const response = await fetch(`${LEETCODE_API_BASE}/problems`, {
			next: { revalidate: 3600 }, // Cache for 1 hour
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch problems: ${response.status}`);
		}

		const data = await response.json();

		// Take only the requested number of problems
		const problems = data.slice(0, limit).map((problem: any) => {
			return {
				id: problem.id,
				title: problem.title,
				titleSlug:
					problem.titleSlug ||
					problem.slug ||
					problem.title?.toLowerCase().replace(/\s+/g, '-'),
				difficulty: problem.difficulty,
				topicTags: problem.topicTags || [],
				likes: problem.likes || 0,
				dislikes: problem.dislikes || 0,
				acceptance: problem.acceptance || '0%',
			};
		});

		return {
			problems,
			total: data.length,
		};
	} catch (error) {
		console.error('Error fetching LeetCode problems:', error);
		throw new Error('Failed to fetch LeetCode problems');
	}
}

export async function fetchProblemsByDifficulty(
	difficulty: 'Easy' | 'Medium' | 'Hard',
	limit: number = 20
): Promise<LeetCodeProblem[]> {
	try {
		const response = await fetch(`${LEETCODE_API_BASE}/problems`, {
			next: { revalidate: 3600 },
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
				titleSlug:
					problem.titleSlug ||
					problem.slug ||
					problem.title?.toLowerCase().replace(/\s+/g, '-'),
				difficulty: problem.difficulty,
				topicTags: problem.topicTags || [],
				likes: problem.likes || 0,
				dislikes: problem.dislikes || 0,
				acceptance: problem.acceptance || '0%',
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
			next: { revalidate: 3600 },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch daily challenge: ${response.status}`);
		}

		const data = await response.json();

		console.log('Daily challenge API response:', data);

		// If the API response is incomplete, use fallback values
		return {
			date: data.date || new Date().toISOString().split('T')[0],
			problem: {
				id: data.id || data.questionId || 1,
				title: data.title || data.questionTitle || 'Two Sum',
				titleSlug:
					data.titleSlug ||
					data.slug ||
					data.questionSlug ||
					data.title?.toLowerCase().replace(/\s+/g, '-') ||
					'two-sum',
				difficulty: data.difficulty || 'Easy',
				topicTags: data.topicTags || data.tags || ['Array', 'Hash Table'],
				likes: data.likes || data.upvotes || 0,
				dislikes: data.dislikes || data.downvotes || 0,
				acceptance: data.acceptance || data.acceptanceRate || '0%',
			},
		};
	} catch (error) {
		console.error('Error fetching daily challenge:', error);
		// Return a fallback daily challenge
		return {
			date: new Date().toISOString().split('T')[0],
			problem: {
				id: 1,
				title: 'Two Sum',
				titleSlug: 'two-sum',
				difficulty: 'Easy',
				topicTags: ['Array', 'Hash Table'],
				likes: 42000,
				dislikes: 1200,
				acceptance: '49.1%',
			},
		};
	}
}

export async function fetchRandomProblem(): Promise<LeetCodeProblem> {
	try {
		const response = await fetch(`${LEETCODE_API_BASE}/random`, {
			cache: 'no-store', // Always fetch fresh for random
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch random problem: ${response.status}`);
		}

		const data = await response.json();

		console.log('Random problem API response:', data);

		return {
			id: data.id || data.questionId || Math.floor(Math.random() * 3000) + 1,
			title: data.title || data.questionTitle || 'Add Two Numbers',
			titleSlug:
				data.titleSlug ||
				data.slug ||
				data.questionSlug ||
				data.title?.toLowerCase().replace(/\s+/g, '-') ||
				'add-two-numbers',
			difficulty:
				data.difficulty ||
				['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
			topicTags: data.topicTags || data.tags || ['Linked List', 'Math'],
			likes: data.likes || data.upvotes || Math.floor(Math.random() * 10000),
			dislikes:
				data.dislikes || data.downvotes || Math.floor(Math.random() * 1000),
			acceptance:
				data.acceptance ||
				data.acceptanceRate ||
				`${Math.floor(Math.random() * 80) + 20}%`,
		};
	} catch (error) {
		console.error('Error fetching random problem:', error);
		// Return a fallback random problem
		const randomProblems = [
			{
				id: 2,
				title: 'Add Two Numbers',
				titleSlug: 'add-two-numbers',
				difficulty: 'Medium' as const,
				topicTags: ['Linked List', 'Math', 'Recursion'],
				likes: 18500,
				dislikes: 3400,
				acceptance: '37.8%',
			},
			{
				id: 3,
				title: 'Longest Substring Without Repeating Characters',
				titleSlug: 'longest-substring-without-repeating-characters',
				difficulty: 'Medium' as const,
				topicTags: ['Hash Table', 'String', 'Sliding Window'],
				likes: 28000,
				dislikes: 1200,
				acceptance: '33.8%',
			},
			{
				id: 4,
				title: 'Median of Two Sorted Arrays',
				titleSlug: 'median-of-two-sorted-arrays',
				difficulty: 'Hard' as const,
				topicTags: ['Array', 'Binary Search', 'Divide and Conquer'],
				likes: 19000,
				dislikes: 2100,
				acceptance: '35.4%',
			},
		];
		return randomProblems[Math.floor(Math.random() * randomProblems.length)];
	}
}

export async function searchProblems(
	query: string
): Promise<LeetCodeProblem[]> {
	try {
		const response = await fetch(
			`${LEETCODE_API_BASE}/search?query=${encodeURIComponent(query)}`,
			{
				next: { revalidate: 1800 }, // Cache for 30 minutes
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to search problems: ${response.status}`);
		}

		const data = await response.json();

		return data.map((problem: any) => ({
			id: problem.id,
			title: problem.title,
			titleSlug:
				problem.titleSlug ||
				problem.slug ||
				problem.title?.toLowerCase().replace(/\s+/g, '-'),
			difficulty: problem.difficulty,
			topicTags: problem.topicTags || [],
			likes: problem.likes || 0,
			dislikes: problem.dislikes || 0,
			acceptance: problem.acceptance || '0%',
		}));
	} catch (error) {
		console.error('Error searching problems:', error);
		throw new Error('Failed to search problems');
	}
}

const COMPANY_QUESTIONS: CompanyQuestions[] = [
	{
		company: 'Amazon',
		questions: [
			{ title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum/' },
			{
				title: 'Add Two Numbers',
				link: 'https://leetcode.com/problems/add-two-numbers/',
			},
			{
				title: 'Longest Substring Without Repeating Characters',
				link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
			},
			{
				title: 'Valid Parentheses',
				link: 'https://leetcode.com/problems/valid-parentheses/',
			},
			{
				title: 'Merge Two Sorted Lists',
				link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
			},
			{
				title: 'Best Time to Buy and Sell Stock',
				link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
			},
			{
				title: 'Binary Tree Level Order Traversal',
				link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
			},
			{
				title: 'Search in Rotated Sorted Array',
				link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
			},
			{
				title: 'Find Minimum in Rotated Sorted Array',
				link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
			},
			{
				title: 'Word Ladder',
				link: 'https://leetcode.com/problems/word-ladder/',
			},
		],
	},
	{
		company: 'Google',
		questions: [
			{
				title: 'Word Ladder II',
				link: 'https://leetcode.com/problems/word-ladder-ii/',
			},
			{
				title: 'Alien Dictionary',
				link: 'https://leetcode.com/problems/alien-dictionary/',
			},
			{
				title: 'Meeting Rooms II',
				link: 'https://leetcode.com/problems/meeting-rooms-ii/',
			},
			{
				title: 'Shortest Path in Binary Matrix',
				link: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/',
			},
			{
				title: 'Design Search Autocomplete System',
				link: 'https://leetcode.com/problems/design-search-autocomplete-system/',
			},
			{
				title: 'Kth Largest Element in a Stream',
				link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
			},
			{
				title: 'Insert Interval',
				link: 'https://leetcode.com/problems/insert-interval/',
			},
			{
				title: 'Find Median from Data Stream',
				link: 'https://leetcode.com/problems/find-median-from-data-stream/',
			},
			{
				title: 'Subarrays with K Different Integers',
				link: 'https://leetcode.com/problems/subarrays-with-k-different-integers/',
			},
			{
				title: 'Unique Paths',
				link: 'https://leetcode.com/problems/unique-paths/',
			},
		],
	},
	{
		company: 'Meta (Facebook)',
		questions: [
			{
				title: 'Clone Graph',
				link: 'https://leetcode.com/problems/clone-graph/',
			},
			{
				title: 'Number of Islands',
				link: 'https://leetcode.com/problems/number-of-islands/',
			},
			{
				title: 'Binary Tree Maximum Path Sum',
				link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
			},
			{
				title: 'Evaluate Division',
				link: 'https://leetcode.com/problems/evaluate-division/',
			},
			{
				title: 'Word Break',
				link: 'https://leetcode.com/problems/word-break/',
			},
			{
				title: 'Find All Anagrams in a String',
				link: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
			},
			{
				title: 'Maximum Subarray',
				link: 'https://leetcode.com/problems/maximum-subarray/',
			},
			{
				title: 'Course Schedule',
				link: 'https://leetcode.com/problems/course-schedule/',
			},
			{
				title: 'Decode Ways',
				link: 'https://leetcode.com/problems/decode-ways/',
			},
			{
				title: 'Diameter of Binary Tree',
				link: 'https://leetcode.com/problems/diameter-of-binary-tree/',
			},
		],
	},
	{
		company: 'Microsoft',
		questions: [
			{
				title: 'Course Schedule II',
				link: 'https://leetcode.com/problems/course-schedule-ii/',
			},
			{
				title: 'Word Search',
				link: 'https://leetcode.com/problems/word-search/',
			},
			{
				title: 'Group Anagrams',
				link: 'https://leetcode.com/problems/group-anagrams/',
			},
			{ title: 'Jump Game', link: 'https://leetcode.com/problems/jump-game/' },
			{
				title: 'Set Matrix Zeroes',
				link: 'https://leetcode.com/problems/set-matrix-zeroes/',
			},
			{
				title: 'Search a 2D Matrix',
				link: 'https://leetcode.com/problems/search-a-2d-matrix/',
			},
			{ title: 'Subsets', link: 'https://leetcode.com/problems/subsets/' },
			{
				title: 'Implement Trie (Prefix Tree)',
				link: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
			},
			{ title: '3Sum', link: 'https://leetcode.com/problems/3sum/' },
			{
				title: 'Minimum Window Substring',
				link: 'https://leetcode.com/problems/minimum-window-substring/',
			},
		],
	},
	{
		company: 'Apple',
		questions: [
			{ title: 'LRU Cache', link: 'https://leetcode.com/problems/lru-cache/' },
			{
				title: 'Insert Delete GetRandom O(1)',
				link: 'https://leetcode.com/problems/insert-delete-getrandom-o1/',
			},
			{
				title: 'Merge Intervals',
				link: 'https://leetcode.com/problems/merge-intervals/',
			},
			{
				title: 'Product of Array Except Self',
				link: 'https://leetcode.com/problems/product-of-array-except-self/',
			},
			{
				title: 'Search in Rotated Sorted Array',
				link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
			},
			{
				title: 'Reverse Linked List',
				link: 'https://leetcode.com/problems/reverse-linked-list/',
			},
			{
				title: 'Binary Search',
				link: 'https://leetcode.com/problems/binary-search/',
			},
			{
				title: 'Find Peak Element',
				link: 'https://leetcode.com/problems/find-peak-element/',
			},
			{
				title: 'Binary Tree Inorder Traversal',
				link: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
			},
			{
				title: 'Intersection of Two Linked Lists',
				link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
			},
		],
	},
	{
		company: 'Netflix',
		questions: [
			{
				title: 'Longest Substring Without Repeating Characters',
				link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
			},
			{
				title: 'Integer to English Words',
				link: 'https://leetcode.com/problems/integer-to-english-words/',
			},
			{
				title: 'Reorder Data in Log Files',
				link: 'https://leetcode.com/problems/reorder-data-in-log-files/',
			},
			{
				title: 'Valid Palindrome',
				link: 'https://leetcode.com/problems/valid-palindrome/',
			},
			{
				title: 'Serialize and Deserialize Binary Tree',
				link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
			},
			{
				title: 'Find Duplicate File in System',
				link: 'https://leetcode.com/problems/find-duplicate-file-in-system/',
			},
			{
				title: 'Number of Connected Components in an Undirected Graph',
				link: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
			},
			{
				title: 'Subarray Sum Equals K',
				link: 'https://leetcode.com/problems/subarray-sum-equals-k/',
			},
			{
				title: 'Delete Node in a Linked List',
				link: 'https://leetcode.com/problems/delete-node-in-a-linked-list/',
			},
			{
				title: 'Top K Frequent Elements',
				link: 'https://leetcode.com/problems/top-k-frequent-elements/',
			},
		],
	},
	{
		company: 'Tesla',
		questions: [
			{
				title: 'Robot Room Cleaner',
				link: 'https://leetcode.com/problems/robot-room-cleaner/',
			},
			{
				title: 'Design Circular Queue',
				link: 'https://leetcode.com/problems/design-circular-queue/',
			},
			{
				title: 'Gas Station',
				link: 'https://leetcode.com/problems/gas-station/',
			},
			{
				title: 'Implement Stack using Queues',
				link: 'https://leetcode.com/problems/implement-stack-using-queues/',
			},
			{
				title: 'Find All Numbers Disappeared in an Array',
				link: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
			},
			{
				title: 'Reconstruct Itinerary',
				link: 'https://leetcode.com/problems/reconstruct-itinerary/',
			},
			{
				title: 'Path Sum III',
				link: 'https://leetcode.com/problems/path-sum-iii/',
			},
			{
				title: 'Daily Temperatures',
				link: 'https://leetcode.com/problems/daily-temperatures/',
			},
			{
				title: 'Max Area of Island',
				link: 'https://leetcode.com/problems/max-area-of-island/',
			},
			{
				title: 'Open the Lock',
				link: 'https://leetcode.com/problems/open-the-lock/',
			},
		],
	},
	{
		company: 'Uber',
		questions: [
			{
				title: 'Sliding Window Maximum',
				link: 'https://leetcode.com/problems/sliding-window-maximum/',
			},
			{
				title: 'Random Pick with Weight',
				link: 'https://leetcode.com/problems/random-pick-with-weight/',
			},
			{ title: 'Min Stack', link: 'https://leetcode.com/problems/min-stack/' },
			{
				title: 'Add and Search Word - Data structure design',
				link: 'https://leetcode.com/problems/add-and-search-word-data-structure-design/',
			},
			{
				title: 'Word Search II',
				link: 'https://leetcode.com/problems/word-search-ii/',
			},
			{
				title: 'Sort Colors',
				link: 'https://leetcode.com/problems/sort-colors/',
			},
			{
				title: 'Number of Islands',
				link: 'https://leetcode.com/problems/number-of-islands/',
			},
			{
				title: 'Subsets II',
				link: 'https://leetcode.com/problems/subsets-ii/',
			},
			{
				title: 'Split Array Largest Sum',
				link: 'https://leetcode.com/problems/split-array-largest-sum/',
			},
			{
				title: 'Sudoku Solver',
				link: 'https://leetcode.com/problems/sudoku-solver/',
			},
		],
	},
	{
		company: 'Airbnb',
		questions: [
			{
				title: 'Serialize and Deserialize Binary Tree',
				link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
			},
			{
				title: 'Sum of Two Integers',
				link: 'https://leetcode.com/problems/sum-of-two-integers/',
			},
			{
				title: 'Trapping Rain Water',
				link: 'https://leetcode.com/problems/trapping-rain-water/',
			},
			{
				title: 'Combination Sum',
				link: 'https://leetcode.com/problems/combination-sum/',
			},
			{
				title: 'Spiral Matrix',
				link: 'https://leetcode.com/problems/spiral-matrix/',
			},
			{
				title: 'Unique Paths II',
				link: 'https://leetcode.com/problems/unique-paths-ii/',
			},
			{
				title: 'Copy List with Random Pointer',
				link: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
			},
			{
				title: 'Missing Number',
				link: 'https://leetcode.com/problems/missing-number/',
			},
			{
				title: 'Count and Say',
				link: 'https://leetcode.com/problems/count-and-say/',
			},
			{
				title: 'Find Peak Element',
				link: 'https://leetcode.com/problems/find-peak-element/',
			},
		],
	},
	{
		company: 'Adobe',
		questions: [
			{ title: 'Subsets', link: 'https://leetcode.com/problems/subsets/' },
			{
				title: 'Find First and Last Position of Element in Sorted Array',
				link: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
			},
			{
				title: 'Combination Sum II',
				link: 'https://leetcode.com/problems/combination-sum-ii/',
			},
			{
				title: 'Letter Combinations of a Phone Number',
				link: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
			},
			{
				title: 'Majority Element',
				link: 'https://leetcode.com/problems/majority-element/',
			},
			{
				title: 'Median of Two Sorted Arrays',
				link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
			},
			{
				title: 'Detect Cycle in a Directed Graph',
				link: 'https://leetcode.com/problems/course-schedule/',
			},
			{
				title: 'Word Search',
				link: 'https://leetcode.com/problems/word-search/',
			},
			{
				title: 'Trapping Rain Water',
				link: 'https://leetcode.com/problems/trapping-rain-water/',
			},
			{
				title: 'Find kth Smallest Element in a BST',
				link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
			},
		],
	},
];

export async function getCompanyQuestions(): Promise<CompanyQuestions[]> {
	return COMPANY_QUESTIONS;
}
