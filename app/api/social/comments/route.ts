import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { SocialService } from '@/lib/firebase/social-service';
import { 
  createCommentSchema, 
  getCommentsQuerySchema,
  CommentsResponse 
} from '@/lib/schemas/social';
import { z } from 'zod';

const socialService = new SocialService();

export async function GET(request: NextRequest) {
  try {
    // Get current user for personalized data
    const currentUser = await getCurrentUser();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      postId: searchParams.get('postId'),
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'asc',
    };

    if (!queryParams.postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      );
    }

    // Validate query parameters
    const validatedQuery = getCommentsQuerySchema.parse(queryParams);

    // Fetch comments from database
    const { comments, totalCount } = await socialService.getComments(
      validatedQuery, 
      currentUser?.id
    );

    const response: CommentsResponse = {
      comments,
      totalCount,
      hasMore: validatedQuery.offset + validatedQuery.limit < totalCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching comments:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

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
    const validatedData = createCommentSchema.parse(body);

    // Create comment in database
    const comment = await socialService.createComment(currentUser.id, validatedData);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid comment data', details: error.errors },
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
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
