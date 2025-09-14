"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Image,
  Video,
  FileText,
  User,
  Briefcase,
  Calendar,
  Loader2,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { socialAPI } from "@/lib/services/social-api";
import { PostWithInteractions } from "@/lib/schemas/social";
import { toast } from "sonner";
import CommentsSection from "@/components/CommentsSection";

const SocialTab = () => {
  const [posts, setPosts] = useState<PostWithInteractions[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);

  // Load initial posts
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (offset = 0, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await socialAPI.getPosts({
        limit: 20,
        offset,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (append) {
        setPosts((prev) => [...prev, ...response.posts]);
      } else {
        setPosts(response.posts);
      }

      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      loadPosts(posts.length, true);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      // Optimistic update
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLikedByUser: !post.isLikedByUser,
              likesCount: post.isLikedByUser
                ? post.likesCount - 1
                : post.likesCount + 1,
            };
          }
          return post;
        })
      );

      // API call
      const result = await socialAPI.toggleLike(postId);

      // Update with actual result from server
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLikedByUser: result.liked,
              likesCount: result.likesCount,
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");

      // Revert optimistic update
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLikedByUser: !post.isLikedByUser,
              likesCount: post.isLikedByUser
                ? post.likesCount + 1
                : post.likesCount - 1,
            };
          }
          return post;
        })
      );
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      setCreatingPost(true);

      let imageUrl = null;

      // Convert image to base64 if selected
      if (selectedImage) {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(selectedImage);
        });
      }

      const createdPost = await socialAPI.createPost({
        content: newPost.trim(),
        imageUrl,
      });

      // Add new post to the beginning of the list
      setPosts([createdPost, ...posts]);
      setNewPost("");
      setSelectedImage(null);
      setImagePreview(null);
      setShowCreatePost(false);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setCreatingPost(false);
    }
  };

  const handleOpenComments = (postId: string) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setSelectedPostId(null);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      setDeletingPost(true);
      await socialAPI.deletePost(postToDelete);

      // Remove post from the list
      setPosts(posts.filter((post) => post.id !== postToDelete));

      setShowDeleteConfirm(false);
      setPostToDelete(null);
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setDeletingPost(false);
    }
  };

  const cancelDeletePost = () => {
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  const handleCommentAdded = () => {
    // Refresh the specific post to get updated comment count
    if (selectedPostId) {
      socialAPI
        .getPost(selectedPostId)
        .then((updatedPost) => {
          setPosts(
            posts.map((post) =>
              post.id === selectedPostId ? updatedPost : post
            )
          );
        })
        .catch((error) => {
          console.error("Error refreshing post:", error);
        });
    }
  };

  const handleShare = async (postId: string) => {
    try {
      // Optimistic update
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isSharedByUser: !post.isSharedByUser,
              sharesCount: post.isSharedByUser
                ? post.sharesCount - 1
                : post.sharesCount + 1,
            };
          }
          return post;
        })
      );

      // API call
      const currentPost = posts.find((p) => p.id === postId);
      if (currentPost?.isSharedByUser) {
        await socialAPI.unsharePost(postId);
        toast.success("Post unshared");
      } else {
        await socialAPI.sharePost({
          postId,
          shareType: "direct",
        });
        toast.success("Post shared successfully!");
      }
    } catch (error) {
      console.error("Error toggling share:", error);
      toast.error("Failed to update share");

      // Revert optimistic update
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isSharedByUser: !post.isSharedByUser,
              sharesCount: post.isSharedByUser
                ? post.sharesCount + 1
                : post.sharesCount - 1,
            };
          }
          return post;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header matching your design */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Social</h1>
            <p className="text-gray-400 mt-1">
              Connect with the Prepify community
            </p>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create Post
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Create a post</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">D</span>
                </div>
                <div>
                  <p className="font-medium">DDD</p>
                  <p className="text-sm text-gray-400">Software Engineer</p>
                </div>
              </div>

              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your interview experience, tips, or achievements..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
                rows={4}
              />

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-gray-400">
                  <label className="cursor-pointer hover:text-white">
                    <Image className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                  <Video className="w-5 h-5 cursor-pointer hover:text-white" />
                  <FileText className="w-5 h-5 cursor-pointer hover:text-white" />
                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={(!newPost.trim() && !selectedImage) || creatingPost}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  {creatingPost ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">1,247</p>
                <p className="text-gray-400 text-sm">Community Members</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">89</p>
                <p className="text-gray-400 text-sm">Job Offers This Week</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">456</p>
                <p className="text-gray-400 text-sm">Active Discussions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              <span className="ml-2 text-gray-400">Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                No posts yet. Be the first to share something!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {post.authorName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-white">
                            {post.authorName}
                          </h3>
                          {post.authorVerified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          {post.authorRole}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-500 text-xs">
                            {new Date(post.createdAt).toLocaleDateString(
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
                      </div>
                    </div>

                    {/* Post Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() => handleDeletePost(post.id!)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {post.content}
                  </p>

                  {/* Post Image */}
                  {post.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={post.imageUrl}
                        alt="Post image"
                        className="w-full max-h-96 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="px-6 py-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id!)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.isLikedByUser
                            ? "text-red-400"
                            : "text-gray-400 hover:text-red-400"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            post.isLikedByUser ? "fill-current" : ""
                          }`}
                        />
                        <span className="text-sm">{post.likesCount}</span>
                      </button>

                      <button
                        onClick={() => handleOpenComments(post.id!)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.commentsCount}</span>
                      </button>

                      <button
                        onClick={() => handleShare(post.id!)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.isSharedByUser
                            ? "text-green-400"
                            : "text-gray-400 hover:text-green-400"
                        }`}
                      >
                        <Share className="w-5 h-5" />
                        <span className="text-sm">{post.sharesCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-gray-300 hover:text-white transition-colors flex items-center justify-center mx-auto"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load More Posts"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Comments Modal */}
      {selectedPostId && (
        <CommentsSection
          postId={selectedPostId}
          isOpen={showComments}
          onClose={handleCloseComments}
          onCommentAdded={handleCommentAdded}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-2">Delete Post</h3>
              <p className="text-gray-300">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={cancelDeletePost}
                disabled={deletingPost}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                disabled={deletingPost}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center"
              >
                {deletingPost ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialTab;
