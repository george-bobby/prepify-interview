import { db } from '@/firebase/admin';
import {
  Post,
  Like,
  Comment,
  Share,
  CommentLike,
  Notification,
  PostWithInteractions,
  CommentWithInteractions,
  GetPostsQuery,
  GetCommentsQuery,
  GetNotificationsQuery,
  CreatePostRequest,
  CreateCommentRequest,
  UpdatePostRequest,
  UpdateCommentRequest,
  ShareActionRequest,
  CreateNotificationRequest
} from '@/lib/schemas/social';
import { FieldValue } from 'firebase-admin/firestore';

export class SocialService {
  private postsCollection = db.collection('posts');
  private likesCollection = db.collection('likes');
  private commentsCollection = db.collection('comments');
  private sharesCollection = db.collection('shares');
  private commentLikesCollection = db.collection('commentLikes');
  private notificationsCollection = db.collection('notifications');
  private usersCollection = db.collection('users');

  // Posts operations
  async createPost(userId: string, postData: CreatePostRequest): Promise<Post> {
    const user = await this.usersCollection.doc(userId).get();
    if (!user.exists) {
      throw new Error('User not found');
    }

    const userData = user.data();
    const now = new Date().toISOString();

    const post: Omit<Post, 'id'> = {
      userId,
      authorName: userData?.name || 'Unknown User',
      authorRole: userData?.role || 'User',
      authorAvatar: userData?.avatar || null,
      authorVerified: userData?.verified || false,
      content: postData.content,
      imageUrl: postData.imageUrl || null,
      videoUrl: postData.videoUrl || null,
      attachmentUrl: postData.attachmentUrl || null,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isEdited: false,
      createdAt: now,
    };

    const docRef = await this.postsCollection.add(post);
    return { ...post, id: docRef.id };
  }

  async getPosts(query: GetPostsQuery, currentUserId?: string): Promise<{ posts: PostWithInteractions[], totalCount: number }> {
    let postsQuery = this.postsCollection
      .orderBy(query.sortBy, query.sortOrder)
      .limit(query.limit)
      .offset(query.offset);

    if (query.userId) {
      postsQuery = postsQuery.where('userId', '==', query.userId);
    }

    const snapshot = await postsQuery.get();
    const posts: Post[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post));

    // Get user interactions if currentUserId is provided
    const postsWithInteractions: PostWithInteractions[] = await Promise.all(
      posts.map(async (post) => {
        let isLikedByUser = false;
        let isSharedByUser = false;
        let userLikeId: string | undefined;
        let userShareId: string | undefined;

        if (currentUserId) {
          // Check if user liked this post
          const likeQuery = await this.likesCollection
            .where('postId', '==', post.id)
            .where('userId', '==', currentUserId)
            .limit(1)
            .get();

          if (!likeQuery.empty) {
            isLikedByUser = true;
            userLikeId = likeQuery.docs[0].id;
          }

          // Check if user shared this post
          const shareQuery = await this.sharesCollection
            .where('postId', '==', post.id)
            .where('userId', '==', currentUserId)
            .limit(1)
            .get();

          if (!shareQuery.empty) {
            isSharedByUser = true;
            userShareId = shareQuery.docs[0].id;
          }
        }

        return {
          ...post,
          isLikedByUser,
          isSharedByUser,
          userLikeId,
          userShareId,
        };
      })
    );

    // Get total count for pagination
    const totalSnapshot = await this.postsCollection.get();
    const totalCount = totalSnapshot.size;

