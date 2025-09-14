import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { SocialService } from '@/lib/firebase/social-service';
import { getNotificationsQuerySchema, createNotificationSchema } from '@/lib/schemas/social';
import { z } from 'zod';

const socialService = new SocialService();

export async function GET(request: NextRequest) {
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
    const queryParams = {
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      unreadOnly: searchParams.get('unreadOnly') === 'true',
    };

    // Validate query parameters
    const validatedQuery = getNotificationsQuerySchema.parse(queryParams);

    // Fetch notifications from database
    const { notifications, totalCount, unreadCount } = await socialService.getNotifications(
      currentUser.id,
      validatedQuery
    );

    const response = {
      notifications,
      totalCount,
      unreadCount,
      hasMore: validatedQuery.offset + validatedQuery.limit < totalCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
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
    const validatedData = createNotificationSchema.parse(body);

    // Create notification in database
    const notification = await socialService.createNotification(validatedData);

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid notification data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const notificationId = searchParams.get('id');
    const action = searchParams.get('action');

    if (action === 'markAllRead') {
      // Mark all notifications as read
      await socialService.markAllNotificationsAsRead(currentUser.id);
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    // Mark single notification as read
    await socialService.markNotificationAsRead(notificationId, currentUser.id);

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Notification not found') {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      
      if (error.message === 'Unauthorized to update this notification') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update notification' },
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
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    // Delete notification
    await socialService.deleteNotification(notificationId, currentUser.id);

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Notification not found') {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      
      if (error.message === 'Unauthorized to delete this notification') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
