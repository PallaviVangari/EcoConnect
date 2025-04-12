import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  ShoppingBag,
  MessageSquare,
  Bot,
  Search,
  User,
  X
} from 'lucide-react';
// import type { Notification } from '../types';

export function Layout() {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
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
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Network', href: '/network', icon: Users },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'EcoBot', href: '/chatbot', icon: Bot },
  ];


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

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
              <Link to="/profile" className="text-gray-600 hover:text-green-600 active:scale-95 transition-transform">
                <User className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <Outlet />
      </main>
    </div>
  );
}