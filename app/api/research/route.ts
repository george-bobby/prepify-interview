// app/api/research/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const researchSnapshot = await db.collection('projects').where('type', '==', 'research').get();
    const research = researchSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(research);
  } catch (error) {
    console.error('Error fetching research:', error);
    return NextResponse.json({ error: 'Failed to fetch research' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const researchData = {
      ...body,
      type: 'research',
      createdAt: new Date().toISOString(),
    };
    
    const docRef = await db.collection('projects').add(researchData);
    const newResearch = {
      id: docRef.id,
      ...researchData,
    };
    
    return NextResponse.json(newResearch, { status: 201 });
  } catch (error) {
    console.error('Error creating research:', error);
    return NextResponse.json({ error: 'Failed to create research' }, { status: 500 });
  }
}

