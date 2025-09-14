import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { SocialService } from '@/lib/firebase/social-service';
import { likeActionSchema } from '@/lib/schemas/social';
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
    const validatedData = likeActionSchema.parse(body);

    // Toggle like in database
    const result = await socialService.toggleLike(
      validatedData.postId, 
      currentUser.id
    );

    return NextResponse.json({
      success: true,
      liked: result.liked,
      likesCount: result.likesCount,
      message: result.liked ? 'Post liked' : 'Post unliked'
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid like data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === 'Post not found') {
        return NextResponse.json(
          { error: 'Post not found' },
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
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
