import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { SocialService } from '@/lib/firebase/social-service';
import { shareActionSchema } from '@/lib/schemas/social';
import { z } from 'zod';

const socialService = new SocialService();

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = shareActionSchema.parse(body);

    // Share post in database
    const share = await socialService.sharePost(currentUser.id, validatedData);

    return NextResponse.json({
      success: true,
      share,
      message: 'Post shared successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error sharing post:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid share data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      console.log('Share API: Specific error message:', error.message);

      if (error.message === 'Post not found') {
        return NextResponse.json(
          { error: 'The post you are trying to share does not exist or has been deleted.' },
          { status: 404 }
        );
      }

      if (error.message === 'User not found') {
        return NextResponse.json(
          { error: 'User account not found. Please try logging in again.' },
          { status: 404 }
        );
      }

      if (error.message === 'Post already shared by user') {
        return NextResponse.json(
          { error: 'You have already shared this post.' },
          { status: 409 }
        );
      }

      // Check for Firebase/Firestore specific errors
      if (error.message.includes('permission-denied')) {
        return NextResponse.json(
          { error: 'Permission denied. Please check your authentication.' },
          { status: 403 }
        );
      }

      if (error.message.includes('unavailable')) {
        return NextResponse.json(
          { error: 'Database temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: `Share failed: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to share post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    // Unshare post in database
    await socialService.unsharePost(postId, currentUser.id);

    return NextResponse.json({
      success: true,
      message: 'Post unshared successfully'
    });
  } catch (error) {
    console.error('Error unsharing post:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Share not found') {
        return NextResponse.json(
          { error: 'Share not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to unshare post' },
      { status: 500 }
    );
  }
}