    return { posts: postsWithInteractions, totalCount };
  }

  async getPostById(postId: string, currentUserId?: string): Promise<PostWithInteractions | null> {
    const doc = await this.postsCollection.doc(postId).get();
    if (!doc.exists) {
      return null;
    }

    const post = { id: doc.id, ...doc.data() } as Post;

    let isLikedByUser = false;
    let isSharedByUser = false;
    let userLikeId: string | undefined;
    let userShareId: string | undefined;

    if (currentUserId) {
      // Check user interactions
      const [likeQuery, shareQuery] = await Promise.all([
        this.likesCollection
          .where('postId', '==', postId)
          .where('userId', '==', currentUserId)
          .limit(1)
          .get(),
        this.sharesCollection
          .where('postId', '==', postId)
          .where('userId', '==', currentUserId)
          .limit(1)
          .get()
      ]);

      if (!likeQuery.empty) {
        isLikedByUser = true;
        userLikeId = likeQuery.docs[0].id;
      }

      if (!shareQuery.empty) {
        isSharedByUser = true;
        userShareId = shareQuery.docs[0].id;
      }
    }

    return {
      ...post,
      isLikedByUser,
      isSharedByUser,
      userLikeId,
      userShareId,
    };
  }

  async updatePost(postId: string, userId: string, updateData: UpdatePostRequest): Promise<Post> {
    const postRef = this.postsCollection.doc(postId);
    const post = await postRef.get();

    if (!post.exists) {
      throw new Error('Post not found');
    }

    const postData = post.data() as Post;
    if (postData.userId !== userId) {
      throw new Error('Unauthorized to update this post');
    }

    const now = new Date().toISOString();
    const updatedData = {
      ...updateData,
      isEdited: true,
      updatedAt: now,
    };

    await postRef.update(updatedData);
    
    const updatedPost = await postRef.get();
    return { id: updatedPost.id, ...updatedPost.data() } as Post;
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const postRef = this.postsCollection.doc(postId);
    const post = await postRef.get();

    if (!post.exists) {
      throw new Error('Post not found');
    }

    const postData = post.data() as Post;
    if (postData.userId !== userId) {
      throw new Error('Unauthorized to delete this post');
    }

    // Use batch to delete post and all related data
    const batch = db.batch();

    // Delete the post
    batch.delete(postRef);

    // Delete all likes for this post
    const likesSnapshot = await this.likesCollection.where('postId', '==', postId).get();
    likesSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete all comments for this post
    const commentsSnapshot = await this.commentsCollection.where('postId', '==', postId).get();
    commentsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete all shares for this post
    const sharesSnapshot = await this.sharesCollection.where('postId', '==', postId).get();
    sharesSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  // Likes operations
  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const user = await this.usersCollection.doc(userId).get();
    if (!user.exists) {
      throw new Error('User not found');
    }

    const userData = user.data();
    const postRef = this.postsCollection.doc(postId);
    const post = await postRef.get();

    if (!post.exists) {
      throw new Error('Post not found');
    }

    // Check if user already liked this post
    const existingLike = await this.likesCollection
      .where('postId', '==', postId)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    const batch = db.batch();
    let liked = false;
    let likesCount = (post.data() as Post).likesCount;

    if (existingLike.empty) {
      // Add like
      const likeData: Omit<Like, 'id'> = {
        postId,
        userId,
        userName: userData?.name || 'Unknown User',
        createdAt: new Date().toISOString(),
      };

      const likeRef = this.likesCollection.doc();
      batch.set(likeRef, likeData);
      batch.update(postRef, { likesCount: FieldValue.increment(1) });

      liked = true;
      likesCount += 1;
    } else {
      // Remove like
      const likeDoc = existingLike.docs[0];
      batch.delete(likeDoc.ref);
      batch.update(postRef, { likesCount: FieldValue.increment(-1) });

      liked = false;
      likesCount -= 1;
    }

    await batch.commit();
    return { liked, likesCount };
  }

  // Comments operations
  async createComment(userId: string, commentData: CreateCommentRequest): Promise<Comment> {
    const user = await this.usersCollection.doc(userId).get();
    if (!user.exists) {
      throw new Error('User not found');
    }

    const userData = user.data();
    const postRef = this.postsCollection.doc(commentData.postId);
    const post = await postRef.get();

    if (!post.exists) {
      throw new Error('Post not found');
    }

    const now = new Date().toISOString();
    const comment: Omit<Comment, 'id'> = {
      postId: commentData.postId,
      userId,
      authorName: userData?.name || 'Unknown User',
      authorRole: userData?.role || 'User',
      authorAvatar: userData?.avatar || null,
      authorVerified: userData?.verified || false,
      content: commentData.content,
      parentCommentId: commentData.parentCommentId || null,
      likesCount: 0,
      repliesCount: 0,
      isEdited: false,
      createdAt: now,
    };

    const batch = db.batch();

    // Add comment
    const commentRef = this.commentsCollection.doc();
    batch.set(commentRef, comment);

    // Update post comments count
    batch.update(postRef, { commentsCount: FieldValue.increment(1) });

    // If this is a reply, update parent comment replies count
    if (commentData.parentCommentId) {
      const parentCommentRef = this.commentsCollection.doc(commentData.parentCommentId);
      batch.update(parentCommentRef, { repliesCount: FieldValue.increment(1) });
    }

    await batch.commit();
    return { ...comment, id: commentRef.id };
  }

  async getComments(query: GetCommentsQuery, currentUserId?: string): Promise<{ comments: CommentWithInteractions[], totalCount: number }> {
    try {
      // Get top-level comments first - use the simplest possible query
      const snapshot = await this.commentsCollection
        .where('postId', '==', query.postId)
        .get();
      // Filter to only top-level comments (no parent)
      let comments: Comment[] = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Comment))
        .filter(comment => !comment.parentCommentId);

      // Sort comments in memory
      comments.sort((a, b) => {
        if (query.sortBy === 'createdAt') {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return query.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (query.sortBy === 'likesCount') {
          return query.sortOrder === 'asc' ? a.likesCount - b.likesCount : b.likesCount - a.likesCount;
        }
        return 0;
      });

      // Apply pagination in memory
      const totalCount = comments.length;
      comments = comments.slice(query.offset, query.offset + query.limit);

      // Get replies for each comment and user interactions
      const commentsWithInteractions: CommentWithInteractions[] = await Promise.all(
      comments.map(async (comment) => {
        let isLikedByUser = false;
        let userLikeId: string | undefined;

        if (currentUserId) {
          // Check if user liked this comment
          const likeQuery = await this.commentLikesCollection
            .where('commentId', '==', comment.id)
            .where('userId', '==', currentUserId)
            .limit(1)
            .get();

          if (!likeQuery.empty) {
            isLikedByUser = true;
            userLikeId = likeQuery.docs[0].id;
          }
        }

        // Get replies for this comment - simplified query to avoid index issues
        const repliesSnapshot = await this.commentsCollection
          .where('parentCommentId', '==', comment.id)
          .get();

        // Sort replies in memory by createdAt
        const sortedReplyDocs = repliesSnapshot.docs.sort((a, b) => {
          const dataA = a.data();
          const dataB = b.data();
          const dateA = new Date(dataA.createdAt).getTime();
          const dateB = new Date(dataB.createdAt).getTime();
          return dateA - dateB; // ascending order
        });

        const replies: CommentWithInteractions[] = await Promise.all(
          sortedReplyDocs.map(async (replyDoc) => {
            const reply = { id: replyDoc.id, ...replyDoc.data() } as Comment;
            let replyIsLikedByUser = false;
            let replyUserLikeId: string | undefined;

            if (currentUserId) {
              const replyLikeQuery = await this.commentLikesCollection
                .where('commentId', '==', reply.id)
                .where('userId', '==', currentUserId)
                .limit(1)
                .get();

              if (!replyLikeQuery.empty) {
                replyIsLikedByUser = true;
                replyUserLikeId = replyLikeQuery.docs[0].id;
              }
            }

            return {
              ...reply,
              isLikedByUser: replyIsLikedByUser,
              userLikeId: replyUserLikeId,
            };
          })
        );

        return {
          ...comment,
          isLikedByUser,
          userLikeId,
          replies,
        };
      })
      );

      // Total count is already calculated above
      return { comments: commentsWithInteractions, totalCount };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments from database');
    }
  }

  async updateComment(commentId: string, userId: string, updateData: UpdateCommentRequest): Promise<Comment> {
    const commentRef = this.commentsCollection.doc(commentId);
    const comment = await commentRef.get();

    if (!comment.exists) {
      throw new Error('Comment not found');
    }

    const commentData = comment.data() as Comment;
    if (commentData.userId !== userId) {
      throw new Error('Unauthorized to update this comment');
    }

    const now = new Date().toISOString();
    const updatedData = {
      content: updateData.content,
      isEdited: true,
      updatedAt: now,
    };

    await commentRef.update(updatedData);

    const updatedComment = await commentRef.get();
    return { id: updatedComment.id, ...updatedComment.data() } as Comment;
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const commentRef = this.commentsCollection.doc(commentId);
    const comment = await commentRef.get();

    if (!comment.exists) {
      throw new Error('Comment not found');
    }

    const commentData = comment.data() as Comment;
    if (commentData.userId !== userId) {
      throw new Error('Unauthorized to delete this comment');
    }

    const batch = db.batch();

    // Delete the comment
    batch.delete(commentRef);

    // Update post comments count
    const postRef = this.postsCollection.doc(commentData.postId);
    batch.update(postRef, { commentsCount: FieldValue.increment(-1) });

    // If this is a reply, update parent comment replies count
    if (commentData.parentCommentId) {
      const parentCommentRef = this.commentsCollection.doc(commentData.parentCommentId);
      batch.update(parentCommentRef, { repliesCount: FieldValue.increment(-1) });
    }

    // Delete all likes for this comment
    const commentLikesSnapshot = await this.commentLikesCollection.where('commentId', '==', commentId).get();
    commentLikesSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete all replies to this comment
    const repliesSnapshot = await this.commentsCollection.where('parentCommentId', '==', commentId).get();
    repliesSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  // Comment likes operations
  async toggleCommentLike(commentId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const user = await this.usersCollection.doc(userId).get();
    if (!user.exists) {
      throw new Error('User not found');
    }

    const userData = user.data();
    const commentRef = this.commentsCollection.doc(commentId);
    const comment = await commentRef.get();

    if (!comment.exists) {
      throw new Error('Comment not found');
    }

    // Check if user already liked this comment
    const existingLike = await this.commentLikesCollection
      .where('commentId', '==', commentId)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    const batch = db.batch();
    let liked = false;
    let likesCount = (comment.data() as Comment).likesCount;

    if (existingLike.empty) {
      // Add like
      const likeData: Omit<CommentLike, 'id'> = {
        commentId,
        userId,
        userName: userData?.name || 'Unknown User',
        createdAt: new Date().toISOString(),
      };

      const likeRef = this.commentLikesCollection.doc();
      batch.set(likeRef, likeData);
      batch.update(commentRef, { likesCount: FieldValue.increment(1) });

      liked = true;
      likesCount += 1;
    } else {
      // Remove like
      const likeDoc = existingLike.docs[0];
      batch.delete(likeDoc.ref);
      batch.update(commentRef, { likesCount: FieldValue.increment(-1) });

      liked = false;
      likesCount -= 1;
    }

    await batch.commit();
    return { liked, likesCount };
  }

  // Shares operations
  async sharePost(userId: string, shareData: ShareActionRequest): Promise<Share> {
    try {
      let user = await this.usersCollection.doc(userId).get();
      let userData = user.data();

      if (!user.exists) {
        // Create a basic user record if it doesn't exist
        // This is common in social applications where users might be authenticated but not yet have a profile
        const basicUserData = {
          id: userId,
          name: 'User', // Default name
          email: '', // Will be updated when user completes profile
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await this.usersCollection.doc(userId).set(basicUserData);
        userData = basicUserData;
      }

      const postRef = this.postsCollection.doc(shareData.postId);
      const post = await postRef.get();

      if (!post.exists) {
        throw new Error('Post not found');
      }

      // Check if user already shared this post
      const existingShare = await this.sharesCollection
        .where('postId', '==', shareData.postId)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (!existingShare.empty) {
        throw new Error('Post already shared by user');
      }

      const now = new Date().toISOString();
      const share: Omit<Share, 'id'> = {
        postId: shareData.postId,
        userId,
        userName: userData?.name || 'Unknown User',
        shareType: shareData.shareType,
        createdAt: now,
      };

      // Only add quoteContent if it's defined (Firestore doesn't allow undefined values)
      if (shareData.quoteContent !== undefined) {
        (share as any).quoteContent = shareData.quoteContent;
      }

      const batch = db.batch();

      // Add share
      const shareRef = this.sharesCollection.doc();
      batch.set(shareRef, share);

      // Update post shares count
      batch.update(postRef, { sharesCount: FieldValue.increment(1) });

      await batch.commit();
      return { ...share, id: shareRef.id };
    } catch (error) {
      console.error('Error in sharePost:', error);
      throw error;
    }
  }

  async unsharePost(postId: string, userId: string): Promise<void> {
    const existingShare = await this.sharesCollection
      .where('postId', '==', postId)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (existingShare.empty) {
      throw new Error('Share not found');
    }

    const batch = db.batch();
    const shareDoc = existingShare.docs[0];

    // Delete share
    batch.delete(shareDoc.ref);

    // Update post shares count
    const postRef = this.postsCollection.doc(postId);
    batch.update(postRef, { sharesCount: FieldValue.increment(-1) });

    await batch.commit();
  }

  // Notifications operations
  async createNotification(notificationData: CreateNotificationRequest): Promise<Notification> {
    const now = new Date().toISOString();
    const notification: Omit<Notification, 'id'> = {
      ...notificationData,
      isRead: false,
      createdAt: now,
    };

    const docRef = await this.notificationsCollection.add(notification);
    return { ...notification, id: docRef.id };
  }

  async getNotifications(userId: string, query: GetNotificationsQuery): Promise<{ notifications: Notification[], totalCount: number, unreadCount: number }> {
    try {
      // Simplified query to avoid composite index requirements
      // We'll sort in memory instead of using orderBy in the query
      let notificationsQuery = this.notificationsCollection
        .where('userId', '==', userId);

      if (query.unreadOnly) {
        notificationsQuery = notificationsQuery.where('isRead', '==', false);
      }

      // Get all notifications for the user (we'll handle pagination in memory)
      const snapshot = await notificationsQuery.get();

      // Convert to array and sort by createdAt in memory
      let allNotifications: Notification[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));

      // Sort by createdAt descending (newest first)
      allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Get total count
      const totalCount = allNotifications.length;

      // Get unread count (count notifications where isRead is false)
      const unreadCount = allNotifications.filter(n => !n.isRead).length;

      // Apply pagination in memory
      const startIndex = query.offset;
      const endIndex = startIndex + query.limit;
      const notifications = allNotifications.slice(startIndex, endIndex);

      return { notifications, totalCount, unreadCount };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications from database');
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    const notificationRef = this.notificationsCollection.doc(notificationId);
    const notification = await notificationRef.get();

    if (!notification.exists) {
      throw new Error('Notification not found');
    }

    const notificationData = notification.data();
    if (notificationData?.userId !== userId) {
      throw new Error('Unauthorized to update this notification');
    }

    await notificationRef.update({ isRead: true });
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const unreadNotifications = await this.notificationsCollection
      .where('userId', '==', userId)
      .where('isRead', '==', false)
      .get();

    const batch = db.batch();
    unreadNotifications.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notificationRef = this.notificationsCollection.doc(notificationId);
    const notification = await notificationRef.get();

    if (!notification.exists) {
      throw new Error('Notification not found');
    }

    const notificationData = notification.data();
    if (notificationData?.userId !== userId) {
      throw new Error('Unauthorized to delete this notification');
    }

    await notificationRef.delete();
  }

  // Helper method to get user by ID
  async getUserById(userId: string): Promise<any | null> {
    try {
      const userDoc = await this.usersCollection.doc(userId).get();
      if (!userDoc.exists) {
        return null;
      }
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Helper method to find users by name (since this app doesn't have usernames)
  async findUsersByNames(names: string[]): Promise<Array<{id: string, name: string, email: string}>> {
    if (names.length === 0) return [];

    try {
      const users: Array<{id: string, name: string, email: string}> = [];

      // Query users by name (case-insensitive search)
      for (const name of names) {
        const trimmedName = name.trim();
        if (!trimmedName) continue;

        // Search by exact name match (case-insensitive)
        const userQuery = await this.usersCollection
          .where('name', '>=', trimmedName)
          .where('name', '<=', trimmedName + '\uf8ff')
          .limit(5) // Limit to prevent too many results
          .get();

        userQuery.docs.forEach(userDoc => {
          const userData = userDoc.data();
          // Check for exact match (case-insensitive)
          if (userData.name && userData.name.toLowerCase() === trimmedName.toLowerCase()) {
            users.push({
              id: userDoc.id,
              name: userData.name,
              email: userData.email || ''
            });
          }
        });
      }

      // Remove duplicates based on user ID
      const uniqueUsers = users.filter((user, index, self) =>
        index === self.findIndex(u => u.id === user.id)
      );

      return uniqueUsers;
    } catch (error) {
      console.error('Error finding users by names:', error);
      return [];
    }
  }

  // Helper method to find users by email
  async findUsersByEmails(emails: string[]): Promise<Array<{id: string, name: string, email: string}>> {
    if (emails.length === 0) return [];

    try {
      const users: Array<{id: string, name: string, email: string}> = [];

      // Query users by email
      for (const email of emails) {
        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail) continue;

        const userQuery = await this.usersCollection
          .where('email', '==', trimmedEmail)
          .limit(1)
          .get();

        if (!userQuery.empty) {
          const userDoc = userQuery.docs[0];
          const userData = userDoc.data();
          users.push({
            id: userDoc.id,
            name: userData.name || 'Unknown User',
            email: userData.email || trimmedEmail
          });
        }
      }

      return users;
    } catch (error) {
      console.error('Error finding users by emails:', error);
      return [];
    }
  }

  // Combined method to find users by name or email
  async findUsersByIdentifiers(identifiers: string[]): Promise<Array<{id: string, name: string, email: string, matchedBy: 'name' | 'email'}>> {
    if (identifiers.length === 0) return [];

    try {
      const results: Array<{id: string, name: string, email: string, matchedBy: 'name' | 'email'}> = [];

      // Separate identifiers into potential names and emails
      const potentialEmails: string[] = [];
      const potentialNames: string[] = [];

      identifiers.forEach(identifier => {
        const trimmed = identifier.trim();
        if (trimmed.includes('@') && trimmed.includes('.')) {
          potentialEmails.push(trimmed);
        } else {
          potentialNames.push(trimmed);
        }
      });

      // Search by emails first (more precise)
      if (potentialEmails.length > 0) {
        const emailUsers = await this.findUsersByEmails(potentialEmails);
        emailUsers.forEach(user => {
          results.push({ ...user, matchedBy: 'email' });
        });
      }

      // Search by names
      if (potentialNames.length > 0) {
        const nameUsers = await this.findUsersByNames(potentialNames);
        nameUsers.forEach(user => {
          // Avoid duplicates if user was already found by email
          if (!results.find(r => r.id === user.id)) {
            results.push({ ...user, matchedBy: 'name' });
          }
        });
      }

      return results;
    } catch (error) {
      console.error('Error finding users by identifiers:', error);
      return [];
    }
  }
}
