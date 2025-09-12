// app/api/research/[id]/requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const requestData = await request.json();
    
    const researchRef = db.collection('researchPapers').doc(id);
    const researchDoc = await researchRef.get();
    
    if (!researchDoc.exists) {
      return NextResponse.json({ error: 'Research paper not found' }, { status: 404 });
    }
    
    const researchData = researchDoc.data();
    const existingRequest = researchData?.requests?.find(
      (req: any) => req.userId === requestData.userId
    );
    
    if (existingRequest) {
      return NextResponse.json({ error: 'Request already exists' }, { status: 400 });
    }
    
    const newRequest = {
      ...requestData,
      createdAt: new Date().toISOString(),
    };
    
    await researchRef.update({
      requests: [...(researchData?.requests || []), newRequest],
    });
    
    const updatedResearchPaper = {
      id: researchDoc.id,
      ...researchData,
      requests: [...(researchData?.requests || []), newRequest],
    };
    
    return NextResponse.json(updatedResearchPaper);
  } catch (error) {
    console.error('Error adding request to research paper:', error);
    return NextResponse.json({ error: 'Failed to add request' }, { status: 500 });
  }
}