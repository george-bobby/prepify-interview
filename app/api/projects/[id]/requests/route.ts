// app/api/projects/[id]/requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const requestData = await request.json();
    
    const projectRef = db.collection('projects').doc(id);
    const projectDoc = await projectRef.get();
    
    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const projectData = projectDoc.data();
    const existingRequest = projectData?.requests?.find(
      (req: any) => req.userId === requestData.userId
    );
    
    if (existingRequest) {
      return NextResponse.json({ error: 'Request already exists' }, { status: 400 });
    }
    
    const newRequest = {
      ...requestData,
      createdAt: new Date().toISOString(),
    };
    
    await projectRef.update({
      requests: [...(projectData?.requests || []), newRequest],
    });
    
    const updatedProject = {
      id: projectDoc.id,
      ...projectData,
      requests: [...(projectData?.requests || []), newRequest],
    };
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error adding request to project:', error);
    return NextResponse.json({ error: 'Failed to add request' }, { status: 500 });
  }
}