package com.ecoconnect.eventservice.Controller;

import com.ecoconnect.eventservice.Model.Event;
import com.ecoconnect.eventservice.Service.EventService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService){
        this.eventService = eventService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@RequestBody Event event)
    {
        try {
            log.info("Request received for creating an event with id {}", event.getId());
            Event createdEvent = eventService.createEvent(event);
            log.info("Created event:"+event);
            return ResponseEntity.ok(createdEvent);
        }
        catch (Exception e) {
            log.info("Encountered exception while creating the event."+ e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Encountered exception while creating the event");
        }
    }

    @GetMapping("/getAllEvents")
    public ResponseEntity<?> getAllEvents()
    {
        log.info("Request received for retrieving all events");
        List<Event> events = eventService.getAllEvents();
        if(events.isEmpty())
        {
            log.info("No events found. Thus returning an empty response");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{eventId}/rsvpEvent/{userId}/{userEmail}")
    public ResponseEntity<?> rsvpEvent(@PathVariable String eventId, @PathVariable String userId, @PathVariable String userEmail)
    {
        try{
            log.info("Received request to rsvp for event : {} by userId:{}", eventId,userId );
            eventService.rsvpToEvent(eventId,userId, userEmail);
            return ResponseEntity.ok().build();
        }
        catch (Exception e){
            log.debug("Encountered an error while rsvp for an event."+e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<?> updateEvent(@PathVariable String eventId, @RequestBody Event updatedEvent) {
        try {
            log.info("Request received for updating event : {}", eventId);
            Event newEvent = eventService.updateEvent(eventId, updatedEvent);
            return ResponseEntity.ok(newEvent);
        } catch (Exception e) {
            log.debug("Encountered an error while updating an event" + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable String eventId)
    {
        try
        {
            log.info("Request received for deleting an event : {}", eventId);
            eventService.deleteEvent(eventId);
            return ResponseEntity.ok().build();
        }
        catch(Exception e)
        {
            log.debug("Encountered an error while deleting event." + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

}
