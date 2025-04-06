// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   Settings,
//   Edit,
//   MapPin,
//   Link as LinkIcon,
//   Calendar,
//   Award,
//   Leaf,
//   BookOpen,
//   ChevronDown,
//   Grid,
//   ListFilter,
//   BarChart2,
//   ShoppingBag,
//   Users,
//   Save,
//   X
// } from 'lucide-react';
// import type { User, Post, Event, MarketplaceItem } from '../types';
//
// export function Profile() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = React.useState<'posts' | 'events' | 'marketplace' | 'impact'>('posts');
//   const [isEditMode, setIsEditMode] = React.useState(false);
//   const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
//   const [showMobileMenu, setShowMobileMenu] = React.useState(false);
//
//   const [user, setUser] = React.useState<User>({
//     id: 'current-user',
//     name: 'John Doe',
//     email: 'john@example.com',
//     avatar: 'https://i.pravatar.cc/150?u=john',
//     bio: 'Environmental enthusiast | Zero waste advocate | Building a sustainable future',
//     followers: 245,
//     following: 189,
//     location: 'San Francisco, CA',
//     website: 'https://johndoe.eco',
//     joinDate: '2024-01-15',
//     interests: ['Renewable Energy', 'Zero Waste', 'Urban Gardening'],
//     achievements: [
//       { id: '1', title: 'Carbon Reducer', description: 'Reduced carbon footprint by 20%', icon: '🌱' },
//       { id: '2', title: 'Community Leader', description: 'Led 5 environmental initiatives', icon: '👥' },
//       { id: '3', title: 'Eco Innovator', description: 'Started 3 sustainable projects', icon: '💡' }
//     ]
//   });
//
//   // Form state for edit mode
//   const [formData, setFormData] = React.useState({
//     name: user.name,
//     bio: user.bio || '',
//     location: user.location || '',
//     website: user.website || '',
//     interests: user.interests?.join(', ') || ''
//   });
//
//   const [userContent] = React.useState({
//     posts: [
//       {
//         id: '1',
//         content: 'Just started my new composting project! 🌱 Excited to reduce food waste and create nutrient-rich soil for my garden. #Sustainability #ZeroWaste',
//         createdAt: new Date(Date.now() - 86400000).toISOString(),
//         likes: 24,
//         comments: 5,
//         image: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?w=800&auto=format&fit=crop'
//       },
//       {
//         id: '2',
//         content: 'Attended an amazing workshop on renewable energy today. The future is bright! ☀️ #CleanEnergy #Sustainability',
//         createdAt: new Date(Date.now() - 172800000).toISOString(),
//         likes: 18,
//         comments: 3
//       }
//     ] as Post[],
//     events: [
//       {
//         id: '1',
//         title: 'Community Garden Workshop',
//         date: '2025-04-20',
//         time: '10:00',
//         location: 'Central Park',
//         attendees: 15,
//         image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop'
//       }
//     ] as Event[],
//     marketplace: [
//       {
//         id: '1',
//         title: 'Handmade Bamboo Utensils',
//         price: 24.99,
//         status: 'available',
//         image: 'https://images.unsplash.com/photo-1584346133934-a3c3f0e75d0e?w=800&auto=format&fit=crop'
//       }
//     ] as MarketplaceItem[],
//     impact: {
//       carbonSaved: 1250, // kg
//       treesPlanted: 15,
//       wasteReduced: 85, // kg
//       communityEvents: 8
//     }
//   });
//
//   const handleEditProfile = () => {
//     setIsEditMode(true);
//     setFormData({
//       name: user.name,
//       bio: user.bio || '',
//       location: user.location || '',
//       website: user.website || '',
//       interests: user.interests?.join(', ') || ''
//     });
//   };
//
//   const handleSaveProfile = () => {
//     // Update user data
//     setUser({
//       ...user,
//       name: formData.name,
//       bio: formData.bio,
//       location: formData.location,
//       website: formData.website,
//       interests: formData.interests.split(',').map(interest => interest.trim()).filter(Boolean)
//     });
//
//     setIsEditMode(false);
//   };
//
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//
//   const handleSettingsClick = () => {
//     navigate('/settings');
//   };
//
//   return (
//     <div className="max-w-5xl mx-auto">
//       {/* Profile Header */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="relative h-32 sm:h-48 rounded-t-lg overflow-hidden">
//           <img
//             src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200&auto=format&fit=crop"
//             alt="Profile cover"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute bottom-4 right-4 space-x-2">
//             {isEditMode ? (
//               <>
//                 <button
//                   onClick={handleSaveProfile}
//                   className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm active:scale-95"
//                 >
//                   <Save className="h-4 w-4" />
//                   <span className="hidden sm:inline">Save Changes</span>
//                 </button>
//                 <button
//                   onClick={() => setIsEditMode(false)}
//                   className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm active:scale-95"
//                 >
//                   <X className="h-4 w-4" />
//                   <span className="hidden sm:inline">Cancel</span>
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={handleEditProfile}
//                 className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm active:scale-95"
//               >
//                 <Edit className="h-4 w-4" />
//                 <span className="hidden sm:inline">Edit Profile</span>
//               </button>
//             )}
//           </div>
//         </div>
//
//         <div className="px-4 sm:px-6 pb-6">
//           <div className="flex justify-between items-end relative">
//             <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-4">
//               <div className="relative -mt-12 z-10">
//                 <img
//                   src={user.avatar}
//                   alt={user.name}
//                   className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white shadow-md"
//                 />
//               </div>
//               <div className="mt-2 sm:mt-0 max-w-[calc(100%-80px)] sm:max-w-none">
//                 {isEditMode ? (
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="text-xl sm:text-2xl font-bold text-gray-900 bg-white border border-gray-300 px-2 py-1 rounded-md w-full sm:w-auto focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h1>
//                 )}
//                 {isEditMode ? (
//                   <textarea
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleInputChange}
//                     rows={2}
//                     className="text-sm text-gray-600 bg-white border border-gray-300 px-2 py-1 rounded-md w-full mt-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="Add a bio"
//                   />
//                 ) : (
//                   <p className="text-sm text-gray-600">{user.bio}</p>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={handleSettingsClick}
//               className="text-gray-600 hover:text-gray-800 active:scale-95 transition-transform absolute top-0 right-0 sm:relative"
//               aria-label="Settings"
//             >
//               <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
//             </button>
//           </div>
//
//           <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
//             <div className="text-center">
//               <div className="text-lg sm:text-2xl font-bold text-gray-900">{user.followers}</div>
//               <div className="text-xs sm:text-sm text-gray-500">Followers</div>
//             </div>
//             <div className="text-center">
//               <div className="text-lg sm:text-2xl font-bold text-gray-900">{user.following}</div>
//               <div className="text-xs sm:text-sm text-gray-500">Following</div>
//             </div>
//             <div className="text-center">
//               <div className="text-lg sm:text-2xl font-bold text-gray-900">{userContent.impact.treesPlanted}</div>
//               <div className="text-xs sm:text-sm text-gray-500">Trees Planted</div>
//             </div>
//             <div className="text-center">
//               <div className="text-lg sm:text-2xl font-bold text-gray-900">{userContent.impact.communityEvents}</div>
//               <div className="text-xs sm:text-sm text-gray-500">Events Organized</div>
//             </div>
//           </div>
//
//           <div className="mt-6 flex flex-wrap gap-2 sm:gap-4">
//             {isEditMode ? (
//               <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
//                   <div className="flex items-center">
//                     <MapPin className="h-4 w-4 mr-1 text-gray-400" />
//                     <input
//                       type="text"
//                       name="location"
//                       value={formData.location}
//                       onChange={handleInputChange}
//                       className="flex-1 text-sm bg-white border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       placeholder="Add location"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
//                   <div className="flex items-center">
//                     <LinkIcon className="h-4 w-4 mr-1 text-gray-400" />
//                     <input
//                       type="text"
//                       name="website"
//                       value={formData.website}
//                       onChange={handleInputChange}
//                       className="flex-1 text-sm bg-white border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       placeholder="Add website"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="flex items-center text-gray-600 text-sm">
//                   <MapPin className="h-4 w-4 mr-1" />
//                   <span>{user.location}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600 text-sm">
//                   <LinkIcon className="h-4 w-4 mr-1" />
//                   <a href={user.website} className="text-green-600 hover:underline">{user.website}</a>
//                 </div>
//                 <div className="flex items-center text-gray-600 text-sm">
//                   <Calendar className="h-4 w-4 mr-1" />
//                   <span>Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
//                 </div>
//               </>
//             )}
//           </div>
//
//           <div className="mt-6">
//             <h3 className="text-sm font-semibold text-gray-900 mb-2">Interests</h3>
//             {isEditMode ? (
//               <div>
//                 <input
//                   type="text"
//                   name="interests"
//                   value={formData.interests}
//                   onChange={handleInputChange}
//                   className="w-full text-sm bg-white border border-gray-300 px-2 py-1 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Add interests (comma separated)"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">Separate interests with commas</p>
//               </div>
//             ) : (
//               <div className="flex flex-wrap gap-2">
//                 {user.interests.map(interest => (
//                   <span
//                     key={interest}
//                     className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs sm:text-sm"
//                   >
//                     {interest}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//
//       {/* Achievements */}
//       <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
//         <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
//           <Award className="h-5 w-5 mr-2 text-green-600" />
//           Achievements
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {user.achievements.map(achievement => (
//             <div
//               key={achievement.id}
//               className="p-3 sm:p-4 border border-gray-100 rounded-lg hover:border-green-200 transition-colors"
//             >
//               <div className="flex items-start space-x-3">
//                 <span className="text-xl sm:text-2xl">{achievement.icon}</span>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{achievement.title}</h3>
//                   <p className="text-xs sm:text-sm text-gray-600">{achievement.description}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//
//       {/* Environmental Impact */}
//       <div className="bg-white rounded-lg shadow mb-6 p-4 sm:p-6">
//         <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
//           <Leaf className="h-5 w-5 mr-2 text-green-600" />
//           Environmental Impact
//         </h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
//           <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
//             <div className="text-lg sm:text-2xl font-bold text-green-600">{userContent.impact.carbonSaved}kg</div>
//             <div className="text-xs sm:text-sm text-gray-600">Carbon Saved</div>
//           </div>
//           <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
//             <div className="text-lg sm:text-2xl font-bold text-green-600">{userContent.impact.treesPlanted}</div>
//             <div className="text-xs sm:text-sm text-gray-600">Trees Planted</div>
//           </div>
//           <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
//             <div className="text-lg sm:text-2xl font-bold text-green-600">{userContent.impact.wasteReduced}kg</div>
//             <div className="text-xs sm:text-sm text-gray-600">Waste Reduced</div>
//           </div>
//           <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
//             <div className="text-lg sm:text-2xl font-bold text-green-600">{userContent.impact.communityEvents}</div>
//             <div className="text-xs sm:text-sm text-gray-600">Community Events</div>
//           </div>
//         </div>
//       </div>
//
//       {/* Content Tabs */}
//       <div className="bg-white rounded-lg shadow">
//         <div className="border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6">
//             {/* Mobile dropdown for tabs */}
//             <div className="sm:hidden py-3 relative">
//               <button
//                 onClick={() => setShowMobileMenu(!showMobileMenu)}
//                 className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white"
//               >
//                 <span className="font-medium text-gray-900">
//                   {activeTab === 'posts' ? 'Posts' :
//                    activeTab === 'events' ? 'Events' :
//                    activeTab === 'marketplace' ? 'Marketplace' : 'Impact'}
//                 </span>
//                 <ChevronDown className="h-5 w-5 text-gray-500" />
//               </button>
//
//               {showMobileMenu && (
//                 <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
//                   <div className="py-1">
//                     <button
//                       onClick={() => {
//                         setActiveTab('posts');
//                         setShowMobileMenu(false);
//                       }}
//                       className={`w-full text-left px-4 py-2 text-sm ${
//                         activeTab === 'posts' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
//                       }`}
//                     >
//                       Posts
//                     </button>
//                     <button
//                       onClick={() => {
//                         setActiveTab('events');
//                         setShowMobileMenu(false);
//                       }}
//                       className={`w-full text-left px-4 py-2 text-sm ${
//                         activeTab === 'events' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
//                       }`}
//                     >
//                       Events
//                     </button>
//                     <button
//                       onClick={() => {
//                         setActiveTab('marketplace');
//                         setShowMobileMenu(false);
//                       }}
//                       className={`w-full text-left px-4 py-2 text-sm ${
//                         activeTab === 'marketplace' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
//                       }`}
//                     >
//                       Marketplace
//                     </button>
//                     <button
//                       onClick={() => {
//                         setActiveTab('impact');
//                         setShowMobileMenu(false);
//                       }}
//                       className={`w-full text-left px-4 py-2 text-sm ${
//                         activeTab === 'impact' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
//                       }`}
//                     >
//                       Impact
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//
//             {/* Desktop tabs */}
//             <nav className="hidden sm:flex space-x-8 overflow-x-auto">
//               <button
//                 onClick={() => setActiveTab('posts')}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
//                   activeTab === 'posts'
//                     ? 'border-green-500 text-green-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 <BookOpen className="h-5 w-5" />
//                 <span>Posts</span>
//               </button>
//               <button
//                 onClick={() => setActiveTab('events')}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
//                   activeTab === 'events'
//                     ? 'border-green-500 text-green-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 <Calendar className="h-5 w-5" />
//                 <span>Events</span>
//               </button>
//               <button
//                 onClick={() => setActiveTab('marketplace')}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
//                   activeTab === 'marketplace'
//                     ? 'border-green-500 text-green-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 <ShoppingBag className="h-5 w-5" />
//                 <span>Marketplace</span>
//               </button>
//               <button
//                 onClick={() => setActiveTab('impact')}
//                 className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
//                   activeTab === 'impact'
//                     ? 'border-green-500 text-green-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 <BarChart2 className="h-5 w-5" />
//                 <span>Impact</span>
//               </button>
//             </nav>
//
//             {/* View mode toggle */}
//             <div className="flex items-center space-x-4 py-3 sm:py-0 border-t sm:border-t-0">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-2 rounded-lg ${
//                   viewMode === 'grid'
//                     ? 'bg-gray-100 text-gray-900'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 <Grid className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-2 rounded-lg ${
//                   viewMode === 'list'
//                     ? 'bg-gray-100 text-gray-900'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 <ListFilter className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//
//         <div className="p-4 sm:p-6">
//           {activeTab === 'posts' && (
//             <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4 sm:space-y-6'}>
//               {userContent.posts.map(post => (
//                 <div
//                   key={post.id}
//                   className={`bg-white rounded-lg ${
//                     viewMode === 'grid' ? '' : 'border'
//                   } hover:shadow-md transition-shadow`}
//                 >
//                   {post.image && (
//                     <img
//                       src={post.image}
//                       alt=""
//                       className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
//                     />
//                   )}
//                   <div className="p-3 sm:p-4">
//                     <p className="text-gray-900 text-sm sm:text-base">{post.content}</p>
//                     <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs sm:text-sm text-gray-500">
//                       <div className="flex items-center space-x-4">
//                         <span>{post.likes} likes</span>
//                         <span>{post.comments} comments</span>
//                       </div>
//                       <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//
//           {activeTab === 'events' && (
//             <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4 sm:space-y-6'}>
//               {userContent.events.map(event => (
//                 <div
//                   key={event.id}
//                   className={`bg-white rounded-lg ${
//                     viewMode === 'grid' ? '' : 'border'
//                   } hover:shadow-md transition-shadow`}
//                 >
//                   {event.image && (
//                     <img
//                       src={event.image}
//                       alt={event.title}
//                       className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
//                     />
//                   )}
//                   <div className="p-3 sm:p-4">
//                     <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{event.title}</h3>
//                     <div className="mt-2 space-y-2 text-xs sm:text-sm text-gray-600">
//                       <div className="flex items-center">
//                         <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
//                         <span>{event.date} at {event.time}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
//                         <span className="truncate">{event.location}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Users className="h-4 w-4 mr-2 flex-shrink-0" />
//                         <span>{event.attendees} attendees</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//
//           {activeTab === 'marketplace' && (
//             <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6' : 'space-y-4 sm:space-y-6'}>
//               {userContent.marketplace.map(item => (
//                 <div
//                   key={item.id}
//                   className={`bg-white rounded-lg ${
//                     viewMode === 'grid' ? '' : 'border'
//                   } hover:shadow-md transition-shadow`}
//                 >
//                   {item.image && (
//                     <img
//                       src={item.image}
//                       alt={item.title}
//                       className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
//                     />
//                   )}
//                   <div className="p-3 sm:p-4">
//                     <div className="flex justify-between items-start">
//                       <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.title}</h3>
//                       <span className="text-green-600 font-semibold text-sm sm:text-base">${item.price}</span>
//                     </div>
//                     <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
//                       item.status === 'available'
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//
//           {activeTab === 'impact' && (
//             <div className="space-y-4 sm:space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//                 <div className="bg-white p-4 sm:p-6 rounded-lg border">
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Carbon Footprint</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
//                         <span>Carbon Saved</span>
//                         <span>{userContent.impact.carbonSaved}kg</span>
//                       </div>
//                       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-green-500"
//                           style={{ width: '75%' }}
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
//                         <span>Waste Reduced</span>
//                         <span>{userContent.impact.wasteReduced}kg</span>
//                       </div>
//                       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-green-500"
//                           style={{ width: '60%' }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-white p-4 sm:p-6 rounded-lg border">
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Community Impact</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
//                         <span>Trees Planted</span>
//                         <span>{userContent.impact.treesPlanted}</span>
//                       </div>
//                       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-green-500"
//                           style={{ width: '40%' }}
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
//                         <span>Events Organized</span>
//                         <span>{userContent.impact.communityEvents}</span>
//                       </div>
//                       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-green-500"
//                           style={{ width: '80%' }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import {
  User as UserIcon,
  Mail,
  Users,
  UserPlus,
  Edit,
  Trash2,
  Save,
  X,
  CalendarDays
} from "lucide-react";

interface Post {
  postId: string;
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  userName: string;
  email: string;
  followers: string[]; // changed to array
  following: string[]; // changed to array
}

export function Profile() {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

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

  const formatDate = (isoDate: string) => {
    const parsed = Date.parse(isoDate);
    if (isNaN(parsed)) return "Invalid date";

    const date = new Date(parsed);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };



  if (!isAuthenticated) return <div className="text-center mt-8">Please log in to view your profile.</div>;

  return (
      <div className="max-w-3xl mx-auto mt-10 p-4">
        {/* User Info Card */}
        <div className="bg-white border shadow-lg rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <UserIcon className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-semibold">Your Profile</h1>
          </div>
          <div className="space-y-2 ml-2 text-gray-700">
            <p className="flex items-center gap-2">
              <UserIcon size={18} /> <strong>Name:</strong> {userData?.userName}
            </p>
            <p className="flex items-center gap-2">
              <Mail size={18} /> <strong>Email:</strong> {userData?.email}
            </p>
            <p className="flex items-center gap-2">
              <Users size={18} /> <strong>Followers:</strong> {userData?.followers?.length ?? 0}
            </p>
            <p className="flex items-center gap-2">
              <UserPlus size={18} /> <strong>Following:</strong> {userData?.following?.length ?? 0}
            </p>
          </div>
        </div>

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
                        <p className="text-gray-800">{post.content}</p>
                        <small className="block text-gray-500 mt-1 flex items-center gap-1">
                          <CalendarDays size={14} /> {formatDate(post.createdAt)}
                        </small>
                        <div className="mt-3 flex gap-3">
                          <button
                              onClick={() => handleEdit(post)}
                              className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded"
                          >
                            <Edit size={16} /> Edit
                          </button>
                          <button
                              onClick={() => handleDelete(post.postId)}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
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
