import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { SocialService } from '@/lib/firebase/social-service';
import { commentLikeActionSchema } from '@/lib/schemas/social';
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
    const validatedData = commentLikeActionSchema.parse(body);

    // Toggle comment like in database
    const result = await socialService.toggleCommentLike(
      validatedData.commentId, 
      currentUser.id
    );

    return NextResponse.json({
      success: true,
      liked: result.liked,
      likesCount: result.likesCount,
      message: result.liked ? 'Comment liked' : 'Comment unliked'
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid comment like data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === 'Comment not found') {
        return NextResponse.json(
          { error: 'Comment not found' },
          { status: 404 }
        );
      }
      
      if (error.message === 'User not found') {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to toggle comment like' },
      { status: 500 }
    );
  }
}
