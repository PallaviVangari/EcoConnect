import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Textarea } from "../components/Textarea";
import { Button } from "../components/Button";
import UserProfileCard from "../components/UserProfileCard";
import profileImage from "../components/profilepic.svg";
import { ChatWidget } from "./ChatWidget.tsx";

interface Post {
  postId?: string;
  content: string;
  authorId: string;
  createdDate?: string;
}

export const Home: React.FC = () => {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const { logout, user, isAuthenticated } = useAuth0();

  // Dummy data for fallback
  const getDummyFeed = (): Post[] => [
    {
      postId: "1",
      content: "This is a sample post about eco-friendly living!",
      authorId: "user1",
      createdDate: new Date().toISOString(),
    },
    {
      postId: "2",
      content: "Check out this amazing event happening in our community!",
      authorId: "user2",
      createdDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      postId: "3",
      content: "Recycling tips: Always rinse your containers before recycling.",
      authorId: "user3",
      createdDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
  ];

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!isAuthenticated || !user?.sub) {
      setMessage("You're not logged in");
      return;
    }

    if (content.trim().length === 0 || content.trim().length > 250) {
      setMessage("Post must be between 1 and 250 characters");
      return;
    }

    // Prepare the post object
    const post: Post = {
      content: content.trim(),
      authorId: user.sub,
    };

    // **Clear the input immediately** for a smooth UI
    setContent("");
    setMessage("");

    try {
      await axios.post("http://localhost:8090/api/post/createPost", post);
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage("Failed to create post");
    }
  };

  // Fetch feed data
  const fetchFeed = async () => {
    if (!user?.sub) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8095/api/feed/${user.sub}?limit=10`
      );
      const data = res.data;

      if (data.length === 0) {
        console.log("No data from backend, using dummy data.");
        setFeed(getDummyFeed());
      } else {
        setFeed(data);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
      setMessage("Failed to load feed");
      setFeed(getDummyFeed()); // Use dummy data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeed();
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-xl flex flex-col gap-[30px]">
          {" "}
          {/* Increased width */}
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
              disabled={loading} // Disable button while loading
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
                      userName={post.authorId}
                      postContent={post.content}
                      profileImage={profileImage}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          <ChatWidget />
        </div>
      </div>
    </>
  );
};
