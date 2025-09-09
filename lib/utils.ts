import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { interviewCovers, mappings } from '@/constants';
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
const techIconBaseURL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const normalizeTechName = (tech: string) => {
	const key = tech.toLowerCase().replace(/\.js$/, '').replace(/\s+/g, '');
	return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
	try {
		const response = await fetch(url, { method: 'HEAD' });
		return response.ok; // Returns true if the icon exists
	} catch {
		return false;
	}
};

export const getTechLogos = async (techArray: string[]) => {
	const logoURLs = techArray.map((tech) => {
		const normalized = normalizeTechName(tech);
		return {
			tech,
			url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
		};
	});

	const results = await Promise.all(
		logoURLs.map(async ({ tech, url }) => ({
			tech,
			url: (await checkIconExists(url)) ? url : '/tech.svg',
		}))
	);

	return results;
};

export const getRandomInterviewCover = () => {
	const randomIndex = Math.floor(Math.random() * interviewCovers.length);
	return `/covers${interviewCovers[randomIndex]}`;
};

// Generate initials from role name (e.g., "Software Engineer" -> "SE")
export const generateInitials = (role: string): string => {
	const words = role.trim().split(/\s+/);
	const firstTwoWords = words.slice(0, 2);
	return firstTwoWords.map((word) => word.charAt(0).toUpperCase()).join('');
};

// Generate a consistent color based on the role name for better UX
export const generateRoleColor = (
	role: string
): { backgroundColor: string; textColor: string } => {
	const colors = [
		{ bg: 'bg-red-500', text: 'text-white' },
		{ bg: 'bg-blue-500', text: 'text-white' },
		{ bg: 'bg-green-500', text: 'text-white' },
		{ bg: 'bg-purple-500', text: 'text-white' },
		{ bg: 'bg-pink-500', text: 'text-white' },
		{ bg: 'bg-indigo-500', text: 'text-white' },
		{ bg: 'bg-teal-500', text: 'text-white' },
		{ bg: 'bg-orange-500', text: 'text-white' },
		{ bg: 'bg-cyan-500', text: 'text-white' },
		{ bg: 'bg-emerald-500', text: 'text-white' },
		{ bg: 'bg-violet-500', text: 'text-white' },
		{ bg: 'bg-rose-500', text: 'text-white' },
	];

	// Generate a consistent index based on role string
	let hash = 0;
	for (let i = 0; i < role.length; i++) {
		hash = role.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % colors.length;

	return {
		backgroundColor: colors[index].bg,
		textColor: colors[index].text,
	};
};
