import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import {
  User as UserIcon,
  Mail,
  Users,
  UserPlus,
  Pencil,
  Save,
  X,
  Trash2,
  Edit3,
  CalendarDays
} from "lucide-react";

interface Post {
  postId?: string;
  content: string;
  authorId: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

interface User {
  id: string;
  userName: string;
  email: string;
  followers: string[];
  following: string[];
  location?: string;
  profileImage?: string;
  bio?: string;
}

export function Profile() {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    location: "",
    bio: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.sub) return;

      try {
        const res = await axios.get<User>(`http://localhost:8050/api/users/getUserById/${user.sub}`);
        const fetchedUser = res.data;
        setUserData(fetchedUser);

        const postsRes = await axios.get<Post[]>(`http://localhost:8090/api/post/getUserPosts/${fetchedUser.id}`);
        setPosts(postsRes.data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    fetchUserData();
  }, [user?.sub]);

  useEffect(() => {
    if (userData) {
      setProfileForm({
        location: userData.location || "",
        bio: userData.bio || "",
        profileImage: userData.profileImage || "",
      });
    }
  }, [userData]);

  const handleEdit = (post: Post) => {
    setEditPostId(post.postId);
    setEditContent(post.content);
  };

  const handleSave = async (postId: string) => {
    if (!userData) return;
    try {
      await axios.put(`http://localhost:8090/api/post/updatePost/${userData.id}/${postId}?isAdmin=false`, {
        content: editContent,
      });
      setPosts((prev) =>
          prev.map((post) =>
              post.postId === postId ? { ...post, content: editContent } : post
          )
      );
      setEditPostId(null);
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!userData) return;
    try {
      await axios.delete(`http://localhost:8090/api/post/deletePost/${userData.id}/${postId}?isAdmin=false`);
      setPosts((prev) => prev.filter((post) => post.postId !== postId));
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!userData) return;

    try {
      const res = await axios.put(`http://localhost:8050/api/users/${userData.userName}`, {
        ...userData,
        location: profileForm.location,
        profileImage: profileForm.profileImage,
        bio: profileForm.bio,
      });
      setUserData(res.data);
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  const formatDate = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };


  if (!isAuthenticated) return <div className="text-center mt-8">Please log in to view your profile.</div>;

  return (
      <div className="max-w-3xl mx-auto mt-10 p-4">
        {/* Profile Card */}
        <div className="bg-white border shadow-lg rounded-2xl p-6 mb-8 relative">
          <div className="flex items-center gap-4 mb-4">
            <UserIcon className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-semibold">Your Profile</h1>
          </div>
          <div className="ml-2 space-y-2 text-gray-700">
            <p className="flex items-center gap-2"><UserIcon size={18} /> <strong>Name:</strong> {userData?.userName}</p>
            <p className="flex items-center gap-2"><Mail size={18} /> <strong>Email:</strong> {userData?.email}</p>
            <p className="flex items-center gap-2"><Users size={18} /> <strong>Followers:</strong> {userData?.followers.length}</p>
            <p className="flex items-center gap-2"><UserPlus size={18} /> <strong>Following:</strong> {userData?.following.length}</p>
            <p className="flex items-center gap-2">📍 <strong>Location:</strong> {userData?.location || "N/A"}</p>
            <p className="flex items-center gap-2">📝 <strong>About me:</strong> {userData?.bio || "N/A"}</p>
            <button
                onClick={() => setIsEditingProfile(true)}
                className="absolute bottom-4 right-4 bg-white border rounded-full p-2 shadow hover:bg-gray-100 group"
            >
              <Pencil size={18} className="text-gray-600 group-hover:text-black" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Edit
            </span>
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
                <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
                <p>Location:</p>
                <input
                    type="text"
                    name="location"
                    value={profileForm.location}
                    onChange={handleProfileInputChange}
                    placeholder="Location"
                    className="w-full p-2 border rounded"
                />
                <p>About:</p>
                <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileInputChange}
                    placeholder="Bio"
                    rows={3}
                    className="w-full p-2 border rounded resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                      onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </button>
                  <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      onClick={handleSaveProfile}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Posts</h2>
          <ul className="space-y-4">
            {posts.map((post) => (
                <li key={post.postId} className="bg-white p-4 border rounded-xl shadow">
                  {editPostId === post.postId ? (
                      <>
                  <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border rounded p-2 mb-3 resize-none"
                      rows={3}
                  />
                        <div className="flex gap-3">
                          <button
                              onClick={() => handleSave(post.postId)}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded"
                          >
                            <Save size={16} /> Save
                          </button>
                          <button
                              onClick={() => setEditPostId(null)}
                              className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded"
                          >
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      </>
                  ) : (
                      <>
                        <p className="mb-2 text-gray-800">{post.content}</p>
                        <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                          <CalendarDays size={16} />
                          {formatDate(post.lastModifiedDate)}
                        </div>
                        <div className="flex gap-2">
                          <button
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                              onClick={() => handleEdit(post)}
                          >
                            <Edit3 size={16} /> Edit
                          </button>
                          <button
                              className="flex items-center gap-1 text-red-600 hover:underline"
                              onClick={() => handleDelete(post.postId)}
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </>
                  )}
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
}
