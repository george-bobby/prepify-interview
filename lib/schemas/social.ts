import { z } from 'zod';

// Base schemas for social media entities
export const postSchema = z.object({
  id: z.string().optional(), // Firestore document ID
  userId: z.string(),
  authorName: z.string(),
  authorRole: z.string(),
  authorAvatar: z.string().nullable().optional(),
  authorVerified: z.boolean().default(false),
  content: z.string().min(1).max(5000),
  imageUrl: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  attachmentUrl: z.string().nullable().optional(),
  likesCount: z.number().default(0),
  commentsCount: z.number().default(0),
  sharesCount: z.number().default(0),
  isEdited: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const likeSchema = z.object({
  id: z.string().optional(),
  postId: z.string(),
  userId: z.string(),
  userName: z.string(),
  createdAt: z.string(),
});

export const commentSchema = z.object({
  id: z.string().optional(),
  postId: z.string(),
  userId: z.string(),
  authorName: z.string(),
  authorRole: z.string(),
  authorAvatar: z.string().nullable().optional(),
  authorVerified: z.boolean().default(false),
  content: z.string().min(1).max(1000),
  parentCommentId: z.string().nullable().optional(), // For nested comments
  likesCount: z.number().default(0),
  repliesCount: z.number().default(0),
  isEdited: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const shareSchema = z.object({
  id: z.string().optional(),
  postId: z.string(),
  userId: z.string(),
  userName: z.string(),
  shareType: z.enum(['direct', 'repost', 'quote']).default('direct'),
  quoteContent: z.string().optional(), // For quote shares
  createdAt: z.string(),
});

export const commentLikeSchema = z.object({
  id: z.string().optional(),
  commentId: z.string(),
  userId: z.string(),
  userName: z.string(),
  createdAt: z.string(),
});

// Request/Response schemas for API endpoints
export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  imageUrl: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  attachmentUrl: z.string().nullable().optional(),
});

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  imageUrl: z.string().nullable().optional(),
  videoUrl: z.string().nullable().optional(),
  attachmentUrl: z.string().nullable().optional(),
});

export const createCommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1).max(1000),
  parentCommentId: z.string().nullable().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const likeActionSchema = z.object({
  postId: z.string(),
});

export const shareActionSchema = z.object({
  postId: z.string(),
  shareType: z.enum(['direct', 'repost', 'quote']).default('direct'),
  quoteContent: z.string().optional(),
});

export const commentLikeActionSchema = z.object({
  commentId: z.string(),
});

// Query schemas
export const getPostsQuerySchema = z.object({
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
  userId: z.string().optional(), // For user-specific posts
  sortBy: z.enum(['createdAt', 'likesCount', 'commentsCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const getCommentsQuerySchema = z.object({
  postId: z.string(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
  sortBy: z.enum(['createdAt', 'likesCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Type exports
export type Post = z.infer<typeof postSchema>;
export type Like = z.infer<typeof likeSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type Share = z.infer<typeof shareSchema>;
export type CommentLike = z.infer<typeof commentLikeSchema>;

export type CreatePostRequest = z.infer<typeof createPostSchema>;
export type UpdatePostRequest = z.infer<typeof updatePostSchema>;
export type CreateCommentRequest = z.infer<typeof createCommentSchema>;
export type UpdateCommentRequest = z.infer<typeof updateCommentSchema>;
export type LikeActionRequest = z.infer<typeof likeActionSchema>;
export type ShareActionRequest = z.infer<typeof shareActionSchema>;
export type CommentLikeActionRequest = z.infer<typeof commentLikeActionSchema>;

export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;
export type GetCommentsQuery = z.infer<typeof getCommentsQuerySchema>;

// Extended post type with user interaction status
export interface PostWithInteractions extends Post {
  isLikedByUser: boolean;
  isSharedByUser: boolean;
  userLikeId?: string;
  userShareId?: string;
}

// Extended comment type with user interaction status
export interface CommentWithInteractions extends Comment {
  isLikedByUser: boolean;
  userLikeId?: string;
  replies?: CommentWithInteractions[];
}

// API Response types
export interface PostsResponse {
  posts: PostWithInteractions[];
  totalCount: number;
  hasMore: boolean;
}

export interface CommentsResponse {
  comments: CommentWithInteractions[];
  totalCount: number;
  hasMore: boolean;
}

export interface SocialStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  activeUsers: number;
}
