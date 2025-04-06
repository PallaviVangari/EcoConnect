// import React from 'react';
// import { Search, UserPlus, Users, Filter, Check, UserMinus } from 'lucide-react';
// import type { User } from '../types';
//
// export function Network() {
//   const [searchQuery, setSearchQuery] = React.useState('');
//   const [activeTab, setActiveTab] = React.useState<'discover' | 'following' | 'followers'>('discover');
//   const [users, setUsers] = React.useState<User[]>([
//     {
//       id: '1',
//       name: 'Emma Wilson',
//       email: 'emma@example.com',
//       avatar: 'https://i.pravatar.cc/150?u=emma',
//       bio: 'Environmental Engineer | Passionate about renewable energy and sustainable urban development',
//       followers: 1542,
//       following: 891,
//       interests: ['Renewable Energy', 'Urban Planning', 'Sustainability'],
//       isFollowing: false
//     },
//     {
//       id: '2',
//       name: 'David Chen',
//       email: 'david@example.com',
//       avatar: 'https://i.pravatar.cc/150?u=david',
//       bio: 'Climate Change Researcher | Working on innovative solutions for a sustainable future',
//       followers: 2103,
//       following: 764,
//       interests: ['Climate Change', 'Research', 'Innovation'],
//       isFollowing: false
//     },
//     {
//       id: '3',
//       name: 'Sofia Rodriguez',
//       email: 'sofia@example.com',
//       avatar: 'https://i.pravatar.cc/150?u=sofia',
//       bio: 'Zero Waste Advocate | Teaching communities about sustainable living',
//       followers: 982,
//       following: 445,
//       interests: ['Zero Waste', 'Community Building', 'Education'],
//       isFollowing: true
//     }
//   ]);
//
//   const handleFollow = (userId: string) => {
//     setUsers(users.map(user =>
//       user.id === userId
//         ? {
//             ...user,
//             followers: user.isFollowing ? user.followers - 1 : user.followers + 1,
//             isFollowing: !user.isFollowing
//           }
//         : user
//     ));
//   };
//
//   const filteredUsers = users.filter(user => {
//     // Filter by search query
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.interests?.some(interest =>
//         interest.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//
//     // Filter by active tab
//     if (activeTab === 'following') {
//       return matchesSearch && user.isFollowing;
//     } else if (activeTab === 'followers') {
//       // For demo purposes, just show some users as followers
//       return matchesSearch && ['1', '3'].includes(user.id);
//     }
//
//     return matchesSearch;
//   });
//
//   return (
//     <div className="max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Network</h1>
//         <p className="text-gray-600">Connect with eco-conscious individuals and organizations</p>
//       </div>
//
//       {/* Search and Filter */}
//       <div className="bg-white rounded-lg shadow p-4 mb-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               placeholder="Search by name, bio, or interests..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//             <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
//           </div>
//           <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-transform">
//             <Filter className="h-5 w-5 text-gray-500" />
//             <span>Filters</span>
//           </button>
//         </div>
//       </div>
//
//       {/* Tabs */}
//       <div className="border-b border-gray-200 mb-6">
//         <nav className="flex space-x-8 overflow-x-auto">
//           <button
//             onClick={() => setActiveTab('discover')}
//             className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
//               activeTab === 'discover'
//                 ? 'border-green-500 text-green-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             <Users className="h-5 w-5 inline-block mr-2" />
//             Discover
//           </button>
//           <button
//             onClick={() => setActiveTab('following')}
//             className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
//               activeTab === 'following'
//                 ? 'border-green-500 text-green-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Following
//           </button>
//           <button
//             onClick={() => setActiveTab('followers')}
//             className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
//               activeTab === 'followers'
//                 ? 'border-green-500 text-green-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//             }`}
//           >
//             Followers
//           </button>
//         </nav>
//       </div>
//
//       {/* User Grid */}
//       {filteredUsers.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredUsers.map((user) => (
//             <div key={user.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-start space-x-4">
//                     <img
//                       src={user.avatar}
//                       alt={`${user.name}'s avatar`}
//                       className="h-12 w-12 rounded-full"
//                     />
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{user.name}</h3>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleFollow(user.id)}
//                     className={`flex items-center space-x-1 px-3 py-1 rounded-full active:scale-95 transition-transform ${
//                       user.isFollowing
//                         ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                         : 'bg-green-50 text-green-600 hover:bg-green-100'
//                     }`}
//                   >
//                     {user.isFollowing ? (
//                       <>
//                         <UserMinus className="h-4 w-4" />
//                         <span className="text-sm">Unfollow</span>
//                       </>
//                     ) : (
//                       <>
//                         <UserPlus className="h-4 w-4" />
//                         <span className="text-sm">Follow</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//
//                 <p className="text-gray-600 text-sm mb-4">{user.bio}</p>
//
//                 <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
//                   <span>{user.followers} followers</span>
//                   <span>{user.following} following</span>
//                 </div>
//
//                 {user.interests && (
//                   <div className="flex flex-wrap gap-2">
//                     {user.interests.map(interest => (
//                       <span
//                         key={interest}
//                         className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs cursor-pointer hover:bg-gray-200"
//                       >
//                         {interest}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow p-8 text-center">
//           <p className="text-gray-600 mb-2">No users found matching your criteria.</p>
//           <p className="text-gray-500">Try adjusting your search or filters.</p>
//         </div>
//       )}
//     </div>
//   );
// }
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

      const usersWithFollowStatus = pagedData.map(user => ({
        ...user,
        isFollowing: user.followers?.includes(currentUser.sub) || false,
      }));

      setUsers(usersWithFollowStatus);
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

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        setPage(prev => prev + 1);
      }
    });

    if (lastUserRef.current) {
      observer.current.observe(lastUserRef.current);
    }
  }, [users, loading, activeTab]);

  const handleFollow = async (targetUserId: string, currentlyFollowing: boolean) => {
    if (!currentUser) return;

    try {
      const endpoint = currentlyFollowing
          ? `/api/users/${currentUser.sub}/unfollow/${targetUserId}`
          : `/api/users/${currentUser.sub}/follow/${targetUserId}`;

      await axios.post(`http://localhost:8050${endpoint}`);

      // Refresh only this user’s follow status
      setUsers(prev =>
          prev.map(user =>
              user.id === targetUserId
                  ? { ...user, isFollowing: !currentlyFollowing }
                  : user
          )
      );
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
                      <p className="text-sm text-gray-600">Location coming soon</p>
                    </div>
                    {user.id !== currentUser?.sub && (
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
