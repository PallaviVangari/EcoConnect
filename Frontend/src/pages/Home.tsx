import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Textarea } from "../components/Textarea";
import { Button } from "../components/Button";
import UserProfileCard from "../components/UserProfileCard";
import { formatDistanceToNow } from "date-fns";

interface Post {
  postId?: string;
  content: string;
  authorId: string;
  createdDate?: string;
  authorName?: string;
}

export const Home: React.FC = () => {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user, isAuthenticated } = useAuth0();
  const hasFetchedRef = useRef(false);

  // Dummy fallback
  const getDummyFeed = (): Post[] => [
    {
      postId: "1",
      content: "This is a sample post about eco-friendly living!",
      authorId: "user1",
      createdDate: new Date().toISOString(),
      authorName: "User1",
    },
    {
      postId: "2",
      content: "Check out this amazing event happening in our community!",
      authorId: "user2",
      createdDate: new Date(Date.now() - 3600000).toISOString(),
      authorName: "User2",
    },
    {
      postId: "3",
      content: "Recycling tips: Always rinse your containers before recycling.",
      authorId: "user3",
      createdDate: new Date(Date.now() - 7200000).toISOString(),
      authorName: "User3",
    },
  ];

  // Handle post creation
  const handlePostSubmit = async () => {
    if (!isAuthenticated || !user?.sub) {
      setMessage("You're not logged in");
      return;
    }

    if (content.trim().length === 0 || content.trim().length > 250) {
      setMessage("Post must be between 1 and 250 characters");
      return;
    }

    const post: Post = {
      content: content.trim(),
      authorId: user.sub,
    };

    setContent("");
    setMessage("");

    try {
      await axios.post("http://localhost:8090/api/post/createPost", post);
      hasFetchedRef.current = false;
      fetchFeed(); // refresh full feed after new post
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage("Failed to create post");
    }
  };

  // Initial full fetch
  const fetchFeed = async () => {
    if (!user?.sub || hasFetchedRef.current) return;

    setLoading(true);
    hasFetchedRef.current = true;

    try {
      const res = await axios.get(
          `http://localhost:8095/api/feed/${user.sub}?limit=50`
      );
      const data: Post[] = res.data;

      const seen = new Set<string>();
      const unique = data.filter((p) => {
        if (!p.postId || seen.has(p.postId)) return false;
        seen.add(p.postId);
        return true;
      });

      setFeed(unique.length > 0 ? unique : getDummyFeed());
    } catch (error) {
      console.error("Error fetching feed:", error);
      setMessage("Failed to load feed");
      setFeed(getDummyFeed());
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh (new posts only)
  const fetchNewPosts = async () => {
    if (!user?.sub || feed.length === 0 || document.hidden) return;

    const latest = feed[0].createdDate;
    if (!latest) return;

    try {
      const res = await axios.get(
          `http://localhost:8095/api/feed/${user.sub}?limit=50&newerThan=${latest}`
      );
      const newPosts: Post[] = res.data;

      const seen = new Set(feed.map((p) => p.postId));
      const filtered = newPosts.filter(
          (p) => p.postId && !seen.has(p.postId)
      );

      if (filtered.length > 0) {
        setFeed((prev) => [...filtered, ...prev]);
      }
    } catch (err) {
      console.error("Error checking for new posts:", err);
    }
  };

  // Initial + polling
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchFeed(); // initial

    intervalRef.current = setInterval(() => {
      fetchNewPosts();
    }, 15000); // every 15 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, user?.sub, feed]);

  return (
      <div className="flex justify-center">
        <div className="w-full max-w-xl flex flex-col gap-[30px]">
          <div className="flex flex-col gap-2.5">
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 w-full p-4 border border-[#1D3016] rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-[#1D3016]"
            />
            <Button
              onClick={handlePostSubmit}
              className="mt-2 bg-[#1D3016] text-white rounded-md py-2 w-full"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </Button>
            {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading feed...</p>
            ) : feed.length === 0 ? (
              <p className="text-center text-gray-500">No posts available.</p>
            ) : (
                feed.map((post) => (
                    <div
                        key={post.postId}
                        className="flex flex-col gap-4 p-4 border rounded-md bg-gray-50 shadow-md"
                    >
                      <div className="flex gap-3 items-start">
                        <UserProfileCard
                            userName={post.authorName}
                            postContent={post.content}
                        />
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.createdDate
                            ? formatDistanceToNow(new Date(post.createdDate), {
                              addSuffix: true,
                            })
                            : "Just now"}
                      </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
  );
};
