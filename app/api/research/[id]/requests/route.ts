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

    const researchId = params.id;
    const newRequest = await request.json();
    
    console.log('Research request data:', { researchId, newRequest, userId: user.id });
    
    const researchRef = db.collection('projects').doc(researchId);
    const researchDoc = await researchRef.get();

    if (!researchDoc.exists) {
      console.log('Research not found:', researchId);
      return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    }

    const researchData = researchDoc.data();
    const currentRequests = researchData?.requests || [];
    
    // Check if user already requested
    const existingRequest = currentRequests.find((req: any) => req.userId === user.id);
    if (existingRequest) {
      console.log('Request already exists:', existingRequest);
      return NextResponse.json({ error: 'Request already exists' }, { status: 400 });
    }

    const updatedRequests = [...currentRequests, newRequest];
    
    console.log('Updating research with requests:', updatedRequests);
    await researchRef.update({ requests: updatedRequests });
    
    const updatedResearch = {
      id: researchId,
      ...researchData,
      requests: updatedRequests,
    };

    console.log('Research updated successfully');
    return NextResponse.json(updatedResearch);
  } catch (error) {
    console.error('Error adding research request:', error);
    return NextResponse.json({ error: 'Failed to add request' }, { status: 500 });
  }
}
