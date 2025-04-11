import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  X,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react"; // Import useAuth0
import type { Notification } from "../types";

export function Layout() {
  const { logout } = useAuth0(); // Destructure logout from useAuth0
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
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
    users: [],
  });
  const searchRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      userId: "current-user",
      type: "event",
      content: "New eco-friendly event in your area!",
      timestamp: new Date().toISOString(),
      read: false,
      referenceId: "1",
    },
    {
      id: "2",
      userId: "current-user",
      type: "marketplace",
      content: "Someone is interested in your recycled items",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      referenceId: "2",
    },
    {
      id: "3",
      userId: "current-user",
      type: "follow",
      content: "Emma Wilson started following you",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      referenceId: "1",
    },
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Network", href: "/network", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "EcoBot", href: "/chatbot", icon: Bot },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-green-600">
                  EcoConnect
                </span>
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
                </div>
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                    isActive(item.href) ? "text-green-600" : ""
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
              </div>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-green-600 active:scale-95 transition-transform"
              >
                <User className="h-6 w-6" />
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Logout</span>
              </button>
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
