import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';
import { getCurrentUser } from '@/lib/actions/auth.action';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const researchId = params.id;
    const researchRef = db.collection('projects').doc(researchId);
    const researchDoc = await researchRef.get();

    if (!researchDoc.exists) {
      return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    }

    const researchData = researchDoc.data();
    
    // Check if user is the creator
    if (researchData?.createdById !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own research' }, { status: 403 });
    }

    await researchRef.delete();
    
    return NextResponse.json({ message: 'Research deleted successfully' });
  } catch (error) {
    console.error('Error deleting research:', error);
    return NextResponse.json({ error: 'Failed to delete research' }, { status: 500 });
  }
}