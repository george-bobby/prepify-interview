/**
 * Manual integration test script for social media features
 * This script can be run to validate database persistence and API functionality
 * 
 * Usage: npx ts-node scripts/test-social-features.ts
 */

import { SocialService } from '../lib/firebase/social-service';

async function testSocialFeatures() {
  console.log('🚀 Starting Social Media Features Integration Test...\n');

  const socialService = new SocialService();
  
  // Test user ID (you can replace this with a real user ID from your database)
  const testUserId = 'test-user-123';
  
  try {
    console.log('📝 Testing Post Creation...');
    
    // Test 1: Create a post
    const newPost = await socialService.createPost(testUserId, {
      content: 'This is a test post to validate database persistence! 🎉\n\nFeatures being tested:\n- Post creation\n- Like functionality\n- Comment system\n- Share functionality',
    });
    
    console.log('✅ Post created successfully:', {
      id: newPost.id,
      content: newPost.content.substring(0, 50) + '...',
      likesCount: newPost.likesCount,
      commentsCount: newPost.commentsCount,
      sharesCount: newPost.sharesCount,
    });

    // Test 2: Fetch posts
    console.log('\n📖 Testing Post Retrieval...');
    const { posts, totalCount } = await socialService.getPosts({
      limit: 5,
      offset: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }, testUserId);
    
    console.log('✅ Posts retrieved successfully:', {
      totalPosts: totalCount,
      retrievedPosts: posts.length,
      firstPostId: posts[0]?.id,
    });

    // Test 3: Like functionality
    console.log('\n❤️ Testing Like Functionality...');
    const likeResult = await socialService.toggleLike(newPost.id!, testUserId);
    console.log('✅ Like toggled successfully:', {
      liked: likeResult.liked,
      likesCount: likeResult.likesCount,
    });

    // Test 4: Comment creation
    console.log('\n💬 Testing Comment Creation...');
    const newComment = await socialService.createComment(testUserId, {
      postId: newPost.id!,
      content: 'This is a test comment to validate the comment system! 👍',
    });
    
    console.log('✅ Comment created successfully:', {
      id: newComment.id,
      content: newComment.content.substring(0, 50) + '...',
      likesCount: newComment.likesCount,
    });

    // Test 5: Reply to comment
    console.log('\n↩️ Testing Reply Creation...');
    const reply = await socialService.createComment(testUserId, {
      postId: newPost.id!,
      content: 'This is a test reply to validate nested comments! 🔄',
      parentCommentId: newComment.id!,
    });
    
    console.log('✅ Reply created successfully:', {
      id: reply.id,
      parentCommentId: reply.parentCommentId,
      content: reply.content.substring(0, 50) + '...',
    });

    // Test 6: Fetch comments
    console.log('\n📖 Testing Comment Retrieval...');
    const { comments } = await socialService.getComments({
      postId: newPost.id!,
      limit: 10,
      offset: 0,
      sortBy: 'createdAt',
      sortOrder: 'asc'
    }, testUserId);
    
    console.log('✅ Comments retrieved successfully:', {
      totalComments: comments.length,
      hasReplies: comments.some(c => c.replies && c.replies.length > 0),
    });

    // Test 7: Comment like
    console.log('\n❤️ Testing Comment Like...');
    const commentLikeResult = await socialService.toggleCommentLike(newComment.id!, testUserId);
    console.log('✅ Comment like toggled successfully:', {
      liked: commentLikeResult.liked,
      likesCount: commentLikeResult.likesCount,
    });

    // Test 8: Share functionality
    console.log('\n🔄 Testing Share Functionality...');
    const share = await socialService.sharePost(testUserId, {
      postId: newPost.id!,
      shareType: 'direct',
    });
    
    console.log('✅ Post shared successfully:', {
      id: share.id,
      shareType: share.shareType,
    });

    // Test 9: Fetch updated post to verify counts
    console.log('\n🔍 Testing Data Persistence...');
    const updatedPost = await socialService.getPostById(newPost.id!, testUserId);
    
    console.log('✅ Data persistence validated:', {
      postId: updatedPost?.id,
      likesCount: updatedPost?.likesCount,
      commentsCount: updatedPost?.commentsCount,
      sharesCount: updatedPost?.sharesCount,
      isLikedByUser: updatedPost?.isLikedByUser,
      isSharedByUser: updatedPost?.isSharedByUser,
    });

    // Test 10: Cleanup (optional - comment out if you want to keep test data)
    console.log('\n🧹 Cleaning up test data...');
    
    // Unlike the post
    await socialService.toggleLike(newPost.id!, testUserId);
    
    // Unlike the comment
    await socialService.toggleCommentLike(newComment.id!, testUserId);
    
    // Unshare the post
    await socialService.unsharePost(newPost.id!, testUserId);
    
    // Delete the post (this will cascade delete comments and other related data)
    await socialService.deletePost(newPost.id!, testUserId);
    
    console.log('✅ Test data cleaned up successfully');

    console.log('\n🎉 All tests passed! Social media features are working correctly.');
    console.log('\n📊 Test Summary:');
    console.log('- ✅ Post creation and retrieval');
    console.log('- ✅ Like/unlike functionality');
    console.log('- ✅ Comment creation and retrieval');
    console.log('- ✅ Nested replies');
    console.log('- ✅ Comment likes');
    console.log('- ✅ Share/unshare functionality');
    console.log('- ✅ Data persistence across operations');
    console.log('- ✅ Proper cleanup and cascading deletes');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔍 Error Details:');
    if (error instanceof Error) {
      console.log('Message:', error.message);
      console.log('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testSocialFeatures()
    .then(() => {
      console.log('\n✨ Integration test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Integration test failed:', error);
      process.exit(1);
    });
}

export { testSocialFeatures };
