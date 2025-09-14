import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { SocialService } from '@/lib/firebase/social-service';
import { 
  createPostSchema, 
  getPostsQuerySchema,
  PostsResponse 
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
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      userId: searchParams.get('userId') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    };

    // Validate query parameters
    const validatedQuery = getPostsQuerySchema.parse(queryParams);

    // Fetch posts from database
    const { posts, totalCount } = await socialService.getPosts(
      validatedQuery, 
      currentUser?.id
    );

    const response: PostsResponse = {
      posts,
      totalCount,
      hasMore: validatedQuery.offset + validatedQuery.limit < totalCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch posts' },
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
    const validatedData = createPostSchema.parse(body);

    // Create post in database
    const post = await socialService.createPost(currentUser.id, validatedData);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid post data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
