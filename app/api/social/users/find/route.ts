import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { SocialService } from '@/lib/firebase/social-service';
import { z } from 'zod';

const socialService = new SocialService();

const findUsersSchema = z.object({
  identifiers: z.array(z.string()).min(1).max(10), // Limit to prevent abuse
});

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
    const validatedData = findUsersSchema.parse(body);

    // Find users by identifiers
    const users = await socialService.findUsersByIdentifiers(validatedData.identifiers);

    return NextResponse.json({
      success: true,
      users,
      message: `Found ${users.length} user${users.length !== 1 ? 's' : ''}`
    });
  } catch (error) {
    console.error('Error finding users:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
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
      { error: 'Failed to find users' },
      { status: 500 }
    );
  }
}
