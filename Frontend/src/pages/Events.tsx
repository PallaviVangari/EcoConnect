import React from 'react';
import { Calendar, MapPin, Clock, Users, Filter, Search, Plus, X } from 'lucide-react';
import type { Event } from '../types';

export function Events() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'workshop' | 'seminar' | 'cleanup'>('all');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [events, setEvents] = React.useState<Event[]>([
    {
      id: '1',
      title: 'Urban Gardening Workshop',
      description: 'Learn sustainable urban gardening techniques and start your own garden.',
      date: '2025-04-15',
      time: '14:00',
      location: 'Community Center, 123 Green Street',
      agenda: [
        'Introduction to urban gardening',
        'Soil preparation techniques',
        'Plant selection for urban environments',
        'Maintenance tips'
      ],
      organizer: {
        id: '1',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        avatar: 'https://i.pravatar.cc/150?u=emma',
        followers: 1542,
        following: 891
      },
      attendees: [],
      maxAttendees: 30,
      isRegistered: false,
      category: 'workshop'
    },
    {
      id: '2',
      title: 'Beach Cleanup Drive',
      description: 'Join us for a community beach cleanup to protect marine life.',
      date: '2025-04-20',
      time: '09:00',
      location: 'Sunset Beach',
      agenda: [
        'Safety briefing',
        'Equipment distribution',
        'Cleanup activity',
        'Waste sorting demonstration'
      ],
      organizer: {
        id: '2',
        name: 'David Chen',
        email: 'david@example.com',
        avatar: 'https://i.pravatar.cc/150?u=david',
        followers: 2103,
        following: 764
      },
      attendees: [],
      maxAttendees: 50,
      isRegistered: false,
      category: 'cleanup'
    }
  ]);

  // New event form state
  const [newEvent, setNewEvent] = React.useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'workshop' as 'workshop' | 'seminar' | 'cleanup' | 'other',
    maxAttendees: 30
  });

  const handleRegister = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, isRegistered: true, attendees: [...event.attendees, {} as any] }
        : event
    ));
  };

  const handleCreateEvent = () => {
    // Validate form
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time || !newEvent.location) {
      return;
    }

    const createdEvent: Event = {
      id: Date.now().toString(),
      ...newEvent,
      agenda: [
        'Introduction',
        'Main activity',
        'Networking',
        'Conclusion'
      ],
      organizer: {
        id: 'current-user',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?u=john',
        followers: 245,
        following: 189
      },
      attendees: [],
      isRegistered: true
    };

    setEvents([createdEvent, ...events]);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'workshop',
      maxAttendees: 30
    });
  };

  const filteredEvents = events.filter(event =>
    (activeCategory === 'all' || event.category === activeCategory) &&
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600">Discover and join eco-friendly events in your community</p>
        </div>
        <button 
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors active:scale-95"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-5 w-5" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-transform">
            <Filter className="h-5 w-5 text-gray-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {(['all', 'workshop', 'seminar', 'cleanup'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeCategory === category
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    event.category === 'workshop' ? 'bg-blue-100 text-blue-800' :
                    event.category === 'seminar' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-5 w-5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="h-5 w-5" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <MapPin className="h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Users className="h-5 w-5" />
                    <span>{event.attendees.length} / {event.maxAttendees} attendees</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={event.organizer.avatar}
                        alt={`${event.organizer.name}'s avatar`}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.organizer.name}</p>
                        <p className="text-sm text-gray-500">Organizer</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRegister(event.id)}
                      disabled={event.isRegistered}
                      className={`px-4 py-2 rounded-lg active:scale-95 transition-transform ${
                        event.isRegistered
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {event.isRegistered ? 'Registered' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-2">No events found matching your criteria.</p>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 active:scale-95 transition-transform"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your event"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter event location"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({...newEvent, category: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="cleanup">Cleanup</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-1">
                      Max Attendees
                    </label>
                    <input
                      type="number"
                      id="maxAttendees"
                      value={newEvent.maxAttendees}
                      onChange={(e) => setNewEvent({...newEvent, maxAttendees: parseInt(e.target.value)})}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-transform"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}