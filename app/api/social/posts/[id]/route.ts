import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { SocialService } from '@/lib/firebase/social-service';
import { updatePostSchema } from '@/lib/schemas/social';
import { z } from 'zod';

const socialService = new SocialService();

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Get current user for personalized data
    const currentUser = await getCurrentUser();
    
    // Fetch post from database
    const post = await socialService.getPostById(id, currentUser?.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
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
    const validatedData = updatePostSchema.parse(body);

    // Update post in database
    const updatedPost = await socialService.updatePost(
      id, 
      currentUser.id, 
      validatedData
    );

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid post data', details: error.errors },
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
      
      if (error.message === 'Unauthorized to update this post') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Delete post from database
    await socialService.deletePost(id, currentUser.id);

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Post not found') {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
      
      if (error.message === 'Unauthorized to delete this post') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
