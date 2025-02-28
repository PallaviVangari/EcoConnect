import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  
  const settingsSections = [
    {
      id: 'account',
      title: 'Account',
      icon: User,
      items: [
        { name: 'Profile Information', description: 'Update your personal details' },
        { name: 'Email & Password', description: 'Manage your login credentials' },
        { name: 'Privacy', description: 'Control who can see your profile' }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { name: 'Email Notifications', description: 'Manage email alerts' },
        { name: 'Push Notifications', description: 'Control app notifications' },
        { name: 'Event Reminders', description: 'Set preferences for event alerts' }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Lock,
      items: [
        { name: 'Account Privacy', description: 'Manage who can see your content' },
        { name: 'Security Settings', description: 'Two-factor authentication and security alerts' },
        { name: 'Data & Permissions', description: 'Control your data and app permissions' }
      ]
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: Globe,
      items: [
        { name: 'Language', description: 'Change your language settings' },
        { name: 'Theme', description: 'Choose between light and dark mode' },
        { name: 'Accessibility', description: 'Adjust for better accessibility' }
      ]
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        { name: 'Help Center', description: 'Find answers to common questions' },
        { name: 'Contact Support', description: 'Get help from our team' },
        { name: 'Report a Problem', description: 'Let us know about issues' }
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <section.icon className="h-5 w-5 text-green-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, index) => (
                <button
                  key={index}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 active:scale-99 transition-transform"
                >
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full mt-6 px-6 py-4 bg-white rounded-lg shadow flex items-center text-red-600 hover:bg-red-50 active:scale-99 transition-transform">
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
}