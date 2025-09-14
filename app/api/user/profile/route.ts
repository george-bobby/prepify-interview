// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';
import { getCurrentUser } from '@/lib/actions/auth.action';

export async function PATCH(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { skills, name, email } = await request.json();
		console.log('Updating user profile:', {
			userId: user.id,
			skills,
			name,
			email,
		});

		// Update user document in Firebase
		const userRef = db.collection('users').doc(user.id);
		const updateData: any = {};

		if (skills !== undefined) updateData.skills = skills;
		if (name !== undefined) updateData.name = name;
		if (email !== undefined) updateData.email = email;

		updateData.updatedAt = new Date().toISOString();

		await db.runTransaction(async (transaction) => {
			transaction.update(userRef, updateData);
		});

		console.log('User profile updated successfully');

		// Return updated user data
		const updatedUserDoc = await userRef.get();
		const updatedUserData = { id: user.id, ...updatedUserDoc.data() };

		return NextResponse.json(updatedUserData);
	} catch (error) {
		console.error('Error updating user profile:', error);
		return NextResponse.json(
			{ error: 'Failed to update profile' },
			{ status: 500 }
		);
	}
}
