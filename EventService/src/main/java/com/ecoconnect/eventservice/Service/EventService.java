package com.ecoconnect.eventservice.Service;

import com.ecoconnect.eventservice.Model.Event;
import com.ecoconnect.eventservice.Repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service

public class EventService {
    private final EventRepository eventRepository;
    private final EventPublisher eventPublisher;

    @Autowired
    public EventService(EventRepository eventRepository, EventPublisher eventPublisher)
    {
        this.eventRepository = eventRepository;
        this.eventPublisher = eventPublisher;
    }

    public Event createEvent(Event event)
    {
        if(eventRepository.findEventById(event.getId()).isPresent()){
            throw  new RuntimeException("Event with the given ID already exists");
        }
        Event savedEvent = eventRepository.save(event);

        eventPublisher.publishEventCreated(savedEvent.getId(), savedEvent.getCreatorId(), savedEvent.getName());

        return savedEvent;
    }

    public List<Event> getAllEvents()
    {
        return eventRepository.findAll();
    }

    public Event rsvpToEvent(String eventId, String userId)
    {
        Event event = eventRepository.findEventById(eventId)
                        .orElseThrow(() -> new RuntimeException("No event found with given id "+ eventId));

        List<String> userIds = event.getRsvpUsers();
        if(userIds == null)
            userIds = new ArrayList<>();
        if(userIds.contains(userId))
            throw new RuntimeException("User already registered");
        userIds.add(userId);
        event.setRsvpUsers(userIds);
        return eventRepository.save(event);
    }
}
