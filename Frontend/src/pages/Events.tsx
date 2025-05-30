import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../components/Button";
import { Text } from "../components/Text";
import { Img } from "../components/Img";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Config from "../config/config.ts";

interface Event {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
}

export const Events: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
  });
  const [activeTab, setActiveTab] = useState("explore");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${Config.EVENT_SERVICE_URL}/getAllEvents`
        );
        if (!response.ok)
          throw new Error(`Failed to fetch events: ${response.statusText}`);

        const data = await response.json();
        if (isMounted) {
          const now = new Date(); // Current date and time

          const formattedEvents = data
            .map((event: any) => ({
              id: event.id,
              creatorId: event.creatorId,
              title: event.name,
              description: event.description,
              location: event.location,
              date: event.dateTime.split("T")[0],
              time: event.dateTime.split("T")[1].substring(0, 5),
              dateTime: new Date(event.dateTime), // Convert to Date object for comparison
              participants: event.rsvpUsers ? event.rsvpUsers.length : 0, // Calculate number of participants
            }))
            .filter((event) => event.dateTime > now) // Exclude past events
            .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()); // Sort by ascending timestamp

          setEvents(formattedEvents);

          if (user) {
            const userEvents = formattedEvents.filter(
              (event) => event.creatorId === user.sub
            );
            setUserEvents(userEvents);

            // Fetch registered events
            const registeredResponse = await fetch(
              `${Config.EVENT_SERVICE_URL}/eventsByUser/${user.sub}`
            );
            if (!registeredResponse.ok)
              throw new Error("Failed to fetch registered events");

            const registeredData = await registeredResponse.json();
            const formattedRegisteredEvents = registeredData
              .map((event: any) => ({
                id: event.id,
                creatorId: event.creatorId,
                title: event.name,
                description: event.description,
                location: event.location,
                date: event.dateTime.split("T")[0],
                time: event.dateTime.split("T")[1].substring(0, 5),
                dateTime: new Date(event.dateTime), // Convert to Date object for comparison
                participants: event.rsvpUsers ? event.rsvpUsers.length : 0, // Calculate number of participants
              }))
              .filter((event) => event.dateTime > now) // Exclude past events
              .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()); // Sort by ascending timestamp

            setRegisteredEvents(formattedRegisteredEvents);
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleCreateEvent = async () => {
    if (!isAuthenticated || !user?.email) {
      toast.error("You must be logged in to create an event.");
      return;
    }

    // Close the modal immediately
    setShowCreateEventModal(false);

    const eventToCreate = {
      id: uuidv4(),
      creatorId: user.sub,
      name: newEvent.title,
      description: newEvent.description,
      location: newEvent.location,
      dateTime: `${newEvent.date}T${newEvent.time}`,
    };

    try {
      const response = await fetch(`${Config.EVENT_SERVICE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventToCreate),
      });

      if (!response.ok) throw new Error("Failed to create event");

      const createdEvent = await response.json();

      // Add the new event to the state immediately
      const formattedEvent = {
        id: createdEvent.id,
        creatorId: createdEvent.creatorId,
        title: createdEvent.name,
        description: createdEvent.description,
        location: createdEvent.location,
        date: createdEvent.dateTime.split("T")[0],
        time: createdEvent.dateTime.split("T")[1].substring(0, 5),
        dateTime: new Date(createdEvent.dateTime),
        participants: 0, // New event starts with 0 participants
      };

      setEvents((prevEvents) => [...prevEvents, formattedEvent]);
      setUserEvents((prevUserEvents) => [...prevUserEvents, formattedEvent]);

      // Reset the new event form
      setNewEvent({
        title: "",
        description: "",
        location: "",
        date: "",
        time: "",
      });

      toast.success("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event.");
    }
  };

  const handleRSVP = async (eventId: string) => {
    if (!isAuthenticated || !user?.email) {
      toast.error("You must be logged in to RSVP for an event.");
      return;
    }

    try {
      const response = await fetch(
        `${Config.EVENT_SERVICE_URL}/${eventId}/rsvpEvent/${user.sub}/${user.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to RSVP");

      const eventToRegister = events.find((event) => event.id === eventId);
      if (eventToRegister) {
        setRegisteredEvents((prev) => [...prev, eventToRegister]);
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
      }

      toast.success("You have successfully registered for the event!");
    } catch (error) {
      console.error("Error RSVPing to event:", error);
      toast.error("Failed to register for the event.");
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(
        `${Config.EVENT_SERVICE_URL}/${eventId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete event");

      // Update the state to remove the deleted event
      setUserEvents(userEvents.filter((event) => event.id !== eventId));
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event.");
    }
  };

  const handleEditEvent = (eventId: string) => {
    const eventToEdit = userEvents.find((event) => event.id === eventId);
    if (!eventToEdit) return;

    setNewEvent({
      title: eventToEdit.title,
      description: eventToEdit.description,
      location: eventToEdit.location,
      date: eventToEdit.date,
      time: eventToEdit.time,
    });

    setEditingEventId(eventId);
    setShowCreateEventModal(true);
  };

  const handleUpdateEvent = async () => {
    if (!editingEventId) return;

    const updatedEvent = {
      id: editingEventId,
      creatorId: user?.sub,
      name: newEvent.title,
      description: newEvent.description,
      location: newEvent.location,
      dateTime: `${newEvent.date}T${newEvent.time}`,
    };

    try {
      const response = await fetch(
        `${Config.EVENT_SERVICE_URL}/${editingEventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (!response.ok) throw new Error("Failed to update event");

      const updatedEventResponse = await response.json();

      // Update the state immediately
      const formattedEvent = {
        id: updatedEventResponse.id,
        creatorId: updatedEventResponse.creatorId,
        title: updatedEventResponse.name,
        description: updatedEventResponse.description,
        location: updatedEventResponse.location,
        date: updatedEventResponse.dateTime.split("T")[0],
        time: updatedEventResponse.dateTime.split("T")[1].substring(0, 5),
        dateTime: new Date(updatedEventResponse.dateTime),
        participants: updatedEventResponse.rsvpUsers
          ? updatedEventResponse.rsvpUsers.length
          : 0,
      };

      setUserEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingEventId ? formattedEvent : event
        )
      );
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingEventId ? formattedEvent : event
        )
      );

      toast.success("Event updated successfully!");
      setShowCreateEventModal(false);
      setEditingEventId(null);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex flex-grow">
          <div className="w-full py-10 md:py-12 flex-grow">
            <div className="container mx-auto px-6 md:px-8">
              {/* Tabs */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-10">
                  <Button
                    onClick={() => setActiveTab("explore")}
                    className={`${
                      activeTab === "explore"
                        ? "text-[#1d3016] border-b-4 border-[#1d3016] px-6 py-3 text-xl font-bold transition-all duration-300"
                        : "text-[#1d3016] hover:bg-[#f0f0f0] border-b-4 border-transparent px-6 py-3 text-xl font-bold transition-all duration-300"
                    } rounded-md`}
                  >
                    Explore Events
                  </Button>
                  <Button
                    onClick={() => setActiveTab("yourEvents")}
                    className={`${
                      activeTab === "yourEvents"
                        ? "text-[#1d3016] border-b-4 border-[#1d3016] px-6 py-3 text-xl font-bold transition-all duration-300"
                        : "text-[#1d3016] hover:bg-[#f0f0f0] border-b-4 border-transparent px-6 py-3 text-xl font-bold transition-all duration-300"
                    } rounded-md`}
                  >
                    My Events
                  </Button>
                  <Button
                    onClick={() => setActiveTab("registeredEvents")}
                    className={`${
                      activeTab === "registeredEvents"
                        ? "text-[#1d3016] border-b-4 border-[#1d3016] px-6 py-3 text-xl font-bold transition-all duration-300"
                        : "text-[#1d3016] hover:bg-[#f0f0f0] border-b-4 border-transparent px-6 py-3 text-xl font-bold transition-all duration-300"
                    } rounded-md`}
                  >
                    Registered Events
                  </Button>
                </div>
                {activeTab === "yourEvents" && (
                  <Button
                    onClick={() => setShowCreateEventModal(true)}
                    style={{
                      backgroundColor: "#1d3016",
                      color: "white",
                    }}
                    className="px-6 py-3 text-xl rounded-md hover:bg-[#162c10] transition-all"
                  >
                    Create Event
                  </Button>
                )}
              </div>

              {/* Content Based on Active Tab */}
              <div className="mt-6">
                {activeTab === "explore" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                      <Text className="text-xl">Loading events...</Text>
                    ) : events.length === 0 ? (
                      <Text className="text-xl">No events available.</Text>
                    ) : (
                      events
                        .filter((event) => event.creatorId !== user?.sub) // Exclude user's events
                        .map((event) => (
                          <div
                            key={event.id}
                            className="bg-white shadow-lg rounded-xl border-2 border-[#1d3016] p-6 hover:shadow-xl transition-all duration-300 w-96 h-80 flex flex-col justify-between"
                          >
                            <Text
                              className="text-4xl font-bold text-[#1d3016] mb-3"
                              style={{ fontSize: "1.5rem" }} // Explicitly set the font size for 4xl
                            >
                              {event.title}
                            </Text>

                            <div className="flex items-center gap-2 text-gray-600 text-xl mb-3">
                              <Img
                                src="images/calendar.svg"
                                alt="Date"
                                className="w-7 h-7"
                              />
                              <Text className="text-lg">{event.date}</Text>
                              <Text className="text-lg">{event.time}</Text>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600 text-xl mb-3">
                              <Img
                                src="images/location.svg"
                                alt="Location"
                                className="w-7 h-7"
                              />
                              <Text className="text-lg">{event.location}</Text>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600 text-xl mb-3">
                              <Img
                                src="images/participants.svg"
                                alt="Participants"
                                className="w-7 h-7"
                              />
                              <Text className="text-lg">
                                {event.participants} participant
                                {event.participants !== 1 ? "s" : ""}
                              </Text>
                            </div>

                            <Text className="text-gray-700 text-lg mb-5 flex-grow">
                              {event.description}
                            </Text>

                            <Button
                              onClick={() => handleRSVP(event.id)}
                              style={{
                                backgroundColor: "#1d3016",
                                color: "white",
                              }}
                              className="w-full rounded-md px-4 py-3 hover:bg-[#162c10] transition-all"
                            >
                              Register
                            </Button>
                          </div>
                        ))
                    )}
                  </div>
                )}

                {activeTab === "yourEvents" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                      <Text className="text-xl">Loading your events...</Text>
                    ) : userEvents.length === 0 ? (
                      <Text className="text-xl">
                        You have not created any events.
                      </Text>
                    ) : (
                      userEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-white shadow-lg rounded-xl border-2 border-[#1d3016] p-6 hover:shadow-xl transition-all duration-300 w-96 h-80 flex flex-col justify-between"
                        >
                          <Text
                            className="text-4xl font-bold text-[#1d3016] mb-3"
                            style={{ fontSize: "1.5rem" }} // Explicitly set the font size for 4xl
                          >
                            {event.title}
                          </Text>

                          <div className="flex items-center gap-2 text-gray-600 text-xl mb-3">
                            <Img
                              src="images/calendar.svg"
                              alt="Date"
                              className="w-7 h-7"
                            />
                            <Text className="text-lg">{event.date}</Text>
                            <Text className="text-lg">{event.time}</Text>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 text-xl mb-3">
                            <Img
                              src="images/location.svg"
                              alt="Location"
                              className="w-7 h-7"
                            />
                            <Text className="text-lg">{event.location}</Text>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 text-xl mb-3">
                            <Img
                              src="images/participants.svg"
                              alt="Participants"
                              className="w-7 h-7"
                            />
                            <Text className="text-lg">
                              {event.participants} participant
                              {event.participants !== 1 ? "s" : ""}
                            </Text>
                          </div>

                          <Text
                            as="p"
                            className="text-gray-700 text-lg mb-5 flex-grow"
                          >
                            {event.description}
                          </Text>
                          <div className="flex justify-between">
                            <Button
                              onClick={() => handleEditEvent(event.id)}
                              style={{
                                backgroundColor: "#1d3016",
                                color: "white",
                              }}
                              className="rounded-md px-6 py-3 rounded-md hover:bg-[#162c10] transition-all"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteEvent(event.id)}
                              style={{
                                backgroundColor: "#1d3016",
                                color: "white",
                              }}
                              className="rounded-md px-6 py-3 rounded-md hover:bg-[#162c10] transition-all"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "registeredEvents" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {registeredEvents.length === 0 ? (
                      <Text className="text-xl">
                        You have not registered for any events.
                      </Text>
                    ) : (
                      registeredEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-white shadow-lg rounded-xl border-2 border-[#1d3016] p-6 hover:shadow-xl transition-all duration-300 w-96 h-80 flex flex-col justify-between"
                        >
                          <Text
                            className="text-4xl font-bold text-[#1d3016] mb-3"
                            style={{ fontSize: "1.5rem" }}
                          >
                            {event.title}
                          </Text>

                          <div className="flex items-center gap-2 text-gray-600 text-xl mb-3">
                            <Img
                              src="images/calendar.svg"
                              alt="Date"
                              className="w-7 h-7"
                            />
                            <Text className="text-lg">{event.date}</Text>
                            <Text className="text-lg">{event.time}</Text>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 text-xl mb-3">
                            <Img
                              src="images/location.svg"
                              alt="Location"
                              className="w-7 h-7"
                            />
                            <Text className="text-lg">{event.location}</Text>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 text-xl mb-3">
                            <Img
                              src="images/participants.svg"
                              alt="Participants"
                              className="w-7 h-7"
                            />
                            <Text className="text-lg">
                              {event.participants} participant
                              {event.participants !== 1 ? "s" : ""}
                            </Text>
                          </div>

                          <Text className="text-gray-700 text-lg mb-5 flex-grow">
                            {event.description}
                          </Text>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Event Modal */}
        {showCreateEventModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 ease-in-out">
              <h3 className="text-3xl font-semibold text-[#1d3016] mb-6 text-center">
                Create Event
              </h3>

              {/* Event Title */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-[#333] mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="border-2 border-[#ccc] p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3016] transition-all duration-200"
                />
              </div>

              {/* Event Description */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-[#333] mb-2">
                  Event Description
                </label>
                <textarea
                  placeholder="Enter event description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="border-2 border-[#ccc] p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3016] transition-all duration-200"
                />
              </div>

              {/* Event Location */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-[#333] mb-2">
                  Event Location
                </label>
                <input
                  type="text"
                  placeholder="Enter event location"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  className="border-2 border-[#ccc] p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3016] transition-all duration-200"
                />
              </div>

              {/* Event Date */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-[#333] mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  className="border-2 border-[#ccc] p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3016] transition-all duration-200"
                />
              </div>

              {/* Event Time */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-[#333] mb-2">
                  Event Time
                </label>
                <select
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                  className="border-2 border-[#ccc] p-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d3016] transition-all duration-200"
                >
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-6 mt-6">
                <Button
                  onClick={() => setShowCreateEventModal(false)}
                  className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={
                    editingEventId ? handleUpdateEvent : handleCreateEvent
                  }
                  style={
                    editingEventId
                      ? { backgroundColor: "#1d3016", color: "white" }
                      : { backgroundColor: "#1d3016", color: "white" }
                  }
                  className="rounded-md px-6 py-3 rounded-md hover:bg-[#162c10] transition-all"
                >
                  {editingEventId ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
