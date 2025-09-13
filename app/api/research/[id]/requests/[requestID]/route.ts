// app/api/research/[id]/requests/[requestId]/route.ts
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

    const { id: researchId, requestId } = params;
    const { status } = await request.json();
    
    console.log('Updating research request:', { researchId, requestId, status, userId: user.id });
    
    const researchRef = db.collection('projects').doc(researchId);
    const researchDoc = await researchRef.get();

    if (!researchDoc.exists) {
      console.log('Research not found:', researchId);
      return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    }

    const researchData = researchDoc.data();
    
    // Check if user is the research creator
    if (researchData?.createdById !== user.id) {
      console.log('Forbidden: User not creator', { createdById: researchData?.createdById, userId: user.id });
      return NextResponse.json({ error: 'Forbidden: Only research creator can manage requests' }, { status: 403 });
    }

    const currentRequests = researchData?.requests || [];
    const updatedRequests = currentRequests.map((req: any) =>
      req.id === requestId ? { ...req, status } : req
    );
    
    console.log('Updating requests:', { currentRequests, updatedRequests });
    
    // Use Firebase transaction to ensure atomicity
    await db.runTransaction(async (transaction) => {
      transaction.update(researchRef, { requests: updatedRequests });
    });
    
    const updatedResearch = {
      id: researchId,
      ...researchData,
      requests: updatedRequests,
    };

    console.log('Research request updated successfully');
    return NextResponse.json(updatedResearch);
  } catch (error) {
    console.error('Error updating research request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
