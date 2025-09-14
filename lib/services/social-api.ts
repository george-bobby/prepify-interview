import { 
  PostWithInteractions, 
  CommentWithInteractions,
  CreatePostRequest, 
  CreateCommentRequest,
  UpdatePostRequest,
  UpdateCommentRequest,
  PostsResponse,
  CommentsResponse,
  GetPostsQuery,
  GetCommentsQuery,
  ShareActionRequest
} from '@/lib/schemas/social';

export class SocialAPI {
  private baseUrl = '/api/social';

  // Posts API
  async getPosts(query: Partial<GetPostsQuery> = {}): Promise<PostsResponse> {
    const searchParams = new URLSearchParams();
    
    if (query.limit) searchParams.set('limit', query.limit.toString());
    if (query.offset) searchParams.set('offset', query.offset.toString());
    if (query.userId) searchParams.set('userId', query.userId);
    if (query.sortBy) searchParams.set('sortBy', query.sortBy);
    if (query.sortOrder) searchParams.set('sortOrder', query.sortOrder);

    const response = await fetch(`${this.baseUrl}/posts?${searchParams}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch posts');
    }

    return response.json();
  }

  async getPost(postId: string): Promise<PostWithInteractions> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch post');
    }

    return response.json();
  }

  async createPost(postData: CreatePostRequest): Promise<PostWithInteractions> {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create post');
    }

    return response.json();
  }

  async updatePost(postId: string, updateData: UpdatePostRequest): Promise<PostWithInteractions> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update post');
    }

    return response.json();
  }

  async deletePost(postId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete post');
    }
  }

  // Likes API
  async toggleLike(postId: string): Promise<{ liked: boolean; likesCount: number }> {
    const response = await fetch(`${this.baseUrl}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle like');
    }

    return response.json();
  }

  // Comments API
  async getComments(query: GetCommentsQuery): Promise<CommentsResponse> {
    const searchParams = new URLSearchParams();
    
    searchParams.set('postId', query.postId);
    if (query.limit) searchParams.set('limit', query.limit.toString());
    if (query.offset) searchParams.set('offset', query.offset.toString());
    if (query.sortBy) searchParams.set('sortBy', query.sortBy);
    if (query.sortOrder) searchParams.set('sortOrder', query.sortOrder);

    const response = await fetch(`${this.baseUrl}/comments?${searchParams}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch comments');
    }

    return response.json();
  }

  async createComment(commentData: CreateCommentRequest): Promise<CommentWithInteractions> {
    const response = await fetch(`${this.baseUrl}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create comment');
    }

    return response.json();
  }

  async updateComment(commentId: string, updateData: UpdateCommentRequest): Promise<CommentWithInteractions> {
    const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update comment');
    }

    return response.json();
  }

  async deleteComment(commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete comment');
    }
  }

  async toggleCommentLike(commentId: string): Promise<{ liked: boolean; likesCount: number }> {
    const response = await fetch(`${this.baseUrl}/comments/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle comment like');
    }

    return response.json();
  }

  // Shares API
  async sharePost(shareData: ShareActionRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/shares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shareData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to share post');
    }
  }

  async unsharePost(postId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/shares?postId=${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to unshare post');
    }
  }
}

export const socialAPI = new SocialAPI();
