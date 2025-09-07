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
