import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  ShoppingBag, 
  MessageSquare, 
  Bell, 
  Menu, 
  Bot,
  Search,
  User,
  X
} from 'lucide-react';
import type { Notification } from '../types';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<{
    posts: any[];
    events: any[];
    marketplace: any[];
    users: any[];
  }>({
    posts: [],
    events: [],
    marketplace: [],
    users: []
  });
  const searchRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      userId: 'current-user',
      type: 'event',
      content: 'New eco-friendly event in your area!',
      timestamp: new Date().toISOString(),
      read: false,
      referenceId: '1'
    },
    {
      id: '2',
      userId: 'current-user',
      type: 'marketplace',
      content: 'Someone is interested in your recycled items',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      referenceId: '2'
    },
    {
      id: '3',
      userId: 'current-user',
      type: 'follow',
      content: 'Emma Wilson started following you',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      referenceId: '1'
    }
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Network', href: '/network', icon: Users },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'EcoBot', href: '/chatbot', icon: Bot },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Improved search function with better matching for terms like "eco"
  const handleSearch = (query: string) => {
    if (query.length < 1) {
      setSearchResults({
        posts: [],
        events: [],
        marketplace: [],
        users: []
      });
      return;
    }

    // Mock data with more comprehensive content
    const mockData = {
      posts: [
        {
          id: '1',
          content: 'Sustainable living tips and tricks for eco-conscious individuals',
          author: 'Emma Wilson',
          type: 'post'
        },
        {
          id: '2',
          content: 'My journey towards an eco-friendly lifestyle',
          author: 'David Chen',
          type: 'post'
        },
        {
          id: '3',
          content: 'How to reduce your ecological footprint',
          author: 'Sofia Rodriguez',
          type: 'post'
        }
      ],
      events: [
        {
          id: '1',
          title: 'Urban Gardening Workshop',
          date: '2025-04-15',
          type: 'event'
        },
        {
          id: '2',
          title: 'Eco-Festival 2025',
          date: '2025-05-22',
          type: 'event'
        },
        {
          id: '3',
          title: 'Beach Cleanup Drive',
          date: '2025-04-20',
          type: 'event'
        }
      ],
      marketplace: [
        {
          id: '1',
          title: 'Recycled Paper Notebook',
          price: 15.99,
          type: 'marketplace'
        },
        {
          id: '2',
          title: 'Eco-friendly Bamboo Cutlery Set',
          price: 24.99,
          type: 'marketplace'
        },
        {
          id: '3',
          title: 'Organic Cotton Tote Bag',
          price: 18.50,
          type: 'marketplace'
        }
      ],
      users: [
        {
          id: '1',
          name: 'Emma Wilson',
          bio: 'Environmental Engineer',
          type: 'user'
        },
        {
          id: '2',
          name: 'David Chen',
          bio: 'Eco Activist and Researcher',
          type: 'user'
        },
        {
          id: '3',
          name: 'Sofia Rodriguez',
          bio: 'Zero Waste Advocate',
          type: 'user'
        }
      ]
    };

    const lowercaseQuery = query.toLowerCase();

    // Filter results based on query with improved matching
    const filtered = {
      posts: mockData.posts.filter(post => 
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.author.toLowerCase().includes(lowercaseQuery)
      ),
      events: mockData.events.filter(event =>
        event.title.toLowerCase().includes(lowercaseQuery) ||
        event.date.toLowerCase().includes(lowercaseQuery)
      ),
      marketplace: mockData.marketplace.filter(item =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.price.toString().includes(lowercaseQuery)
      ),
      users: mockData.users.filter(user =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.bio.toLowerCase().includes(lowercaseQuery)
      )
    };

    setSearchResults(filtered);
  };

  const handleSearchItemClick = (item: any) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    
    switch (item.type) {
      case 'post':
        navigate(`/?post=${item.id}`);
        break;
      case 'event':
        navigate(`/events#${item.id}`);
        break;
      case 'marketplace':
        navigate(`/marketplace#${item.id}`);
        break;
      case 'user':
        navigate(`/network?user=${item.id}`);
        break;
      default:
        break;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    switch (notification.type) {
      case 'event':
        navigate(`/events#${notification.referenceId}`);
        break;
      case 'marketplace':
        navigate(`/marketplace#${notification.referenceId}`);
        break;
      case 'follow':
        navigate(`/network#${notification.referenceId}`);
        break;
      default:
        break;
    }

    setIsNotificationsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== id)
    );
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input changes
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const isActive = (path: string) => location.pathname === path;

  const hasSearchResults = Object.values(searchResults).some(category => category.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-green-600">EcoConnect</span>
              </Link>
              
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="relative w-64 mx-4" ref={searchRef}>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />

                  {/* Search Results Dropdown */}
                  {isSearchOpen && searchQuery.length >= 1 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg py-2 z-50">
                      {!hasSearchResults ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No results found
                        </div>
                      ) : (
                        <>
                          {searchResults.posts.length > 0 && (
                            <div className="px-4 py-2">
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Posts
                              </h3>
                              {searchResults.posts.map(post => (
                                <div
                                  key={post.id}
                                  onClick={() => handleSearchItemClick(post)}
                                  className="py-2 px-3 hover:bg-gray-50 cursor-pointer rounded-md"
                                >
                                  <p className="text-sm text-gray-900">{post.content}</p>
                                  <p className="text-xs text-gray-500">By {post.author}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {searchResults.events.length > 0 && (
                            <div className="px-4 py-2 border-t">
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Events
                              </h3>
                              {searchResults.events.map(event => (
                                <div
                                  key={event.id}
                                  onClick={() => handleSearchItemClick(event)}
                                  className="py-2 px-3 hover:bg-gray-50 cursor-pointer rounded-md"
                                >
                                  <p className="text-sm text-gray-900">{event.title}</p>
                                  <p className="text-xs text-gray-500">{event.date}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {searchResults.marketplace.length > 0 && (
                            <div className="px-4 py-2 border-t">
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Marketplace
                              </h3>
                              {searchResults.marketplace.map(item => (
                                <div
                                  key={item.id}
                                  onClick={() => handleSearchItemClick(item)}
                                  className="py-2 px-3 hover:bg-gray-50 cursor-pointer rounded-md"
                                >
                                  <p className="text-sm text-gray-900">{item.title}</p>
                                  <p className="text-xs text-gray-500">${item.price}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {searchResults.users.length > 0 && (
                            <div className="px-4 py-2 border-t">
                              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Users
                              </h3>
                              {searchResults.users.map(user => (
                                <div
                                  key={user.id}
                                  onClick={() => handleSearchItemClick(user)}
                                  className="py-2 px-3 hover:bg-gray-50 cursor-pointer rounded-md"
                                >
                                  <p className="text-sm text-gray-900">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.bio}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                    isActive(item.href) ? 'text-green-600' : ''
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative" ref={notificationsRef}>
                <button 
                  className="text-gray-600 hover:text-green-600 relative active:scale-95 transition-transform"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-green-600 hover:text-green-700 active:scale-95 transition-transform"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 flex items-start justify-between ${
                              !notification.read ? 'bg-green-50' : ''
                            }`}
                          >
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <p className="text-sm text-gray-900">{notification.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="ml-2 text-gray-400 hover:text-gray-600 active:scale-95 transition-transform"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/profile" className="text-gray-600 hover:text-green-600 active:scale-95 transition-transform">
                <User className="h-6 w-6" />
              </Link>
              <button 
                className="sm:hidden text-gray-600 hover:text-green-600 active:scale-95 transition-transform"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="sm:hidden border-t">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-600 hover:text-green-600 block px-3 py-2 text-base font-medium flex items-center space-x-2 ${
                    isActive(item.href) ? 'text-green-600 bg-green-50' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            <div className="px-3 py-3 border-t">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <Outlet />
      </main>
    </div>
  );
}