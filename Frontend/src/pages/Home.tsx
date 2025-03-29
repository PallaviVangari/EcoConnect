import React from 'react';
import { MessageCircle, Heart, Share2, Bookmark, MoreHorizontal, Send } from 'lucide-react';
import type { Post, User } from '../types';
import { format } from 'date-fns';
import { useAuth0 } from '@auth0/auth0-react';


export function Home() {
  const [currentUser] = React.useState<User>({
    id: 'current-user',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?u=john',
    followers: 245,
    following: 189
  });

  const { logout, user } = useAuth0();

  const [posts, setPosts] = React.useState<Post[]>([
    {
      id: '1',
      userId: '1',
      author: {
        id: '1',
        name: 'Sarah Green',
        email: 'sarah@example.com',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        followers: 1200,
        following: 800
      },
      content: 'Just launched our community recycling initiative! 🌱♻️ Join us in making our neighborhood more sustainable. Check out our collection points and learn how you can contribute to a greener future! #Sustainability #CommunityAction',
      createdAt: new Date().toISOString(),
      likes: 42,
      comments: [],
      isLiked: false,
      tags: ['sustainability', 'recycling', 'community']
    },
    {
      id: '2',
      userId: '2',
      author: {
        id: '2',
        name: 'Mike Rivers',
        email: 'mike@example.com',
        avatar: 'https://i.pravatar.cc/150?u=mike',
        followers: 890,
        following: 750
      },
      content: 'Excited to share our latest eco-friendly product line! 🌿 All packaging is 100% biodegradable and made from recycled materials. Small changes lead to big impact! #EcoFriendly #Sustainable #Innovation',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 24,
      comments: [],
      isLiked: true,
      media: ['https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&auto=format&fit=crop']
    }
  ]);

  const [newPostContent, setNewPostContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now().toString(),
        userId: currentUser.id,
        author: currentUser,
        content: newPostContent,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        isLiked: false,
        tags: extractHashtags(newPostContent)
      };

      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setIsSubmitting(false);
    }, 500);
  };

  // Extract hashtags from post content
  const extractHashtags = (content: string): string[] => {
    const hashtags = content.match(/#[a-zA-Z0-9]+/g);
    return hashtags ? hashtags.map(tag => tag.substring(1).toLowerCase()) : [];
  };

  return (
      <div className="max-w-2xl mx-auto">
        {/* Create Post */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex space-x-3 mb-4">
            <img
                src={currentUser.avatar}
                alt="Your avatar"
                className="h-10 w-10 rounded-full"
            />
            <textarea
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Share your eco-friendly initiative..."
                rows={3}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 text-gray-500">
              <button className="hover:text-green-600 flex items-center space-x-1 active:scale-95 transition-transform">
                <span>📷</span>
                <span className="text-sm">Photo</span>
              </button>
              <button className="hover:text-green-600 flex items-center space-x-1 active:scale-95 transition-transform">
                <span>🏷️</span>
                <span className="text-sm">Tag</span>
              </button>
            </div>
            <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isSubmitting}
            >
              {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </>
              ) : (
                  <>
                    <Send className="h-4 w-4"/>
                    <span>Post</span>
                  </>
              )}
            </button>
          </div>
        </div>
        {/*Logout*/}
        <div className="flex justify-end mb-4">
          <button
              onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>


        {/* Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow">
                {/* Post Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                          src={post.author.avatar}
                          alt={`${post.author.name}'s avatar`}
                          className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(post.createdAt), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 active:scale-95 transition-transform">
                      <MoreHorizontal className="h-5 w-5"/>
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                  {post.tags && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="text-green-600 text-sm hover:underline cursor-pointer">
                      #{tag}
                    </span>
                        ))}
                      </div>
                  )}
                  {post.media && post.media.length > 0 && (
                      <div className="mt-4">
                        <img
                            src={post.media[0]}
                            alt="Post media"
                            className="rounded-lg w-full"
                        />
                      </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-gray-500">
                      <button
                          className={`flex items-center space-x-2 hover:text-green-600 ${post.isLiked ? 'text-green-600' : ''} active:scale-95 transition-transform`}
                          onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`}/>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-green-600 active:scale-95 transition-transform">
                        <MessageCircle className="h-5 w-5"/>
                        <span>{post.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}