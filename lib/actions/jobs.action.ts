'use server';

import { db } from '@/firebase/client';
import {
	collection,
	addDoc,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	Timestamp,
	updateDoc,
	doc,
	getDoc,
} from 'firebase/firestore';
import { getCurrentUser } from './auth.action';

// Save a job search and its results
export async function saveJobSearch(
	searchParams: JobSearchParams,
	jobs: Job[]
) {
	try {
		const user = await getCurrentUser();
		if (!user?.id) {
			throw new Error('User not authenticated');
		}

		const searchData: Omit<SavedJobSearch, 'id'> = {
			userId: user.id,
			searchParams,
			results: jobs,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const docRef = await addDoc(collection(db, 'jobSearches'), {
			...searchData,
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		});

		return { success: true, searchId: docRef.id };
	} catch (error) {
		console.error('Error saving job search:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

// Get saved job searches for a user
export async function getSavedJobSearches(userId?: string) {
	try {
		const user = userId ? { id: userId } : await getCurrentUser();
		if (!user?.id) {
			throw new Error('User not authenticated');
		}

		const q = query(
			collection(db, 'jobSearches'),
			where('userId', '==', user.id),
			orderBy('createdAt', 'desc'),
			limit(20)
		);

		const querySnapshot = await getDocs(q);
		const searches: SavedJobSearch[] = [];

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			searches.push({
				id: doc.id,
				userId: data.userId,
				searchParams: data.searchParams,
				results: data.results,
				createdAt: data.createdAt.toDate().toISOString(),
				updatedAt: data.updatedAt.toDate().toISOString(),
			});
		});

		return { success: true, searches };
	} catch (error) {
		console.error('Error getting saved job searches:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			searches: [],
		};
	}
}

// Check if a similar search already exists
export async function findSimilarSearch(searchParams: JobSearchParams) {
	try {
		const user = await getCurrentUser();
		if (!user?.id) {
			return { success: false, search: null };
		}

		const q = query(
			collection(db, 'jobSearches'),
			where('userId', '==', user.id),
			where('searchParams.query', '==', searchParams.query),
			where('searchParams.location', '==', searchParams.location || ''),
			orderBy('createdAt', 'desc'),
			limit(1)
		);

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			return { success: true, search: null };
		}

		const doc = querySnapshot.docs[0];
		const data = doc.data();
		const search: SavedJobSearch = {
			id: doc.id,
			userId: data.userId,
			searchParams: data.searchParams,
			results: data.results,
			createdAt: data.createdAt.toDate().toISOString(),
			updatedAt: data.updatedAt.toDate().toISOString(),
		};

		// Check if search is recent (within last hour)
		const oneHourAgo = new Date();
		oneHourAgo.setHours(oneHourAgo.getHours() - 1);
		const searchDate = new Date(search.createdAt);

		if (searchDate > oneHourAgo) {
			return { success: true, search };
		}

		return { success: true, search: null };
	} catch (error) {
		console.error('Error finding similar search:', error);
		return { success: false, search: null };
	}
}

// Get job search by ID
export async function getJobSearchById(searchId: string) {
	try {
		const user = await getCurrentUser();
		if (!user?.id) {
			throw new Error('User not authenticated');
		}

		const docRef = doc(db, 'jobSearches', searchId);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return { success: false, error: 'Search not found' };
		}

		const data = docSnap.data();

		// Check if user owns this search
		if (data.userId !== user.id) {
			return { success: false, error: 'Unauthorized' };
		}

		const search: SavedJobSearch = {
			id: docSnap.id,
			userId: data.userId,
			searchParams: data.searchParams,
			results: data.results,
			createdAt: data.createdAt.toDate().toISOString(),
			updatedAt: data.updatedAt.toDate().toISOString(),
		};

		return { success: true, search };
	} catch (error) {
		console.error('Error getting job search:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

// Update existing search with new results
export async function updateJobSearch(searchId: string, jobs: Job[]) {
	try {
		const user = await getCurrentUser();
		if (!user?.id) {
			throw new Error('User not authenticated');
		}

		const docRef = doc(db, 'jobSearches', searchId);
		await updateDoc(docRef, {
			results: jobs,
			updatedAt: Timestamp.now(),
		});

		return { success: true };
	} catch (error) {
		console.error('Error updating job search:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

// Get autocomplete suggestions for job titles
export async function getJobTitleSuggestions(partial: string) {
	try {
		const user = await getCurrentUser();
		if (!user?.id || partial.length < 2) {
			return { success: true, suggestions: [] };
		}

		const q = query(
			collection(db, 'jobSearches'),
			where('userId', '==', user.id),
			orderBy('createdAt', 'desc'),
			limit(50)
		);

		const querySnapshot = await getDocs(q);
		const suggestions = new Set<string>();

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			const query = data.searchParams?.query?.toLowerCase();
			if (query && query.includes(partial.toLowerCase())) {
				suggestions.add(data.searchParams.query);
			}
		});

		return {
			success: true,
			suggestions: Array.from(suggestions).slice(0, 5),
		};
	} catch (error) {
		console.error('Error getting job title suggestions:', error);
		return { success: true, suggestions: [] };
	}
}

// Get autocomplete suggestions for locations
export async function getLocationSuggestions(partial: string) {
	try {
		const user = await getCurrentUser();
		if (!user?.id || partial.length < 2) {
			return { success: true, suggestions: [] };
		}

		const q = query(
			collection(db, 'jobSearches'),
			where('userId', '==', user.id),
			orderBy('createdAt', 'desc'),
			limit(50)
		);

		const querySnapshot = await getDocs(q);
		const suggestions = new Set<string>();

		querySnapshot.forEach((doc) => {
			const data = doc.data();
			const location = data.searchParams?.location?.toLowerCase();
			if (location && location.includes(partial.toLowerCase())) {
				suggestions.add(data.searchParams.location);
			}
		});

		return {
			success: true,
			suggestions: Array.from(suggestions).slice(0, 5),
		};
	} catch (error) {
		console.error('Error getting location suggestions:', error);
		return { success: true, suggestions: [] };
	}
}
