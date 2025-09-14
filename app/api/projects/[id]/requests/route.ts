import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';
import { getCurrentUser } from '@/lib/actions/auth.action';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;
    const newRequest = await request.json();
    
    const projectRef = db.collection('projects').doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectData = projectDoc.data();
    const currentRequests = projectData?.requests || [];
    
    // Check if user already requested
    const existingRequest = currentRequests.find((req: any) => req.userId === user.id);
    if (existingRequest) {
      return NextResponse.json({ error: 'Request already exists' }, { status: 400 });
    }

    const updatedRequests = [...currentRequests, newRequest];
    
    await projectRef.update({ requests: updatedRequests });
    
    const updatedProject = {
      id: projectId,
      ...projectData,
      requests: updatedRequests,
    };

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error adding request:', error);
    return NextResponse.json({ error: 'Failed to add request' }, { status: 500 });
  }
}
