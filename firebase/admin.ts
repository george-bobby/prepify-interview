import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
const initFirebaseAdmin = () => {
	//To initialize firebase admin SDK only once
	//Check if any apps are already initialized
	const apps = getApps();
	if (!apps.length) {
		const config = {
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
		};

		// Debug: Check if all required environment variables are present
		console.log('Firebase Admin Config:', {
			projectId: config.projectId ? 'PROJECT_ID_PRESENT' : 'PROJECT_ID_MISSING',
			clientEmail: config.clientEmail
				? 'CLIENT_EMAIL_PRESENT'
				: 'CLIENT_EMAIL_MISSING',
			privateKey: config.privateKey
				? 'PRIVATE_KEY_PRESENT'
				: 'PRIVATE_KEY_MISSING',
		});

		if (!config.projectId || !config.clientEmail || !config.privateKey) {
			throw new Error(
				'Missing Firebase Admin configuration. Please check your environment variables.'
			);
		}

		initializeApp({
			credential: cert(config),
		});
	}
	return {
		auth: getAuth(),
		db: getFirestore(),
	};
};
export const { auth, db } = initFirebaseAdmin();
