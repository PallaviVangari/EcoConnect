import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Search, Users, UserPlus, UserMinus } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";

type User = {
  id: string;
  userName: string;
  email: string;
  followers: string[];
  following: string[];
  isFollowing: boolean;
  location?: string;
  bio?: string;
};

export function Network() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'discover' | 'followers' | 'following'>('discover');
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
      if (activeTab === 'followers') {
        endpoint = `/api/users/${currentUser.sub}/followers`;
      } else if (activeTab === 'following') {
        endpoint = `/api/users/${currentUser.sub}/following`;
      }

      const res = await axios.get(`http://localhost:8050${endpoint}`);
      const data: User[] = res.data;

      const pagedData = activeTab === 'discover'
          ? data.slice(0, USERS_PER_PAGE * page)
          : data;

      if (currentUser.sub != null) {
        if (currentUser.sub != null) {
          const usersWithFollowStatus = pagedData.map(user => ({
            ...user,
            isFollowing: user.followers?.includes(currentUser.sub) || false,
          }));
          setUsers(usersWithFollowStatus);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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
    if (activeTab !== 'discover') return;

    if (observer.current) if ("disconnect" in observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        setPage(prev => prev + 1);
      }
    });

    if (lastUserRef.current) {
      if ("observe" in observer.current) {
        observer.current.observe(lastUserRef.current);
      }
    }
  }, [users, loading, activeTab]);

  const handleFollow = async (targetUserId: string, currentlyFollowing: boolean) => {
    if (!currentUser) return;

    try {
      const endpoint = currentlyFollowing
          ? `/api/users/${currentUser.sub}/unfollow/${targetUserId}`
          : `/api/users/${currentUser.sub}/follow/${targetUserId}`;

      await axios.post(`http://localhost:8050${endpoint}`);

      setUsers(prev => {
        if (activeTab === 'following') {
          return prev.filter(user => user.id !== targetUserId); // Remove from list
        } else {
          return prev.map(user =>
              user.id === targetUserId
                  ? { ...user, isFollowing: !currentlyFollowing }
                  : user
          );
        }
      });
    } catch (err) {
      console.error('Error following/unfollowing user', err);
    }
  };


  const filteredUsers = users.filter(user =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="p-6 max-w-5xl mx-auto">
        {/* Tab buttons */}
        <div className="flex items-center space-x-4 mb-6">
          {['discover', 'followers', 'following'].map(tab => (
              <button
                  key={tab}
                  className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveTab(tab as any)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
              type="text"
              placeholder="Search by username..."
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* User List */}
        {loading && users.length === 0 ? (
            <p className="text-center text-gray-500">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No users found.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user, index) => (
                  <div
                      key={user.id}
                      ref={index === filteredUsers.length - 1 ? lastUserRef : null}
                      className="bg-white shadow rounded-xl p-4 flex items-start space-x-4"
                  >
                    <Users className="w-10 h-10 text-green-500" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{user.userName}</h3>
                      <p className="text-sm text-gray-600">{user.location}</p>
                    </div>
                    {activeTab !== 'followers' && user.id !== currentUser?.sub && (
                        <button
                            onClick={() => handleFollow(user.id, user.isFollowing)}
                            className={`ml-auto p-2 rounded-full ${
                                user.isFollowing ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}
                        >
                          {user.isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />}
                        </button>
                    )}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}
