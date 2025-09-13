// app/api/projects/[id]/requests/[requestId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';
import { getCurrentUser } from '@/lib/actions/auth.action';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; requestId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId, requestId } = params;
    const { status } = await request.json();
    
    console.log('Updating project request:', { projectId, requestId, status, userId: user.id });
    
    const projectRef = db.collection('projects').doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      console.log('Project not found:', projectId);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectData = projectDoc.data();
    
    // Check if user is the project creator
    if (projectData?.createdById !== user.id) {
      console.log('Forbidden: User not creator', { createdById: projectData?.createdById, userId: user.id });
      return NextResponse.json({ error: 'Forbidden: Only project creator can manage requests' }, { status: 403 });
    }

    const currentRequests = projectData?.requests || [];
    const updatedRequests = currentRequests.map((req: any) =>
      req.id === requestId ? { ...req, status } : req
    );
    
    console.log('Updating requests:', { currentRequests, updatedRequests });
    
    // Use Firebase transaction to ensure atomicity
    await db.runTransaction(async (transaction) => {
      transaction.update(projectRef, { requests: updatedRequests });
    });
    
    const updatedProject = {
      id: projectId,
      ...projectData,
      requests: updatedRequests,
    };

    console.log('Project request updated successfully');
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
