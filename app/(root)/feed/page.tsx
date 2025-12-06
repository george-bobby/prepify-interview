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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 md:w-96 md:h-96 bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-56 h-56 md:w-80 md:h-80 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-[#c0fe72]/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-2xl flex items-center justify-center shadow-xl shadow-[#c0fe72]/40 animate-pulse">
                <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-black" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#c0fe72] via-[#d4ff8f] to-[#c0fe72] bg-clip-text text-transparent">
                  Community Feed
                </h1>
                <p className="text-gray-400 text-sm md:text-base">Share experiences, tips & connect with peers</p>
              </div>
            </div>
          </div>
        </div>

      {/* Feed Container */}
      <div className="space-y-5 md:space-y-6 pb-32 md:pb-24">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16 md:py-20">
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-[#c0fe72] mb-4" />
            <span className="text-gray-300 text-base md:text-lg font-medium">Loading posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 md:py-20 bg-gradient-to-br from-gray-900/50 to-black/50 border-2 border-gray-700/50 rounded-3xl backdrop-blur-sm">
            <div className="text-6xl md:text-7xl mb-5">💬</div>
            <h3 className="text-xl md:text-2xl font-bold text-[#c0fe72] mb-3">
              No posts yet
            </h3>
            <p className="text-gray-400 text-base md:text-lg px-4">
              Be the first to share something with the community!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gradient-to-br from-gray-900/90 to-black/90 border-2 border-gray-700/50 rounded-3xl overflow-hidden transition-all duration-300 backdrop-blur-sm"
            >
              {/* Post Header */}
              <div className="p-5 md:p-6 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 md:gap-4 flex-1">
                    {/* User Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#c0fe72]/30">
                        <span className="text-base md:text-lg font-bold text-black">
                          {post.authorName[0].toUpperCase()}
                        </span>
                      </div>
                      {post.authorVerified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-blue-500 border-2 border-gray-900 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-white text-base md:text-lg truncate">
                          {post.authorName}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-xs md:text-sm truncate">
                        {post.authorRole}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-500 text-xs md:text-sm">
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

                  {/* Delete Button - Only for post creator */}
                  {currentUser && currentUser.id === post.userId && (
                    <button
                      onClick={() => handleDeletePost(post.id!)}
                      className="text-gray-400 transition-colors p-2 rounded-lg ml-2 flex-shrink-0"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="px-5 md:px-6 pb-4">
                <p className="text-gray-100 text-sm md:text-base whitespace-pre-line leading-relaxed">
                  {post.content}
                </p>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={post.imageUrl}
                      alt="Post image"
                      className="w-full max-h-72 md:max-h-96 object-cover rounded-2xl border-2 border-gray-700/50"
                    />
                  </div>
                )}
              </div>

              {/* Engagement Stats Bar */}
              <div className="px-5 md:px-6 py-2 border-t border-gray-700/50">
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    {post.likesCount > 0 && (
                      <>
                        <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-400 fill-red-400" />
                        <span>{post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    {post.commentsCount > 0 && (
                      <span>{post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}</span>
                    )}
                    {post.sharesCount > 0 && (
                      <span>{post.sharesCount} {post.sharesCount === 1 ? 'share' : 'shares'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Actions - LinkedIn Style */}
              <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-700/50">
                <div className="grid grid-cols-3 gap-1 md:gap-2">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(post.id!)}
                    className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-200 ${
                      post.isLikedByUser
                        ? "bg-red-500/20 text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 md:w-5 md:h-5 ${post.isLikedByUser ? "fill-current" : ""}`}
                    />
                    <span className="text-xs md:text-sm font-semibold hidden sm:inline">Like</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => handleOpenComments(post.id!)}
                    className="flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-gray-400 transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-semibold hidden sm:inline">Comment</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(post.id!)}
                    className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-200 ${
                      post.isSharedByUser
                        ? "bg-green-500/20 text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    <Share className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-semibold hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center pb-6">
          <Button
            onClick={loadMorePosts}
            disabled={loadingMore}
            className="min-w-[200px] bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 border-2 border-[#c0fe72]/40 text-[#c0fe72] font-bold px-8 py-6 rounded-xl shadow-lg shadow-[#c0fe72]/20"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading More...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Load More Posts
              </>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-500/40 rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl shadow-red-500/20">
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border-2 border-red-500/40">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Delete Post?</h3>
              </div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={cancelDeletePost}
                disabled={deletingPost}
                className="w-full sm:flex-1 bg-gray-700/50 text-white border-2 border-gray-600 font-semibold py-6 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeletePost}
                disabled={deletingPost}
                className="w-full sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-red-500/30"
              >
                {deletingPost ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Post Modal */}
      {showShareModal && postToShare && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/40 rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl shadow-[#c0fe72]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center border-2 border-green-500/40">
                  <Share className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Share Post</h3>
              </div>
              <button
                onClick={handleCancelShare}
                className="text-gray-400 transition-colors p-2 rounded-lg"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Post Preview */}
            <div className="mb-6 p-4 md:p-5 bg-black/60 rounded-xl md:rounded-2xl border-2 border-gray-700/50">
              <div className="flex items-center gap-2 md:gap-3 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-lg md:rounded-xl flex items-center justify-center text-sm md:text-base font-bold text-black">
                  {postToShare.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-sm md:text-base font-semibold text-white block">
                    {postToShare.authorName}
                  </span>
                  <span className="text-xs text-gray-400">{postToShare.authorRole}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {postToShare.content.length > 150
                  ? `${postToShare.content.substring(0, 150)}...`
                  : postToShare.content}
              </p>
              {postToShare.imageUrl && (
                <div className="mt-3">
                  <img
                    src={postToShare.imageUrl}
                    alt="Post content"
                    className="w-full h-32 md:h-40 object-cover rounded-lg md:rounded-xl border-2 border-gray-700/50"
                  />
                </div>
              )}
            </div>

            {/* Share Input */}
            <div className="mb-6">
              <label className="block text-sm md:text-base font-semibold text-white mb-3">
                📧 Share with users (comma-separated)
              </label>
              <textarea
                value={shareUsernames}
                onChange={(e) => setShareUsernames(e.target.value)}
                placeholder="Enter names or emails separated by commas&#10;Example: John Doe, jane@example.com"
                className="w-full bg-black/60 border-2 border-gray-700/50 focus:border-[#c0fe72]/50 rounded-xl md:rounded-2xl px-4 py-3 text-white text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0fe72]/30 resize-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleConfirmShare();
                  }
                }}
              />
              <p className="text-xs md:text-sm text-gray-400 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tip: Press Ctrl+Enter to share quickly
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCancelShare}
                className="w-full sm:flex-1 bg-gray-700/50 text-white border-2 border-gray-600 font-semibold py-6 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmShare}
                disabled={!shareUsernames.trim() || sharingPost}
                className="w-full sm:flex-1 bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold py-6 rounded-xl shadow-lg shadow-[#c0fe72]/30 disabled:opacity-50"
              >
                {sharingPost ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share className="w-5 h-5 mr-2" />
                    Share Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Input Container - LinkedIn Style */}
      {currentUser && (
        <div className="fixed bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] md:w-full max-w-3xl px-2 md:px-4">
          <div className="bg-gradient-to-br from-gray-900/98 via-black/98 to-gray-900/98 backdrop-blur-xl rounded-2xl md:rounded-3xl border-2 border-[#c0fe72]/40 shadow-2xl shadow-[#c0fe72]/20">
            {/* Expanded Content */}
            {floatingInputExpanded && (
              <div className="border-b border-gray-700/50 p-4 md:p-5">
                <div className="flex items-start gap-2 md:gap-3 mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#c0fe72]/30">
                    <span className="text-sm md:text-base font-bold text-black">
                      {currentUser?.name?.[0] || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm md:text-base">{currentUser?.name || "User"}</p>
                    <p className="text-xs md:text-sm text-gray-400">{currentUser?.role || "Member"}</p>
                  </div>
                </div>

                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your interview experience, tips, or achievements with the community..."
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-black/60 border-2 border-gray-700/50 focus:border-[#c0fe72]/50 rounded-xl md:rounded-2xl text-white text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0fe72]/30 resize-none"
                  rows={4}
                  autoFocus
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-48 md:max-h-64 object-cover rounded-xl md:rounded-2xl border-2 border-gray-700/50"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black/90 text-white rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Main Input Bar */}
            <div className="relative">
              <div className="flex items-center p-3 md:p-4 gap-2 md:gap-3">
                {/* Compact Input Trigger */}
                {!floatingInputExpanded && (
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#c0fe72] to-[#9cd052] rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#c0fe72]/30">
                    <span className="text-sm md:text-base font-bold text-black">
                      {currentUser?.name?.[0] || "U"}
                    </span>
                  </div>
                )}
                
                <input
                  type="text"
                  value={floatingInputExpanded ? "" : ""}
                  onClick={() => !floatingInputExpanded && setFloatingInputExpanded(true)}
                  readOnly
                  className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm md:text-base focus:outline-none cursor-pointer"
                  placeholder={floatingInputExpanded ? "" : "Start a post..."}
                />

                {/* Action Buttons */}
                <div className="flex items-center gap-1 md:gap-2">
                  {floatingInputExpanded && (
                    <>
                      {/* Add Image Button */}
                      <label className="p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-200 text-gray-400 cursor-pointer" title="Add Image">
                        <Image className="w-5 h-5 md:w-6 md:h-6" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>

                      {/* Cancel Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setFloatingInputExpanded(false);
                          setNewPost("");
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-200 text-gray-400"
                        title="Cancel"
                      >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    </>
                  )}

                  {/* Post/Create Button */}
                  <button
                    onClick={() => {
                      if (floatingInputExpanded) {
                        handleCreatePost();
                      } else {
                        setFloatingInputExpanded(true);
                      }
                    }}
                    disabled={floatingInputExpanded && ((!newPost.trim() && !selectedImage) || creatingPost)}
                    className="p-2 md:p-2.5 rounded-lg md:rounded-xl bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#c0fe72]/30"
                    title={floatingInputExpanded ? "Post" : "Create Post"}
                  >
                    {creatingPost ? (
                      <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                    ) : floatingInputExpanded ? (
                      <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                      </svg>
                    ) : (
                      <Plus className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SocialTab;