export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  interests?: string[];
  location?: string;
  website?: string;
  joinDate?: string;
  isFollowing?: boolean;
  achievements?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface Post {
  id: string;
  userId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
  media?: string[];
  tags?: string[];
  image?: string;
}

export interface Comment {
  id: string;
  userId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  agenda: string[];
  organizer: User;
  attendees: User[];
  maxAttendees?: number;
  isRegistered?: boolean;
  category: 'workshop' | 'seminar' | 'cleanup' | 'other';
  image?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  seller: User;
  images: string[];
  category: 'recycled' | 'eco-friendly' | 'sustainable';
  condition: 'new' | 'used' | 'refurbished';
  status: 'available' | 'sold';
  createdAt: string;
  tags: string[];
  image?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image';
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatbotMessage {
  id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'bot';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'post' | 'event' | 'follow' | 'like' | 'comment' | 'marketplace';
  content: string;
  timestamp: string;
  read: boolean;
  referenceId?: string;
}