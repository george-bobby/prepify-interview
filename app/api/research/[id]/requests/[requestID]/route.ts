// app/api/research/[id]/requests/[requestId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; requestId: string } }
) {
  try {
    const { id, requestId } = params;
    const { status } = await request.json();
    
    const researchRef = db.collection('researchPapers').doc(id);
    const researchDoc = await researchRef.get();
    
    if (!researchDoc.exists) {
      return NextResponse.json({ error: 'Research paper not found' }, { status: 404 });
    }
    
    const researchData = researchDoc.data();
    const requests = researchData?.requests || [];
    const requestIndex = requests.findIndex((req: any) => req.id === requestId);
    
    if (requestIndex === -1) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    
    requests[requestIndex].status = status;
    
    await researchRef.update({ requests });
    
    const updatedResearchPaper = {
      id: researchDoc.id,
      ...researchData,
      requests,
    };
    
    return NextResponse.json(updatedResearchPaper);
  } catch (error) {
    console.error('Error updating research request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}