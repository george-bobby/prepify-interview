"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Image,
  User,
  Briefcase,
  Calendar,
  Loader2,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import { socialAPI } from "@/lib/services/social-api";
import { PostWithInteractions } from "@/lib/schemas/social";
import { toast } from "sonner";
import CommentsSection from "@/components/CommentsSection";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";

const SocialTab = () => {
  const [posts, setPosts] = useState<PostWithInteractions[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [floatingInputExpanded, setFloatingInputExpanded] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [postToShare, setPostToShare] = useState<PostWithInteractions | null>(
    null
  );
  const [shareUsernames, setShareUsernames] = useState("");
  const [sharingPost, setSharingPost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Load initial posts and current user
  useEffect(() => {
    loadPosts();
    loadCurrentUser();
    loadUnreadNotificationsCount();
  }, []);

  const loadUnreadNotificationsCount = async () => {
    try {
      if (currentUser) {
        const response = await socialAPI.getNotifications({
          limit: 1,
          offset: 0,
          unreadOnly: false,
        });
        setUnreadNotificationsCount(response.unreadCount);
      }
    } catch (error) {
      console.error("Error loading unread notifications count:", error);
      // Don't show error toast for this background operation
    }
  };

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

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
      setFloatingInputExpanded(false);
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

  const handleShare = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setPostToShare(post);
      setShowShareModal(true);
    }
  };

  const handleConfirmShare = async () => {
    if (!postToShare || !shareUsernames.trim()) {
      toast.error("Please enter at least one username to share with");
      return;
    }

    try {
      setSharingPost(true);

      // Parse usernames (comma-separated)
      const usernames = shareUsernames
        .split(",")
        .map((username) => username.trim())
        .filter((username) => username.length > 0);

      if (usernames.length === 0) {
        toast.error("Please enter valid usernames");
        return;
      }

      // Share the post in the database (this will increment the share count)
      await socialAPI.sharePost({
        postId: postToShare.id!,
        shareType: "direct",
      });

      // Create notifications for each user the post was shared with
      // First, resolve the usernames/emails to actual user IDs
      try {
        const foundUsers = await socialAPI.findUsersByIdentifiers(usernames);

        if (foundUsers.length === 0) {
          toast.warning("No valid users found with the provided names/emails");
        } else if (foundUsers.length < usernames.length) {
          const foundIdentifiers = foundUsers.map((u) =>
            u.matchedBy === "email" ? u.email : u.name
          );
          const notFoundIdentifiers = usernames.filter(
            (identifier) =>
              !foundIdentifiers.some(
                (found) =>
                  found.toLowerCase() === identifier.trim().toLowerCase()
              )
          );
          toast.warning(
            `Some users not found: ${notFoundIdentifiers.join(", ")}`
          );
        }

        // Create notifications for found users
        const notificationPromises = foundUsers.map(async (user) => {
          try {
            await socialAPI.createNotification({
              userId: user.id,
              fromUserId: currentUser?.id || "",
              fromUserName: currentUser?.name || "Someone",
              type: "share",
              postId: postToShare.id!,
              title: "Post Shared With You",
              message: `${currentUser?.name || "Someone"
                } shared a post with you: "${postToShare.content.substring(
                  0,
                  100
                )}${postToShare.content.length > 100 ? "..." : ""}"`,
            });
          } catch (error) {
            console.error(
              `Failed to create notification for ${user.name}:`,
              error
            );
            // Don't fail the entire operation if one notification fails
          }
        });

        // Wait for all notifications to be created (but don't fail if some fail)
        await Promise.allSettled(notificationPromises);

        if (foundUsers.length > 0) {
          toast.success(
            `Notifications sent to ${foundUsers.length} user${foundUsers.length > 1 ? "s" : ""
            }`
          );
          // Refresh unread count since we may have created notifications for the current user
          loadUnreadNotificationsCount();
        }
      } catch (error) {
        console.error("Error resolving users for notifications:", error);
        toast.warning("Could not send notifications to users");
      }

      // Refresh the post to get updated share count from database
      const updatedPost = await socialAPI.getPost(postToShare.id!);

      // Update the posts list with the refreshed data
      setPosts(
        posts.map((post) => (post.id === postToShare.id ? updatedPost : post))
      );

      toast.success(
        `Post shared with ${usernames.length} user${usernames.length > 1 ? "s" : ""
        }!`
      );
      setShowShareModal(false);
      setPostToShare(null);
      setShareUsernames("");
    } catch (error) {
      console.error("Error sharing post:", error);

      // Provide more specific error message if available
      const errorMessage =
        error instanceof Error ? error.message : "Failed to share post";
      toast.error(errorMessage);
    } finally {
      setSharingPost(false);
    }
  };

  const handleCancelShare = () => {
    setShowShareModal(false);
    setPostToShare(null);
    setShareUsernames("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"></div>
        </div>
      </div>



      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-200" />
            <span className="ml-3 text-light-400">Loading posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-dark-200 border border-dark-300 rounded-2xl">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-primary-100 mb-2">
              No posts yet
            </h3>
            <p className="text-light-400">
              Be the first to share something with the community!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-dark-200 border border-dark-300 rounded-2xl overflow-hidden hover:border-primary-200/30 transition-all"
            >
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-dark-100">
                        {post.authorName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-light-100">
                          {post.authorName}
                        </h3>
                        {post.authorVerified && (
                          <div className="w-4 h-4 bg-primary-200 rounded-full flex items-center justify-center">
                            <span className="text-xs text-dark-100">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-light-400 text-sm">
                        {post.authorRole}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3 text-light-600" />
                        <span className="text-light-600 text-xs">
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

                  {/* Post Actions Menu - Only show for post creator */}
                  {currentUser && currentUser.id === post.userId && (
                    <button
                      onClick={() => handleDeletePost(post.id!)}
                      className="text-light-400 hover:text-destructive-100 transition-colors p-2 rounded-lg hover:bg-dark-300"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <p className="text-light-100 whitespace-pre-line leading-relaxed">
                  {post.content}
                </p>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={post.imageUrl}
                      alt="Post image"
                      className="w-full max-h-96 object-cover rounded-lg border border-dark-300"
                    />
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 border-t border-dark-300">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleLike(post.id!)}
                    className={`flex items-center gap-2 transition-colors ${post.isLikedByUser
                      ? "text-destructive-100"
                      : "text-light-400 hover:text-destructive-100"
                      }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${post.isLikedByUser ? "fill-current" : ""
                        }`}
                    />
                    <span className="text-sm font-medium">{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => handleOpenComments(post.id!)}
                    className="flex items-center gap-2 text-light-400 hover:text-primary-200 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.commentsCount}</span>
                  </button>

                  <button
                    onClick={() => handleShare(post.id!)}
                    className={`flex items-center gap-2 transition-colors ${post.isSharedByUser
                      ? "text-success-100"
                      : "text-light-400 hover:text-success-100"
                      }`}
                  >
                    <Share className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.sharesCount}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && !loading && (
        <div className="text-center">
          <Button
            onClick={loadMorePosts}
            disabled={loadingMore}
            variant="outline"
            className="min-w-[200px]"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Load More Posts"
            )}
          </Button>
        </div>
      )}

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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-200 border border-dark-300 rounded-2xl p-6 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-primary-100 mb-2">Delete Post</h3>
              <p className="text-light-400">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                onClick={cancelDeletePost}
                disabled={deletingPost}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeletePost}
                disabled={deletingPost}
                className="bg-destructive-100 hover:bg-destructive-200 text-white"
              >
                {deletingPost ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Post Modal */}
      {showShareModal && postToShare && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-200 border border-dark-300 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-primary-100">Share Post</h3>
              <button
                onClick={handleCancelShare}
                className="text-light-400 hover:text-primary-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-dark-300 rounded-lg border border-dark-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center text-xs font-bold text-dark-100">
                  {postToShare.authorName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-light-100">
                  {postToShare.authorName}
                </span>
              </div>
              <p className="text-light-400 text-sm">
                {postToShare.content.length > 150
                  ? `${postToShare.content.substring(0, 150)}...`
                  : postToShare.content}
              </p>
              {postToShare.imageUrl && (
                <div className="mt-2">
                  <img
                    src={postToShare.imageUrl}
                    alt="Post content"
                    className="w-full h-32 object-cover rounded-lg border border-dark-300"
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-light-100 mb-2">
                Share with users (comma-separated):
              </label>
              <textarea
                value={shareUsernames}
                onChange={(e) => setShareUsernames(e.target.value)}
                placeholder="Enter names or emails separated by commas (e.g., John Doe, jane@example.com)"
                className="w-full bg-dark-300 border border-input rounded-lg px-4 py-3 text-light-100 placeholder-light-400 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleConfirmShare();
                  }
                }}
              />
              <p className="text-xs text-light-600 mt-2">
                Tip: Press Ctrl+Enter to share quickly
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCancelShare}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmShare}
                disabled={!shareUsernames.trim() || sharingPost}
                className="flex-1 bg-primary-200 hover:bg-primary-200/80 text-dark-100"
              >
                {sharingPost ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Share"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Input Container - Similar to Ideas Page */}
      {currentUser && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <div className="bg-dark-200/95 backdrop-blur-lg rounded-2xl border border-dark-300/50 shadow-2xl">
            {/* Expanded Content - Appears above the main input */}
            {floatingInputExpanded && (
              <div className="border-b border-dark-300/50 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-dark-100">
                      {currentUser?.name?.[0] || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-light-100">{currentUser?.name || "User"}</p>
                    <p className="text-xs text-light-400">{currentUser?.role || "Member"}</p>
                  </div>
                </div>

                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your interview experience, tips, or achievements..."
                  className="w-full px-4 py-3 bg-dark-300/50 border border-input/50 rounded-lg text-light-100 placeholder-light-400 focus:outline-none focus:ring-2 focus:ring-primary-200/50 resize-none"
                  rows={4}
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-48 object-cover rounded-lg border border-dark-300"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-dark-100/80 text-light-100 rounded-full w-7 h-7 flex items-center justify-center hover:bg-dark-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Main Input Container */}
            <div className="relative">
              <div className="flex items-center p-4">
                {/* Main Input */}
                <input
                  type="text"
                  value={floatingInputExpanded ? "" : "Create a post..."}
                  onClick={() => !floatingInputExpanded && setFloatingInputExpanded(true)}
                  readOnly={!floatingInputExpanded}
                  className="flex-1 bg-transparent text-light-100 placeholder-light-400 text-base focus:outline-none cursor-pointer"
                  placeholder="Create a post..."
                />

                {/* Action Icons */}
                <div className="flex items-center gap-2 ml-3">
                  {floatingInputExpanded && (
                    <>
                      <label className="p-2 rounded-lg transition-all duration-200 text-light-400 hover:text-light-200 hover:bg-dark-300/50 cursor-pointer" title="Add Image">
                        <Image className="w-5 h-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setFloatingInputExpanded(false);
                          setNewPost("");
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="p-2 rounded-lg transition-all duration-200 text-light-400 hover:text-light-200 hover:bg-dark-300/50"
                        title="Cancel"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      if (floatingInputExpanded) {
                        handleCreatePost();
                      } else {
                        setFloatingInputExpanded(true);
                      }
                    }}
                    disabled={floatingInputExpanded && ((!newPost.trim() && !selectedImage) || creatingPost)}
                    className="p-2 rounded-lg bg-success-100 text-white hover:bg-success-100/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={floatingInputExpanded ? "Post" : "Create Post"}
                  >
                    {creatingPost ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : floatingInputExpanded ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                      </svg>
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialTab;