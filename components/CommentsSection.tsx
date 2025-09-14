"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Loader2,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { socialAPI } from "@/lib/services/social-api";
import { CommentWithInteractions } from "@/lib/schemas/social";
import { toast } from "sonner";

interface CommentsSectionProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  isOpen,
  onClose,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<CommentWithInteractions[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (isOpen && postId) {
      loadComments();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await socialAPI.getComments({
        postId,
        limit: 50,
        offset: 0,
        sortBy: "createdAt",
        sortOrder: "asc",
      });
      setComments(response.comments);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const comment = await socialAPI.createComment({
        postId,
        content: newComment.trim(),
      });

      setComments([...comments, comment]);
      setNewComment("");
      onCommentAdded?.();
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyText.trim()) return;

    try {
      setSubmittingComment(true);
      const reply = await socialAPI.createComment({
        postId,
        content: replyText.trim(),
        parentCommentId,
      });

      // Add reply to the parent comment
      setComments(
        comments.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
              repliesCount: comment.repliesCount + 1,
            };
          }
          return comment;
        })
      );

      setReplyText("");
      setReplyingTo(null);
      onCommentAdded?.();
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error creating reply:", error);
      toast.error("Failed to add reply");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const result = await socialAPI.toggleCommentLike(commentId);

      // Update comment like status
      const updateCommentLike = (
        comments: CommentWithInteractions[]
      ): CommentWithInteractions[] => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLikedByUser: result.liked,
              likesCount: result.likesCount,
            };
          }
          // Also check replies
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentLike(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateCommentLike(comments));
    } catch (error) {
      console.error("Error toggling comment like:", error);
      toast.error("Failed to update like");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white">Comments</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-500" />
              <span className="ml-2 text-gray-400">Loading comments...</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                {/* Main Comment */}
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">
                      {comment.authorName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white text-sm">
                          {comment.authorName}
                        </span>
                        {comment.authorVerified && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <button
                        onClick={() => handleLikeComment(comment.id!)}
                        className={`flex items-center space-x-1 ${
                          comment.isLikedByUser
                            ? "text-red-400"
                            : "text-gray-400 hover:text-red-400"
                        }`}
                      >
                        <Heart
                          className={`w-3 h-3 ${
                            comment.isLikedByUser ? "fill-current" : ""
                          }`}
                        />
                        <span>{comment.likesCount}</span>
                      </button>

                      <button
                        onClick={() => setReplyingTo(comment.id!)}
                        className="text-gray-400 hover:text-white"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 flex space-x-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !submittingComment) {
                              handleSubmitReply(comment.id!);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleSubmitReply(comment.id!)}
                          disabled={!replyText.trim() || submittingComment}
                          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 px-3 py-2 rounded-lg text-white text-sm"
                        >
                          {submittingComment ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Reply"
                          )}
                        </button>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-600">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold">
                                {reply.authorName[0]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-600 rounded-lg p-2">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-white text-xs">
                                    {reply.authorName}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {new Date(
                                      reply.createdAt
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <p className="text-gray-300 text-xs">
                                  {reply.content}
                                </p>
                              </div>
                              <button
                                onClick={() => handleLikeComment(reply.id!)}
                                className={`flex items-center space-x-1 mt-1 text-xs ${
                                  reply.isLikedByUser
                                    ? "text-red-400"
                                    : "text-gray-400 hover:text-red-400"
                                }`}
                              >
                                <Heart
                                  className={`w-3 h-3 ${
                                    reply.isLikedByUser ? "fill-current" : ""
                                  }`}
                                />
                                <span>{reply.likesCount}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold">U</span>
            </div>
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !submittingComment) {
                    handleSubmitComment();
                  }
                }}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submittingComment}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 px-4 py-2 rounded-lg text-white flex items-center"
              >
                {submittingComment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
