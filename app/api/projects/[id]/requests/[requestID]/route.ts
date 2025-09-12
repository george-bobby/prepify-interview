// app/api/projects/[id]/requests/[requestId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; requestId: string } }
) {
  try {
    const { id, requestId } = params;
    const { status } = await request.json();
    
    const projectRef = db.collection('projects').doc(id);
    const projectDoc = await projectRef.get();
    
    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const projectData = projectDoc.data();
    const requests = projectData?.requests || [];
    const requestIndex = requests.findIndex((req: any) => req.id === requestId);
    
    if (requestIndex === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    
    requests[requestIndex].status = status;
    
    await projectRef.update({ requests });
    
    const updatedProject = {
      id: projectDoc.id,
      ...projectData,
      requests,
    };
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}