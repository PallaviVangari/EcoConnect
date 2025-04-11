import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { Heading } from "../components/Heading";
import { Img } from "../components/Img"; // Import Img component

type User = {
  id: string;
  userName: string;
  email: string;
  followers: string[];
  following: string[];
  isFollowing: boolean;
};

export function Network() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "discover" | "followers" | "following"
  >("discover");
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const { user: currentUser, isAuthenticated } = useAuth0();

  const USERS_PER_PAGE = 25;

  // API fetch logic
  const fetchUsers = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      let endpoint = `/api/users/getAllUsers`;
      if (activeTab === "followers") {
        endpoint = `/api/users/${currentUser.sub}/followers`;
      } else if (activeTab === "following") {
        endpoint = `/api/users/${currentUser.sub}/following`;
      }

      const res = await axios.get(`http://localhost:8050${endpoint}`);
      const data: User[] = res.data;

      // Filter out users that the current user is already following in the "discover" tab
      const filteredData =
        activeTab === "discover"
          ? data.filter((user) => !user.followers.includes(currentUser.sub))
          : data;

      const pagedData =
        activeTab === "discover"
          ? filteredData.slice(0, USERS_PER_PAGE * page)
          : filteredData;

      const usersWithFollowStatus = pagedData.map((user) => ({
        ...user,
        isFollowing: user.followers?.includes(currentUser.sub) || false,
      }));

      setUsers(usersWithFollowStatus);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  }, [activeTab, currentUser, page]);

  useEffect(() => {
    setPage(1);
    setUsers([]);
  }, [activeTab]);

  useEffect(() => {
    if (isAuthenticated) fetchUsers();
  }, [fetchUsers, activeTab, page, isAuthenticated]);

  // Infinite scroll
  const lastUserRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (activeTab !== "discover") return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage((prev) => prev + 1);
      }
    });

    if (lastUserRef.current) {
      observer.current.observe(lastUserRef.current);
    }
  }, [users, loading, activeTab]);

  const handleFollow = async (
    targetUserId: string,
    currentlyFollowing: boolean
  ) => {
    if (!currentUser) return;

    try {
      const endpoint = currentlyFollowing
        ? `/api/users/${currentUser.sub}/unfollow/${targetUserId}`
        : `/api/users/${currentUser.sub}/follow/${targetUserId}`;

      await axios.post(`http://localhost:8050${endpoint}`);

      setUsers((prev) =>
        prev
          .map((user) =>
            user.id === targetUserId
              ? { ...user, isFollowing: !currentlyFollowing }
              : user
          )
          .filter((user) => {
            // Remove from 'Following' list if unfollowed
            if (activeTab === "following" && currentlyFollowing) {
              return user.id !== targetUserId;
            }
            return true; // Keep all users in 'Discover' tab
          })
      );
    } catch (err) {
      console.error("Error following/unfollowing user", err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-grow">
        <div className="w-full py-10 md:py-12 flex-grow">
          <div className="container mx-auto px-6 md:px-8">
            {/* Tabs */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-10">
                <Button
                  onClick={() => setActiveTab("discover")}
                  className={`${
                    activeTab === "discover"
                      ? "text-[#1d3016] border-b-4 border-[#1d3016] px-6 py-3 text-xl font-bold transition-all duration-300"
                      : "text-[#1d3016] hover:bg-[#f0f0f0] border-b-4 border-transparent px-6 py-3 text-xl font-bold transition-all duration-300"
                  } rounded-md`}
                >
                  Discover
                </Button>
                <Button
                  onClick={() => setActiveTab("followers")}
                  className={`${
                    activeTab === "followers"
                      ? "text-[#1d3016] border-b-4 border-[#1d3016] px-6 py-3 text-xl font-bold transition-all duration-300"
                      : "text-[#1d3016] hover:bg-[#f0f0f0] border-b-4 border-transparent px-6 py-3 text-xl font-bold transition-all duration-300"
                  } rounded-md`}
                >
                  Followers
                </Button>
                <Button
                  onClick={() => setActiveTab("following")}
                  className={`${
                    activeTab === "following"
                      ? "text-[#1d3016] border-b-4 border-[#1d3016] px-6 py-3 text-xl font-bold transition-all duration-300"
                      : "text-[#1d3016] hover:bg-[#f0f0f0] border-b-4 border-transparent px-6 py-3 text-xl font-bold transition-all duration-300"
                  } rounded-md`}
                >
                  Following
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search by username..."
                className="w-full pl-10 pr-4 py-3 border-2 border-[#1d3016] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3016]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* User List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading && users.length === 0 ? (
                <Text className="text-xl">Loading users...</Text>
              ) : filteredUsers.length === 0 ? (
                <Text className="text-xl">No users found.</Text>
              ) : (
                filteredUsers.map((user, index) => (
                  <div
                    key={user.id}
                    ref={
                      index === filteredUsers.length - 1 ? lastUserRef : null
                    }
                    className="bg-white shadow-lg rounded-xl border-2 border-[#1d3016] p-4 hover:shadow-xl transition-all duration-300 w-80 h-auto flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <Img
                        src="images/people.svg"
                        alt="Profile Icon"
                        className="w-14 h-14"
                      />
                      <div>
                        <Text
                          className="text-4xl font-bold text-[#1d3016]"
                          style={{ fontSize: "1.5rem" }}
                        >
                          {user.userName}
                        </Text>
                        <Text className="text-gray-500 text-lg mt-1">
                          {user.followers.length} Followers
                        </Text>
                      </div>
                    </div>
                    {/* <Text className="text-gray-600 text-sm mb-4">
                      {user.email}
                    </Text> */}
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={() => handleFollow(user.id, user.isFollowing)}
                        className={`w-full rounded-md px-4 py-3 transition-all ${
                          user.isFollowing
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-[#1d3016] text-white hover:bg-[#162c10]"
                        }`}
                      >
                        {user.isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
