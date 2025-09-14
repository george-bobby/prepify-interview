// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';

export async function GET(request: NextRequest) {
	try {
		console.log('GET /api/projects - Fetching projects...');
		const projectsSnapshot = await db
			.collection('projects')
			.where('type', '==', 'project')
			.get();
		const projects = projectsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		console.log('Fetched projects:', projects.length, 'projects found');
		console.log(
			'Projects with skills:',
			projects.map((p: any) => ({
				id: p.id,
				name: p.name,
				skillsRequired: p.skillsRequired,
			}))
		);
		return NextResponse.json(projects);
	} catch (error) {
		console.error('Error fetching projects:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch projects' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		console.log('Creating project with data:', body);
		console.log('Skills received:', body.skillsRequired);

		const projectData = {
			...body,
			type: 'project',
			createdAt: new Date().toISOString(),
		};

		console.log('Final project data to save:', projectData);

		const docRef = await db.collection('projects').add(projectData);
		const newProject = {
			id: docRef.id,
			...projectData,
		};

		return NextResponse.json(newProject, { status: 201 });
	} catch (error) {
		console.error('Error creating project:', error);
		return NextResponse.json(
			{ error: 'Failed to create project' },
			{ status: 500 }
		);
	}
}
