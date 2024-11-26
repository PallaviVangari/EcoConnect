package com.ecoconnect.eventservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;


@Service
public class EventPublisher {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void publishEventCreated(String eventId, String creatorId, String eventName) {
        String message = String.format(
                "{\"messageType\":\"EVENT_CREATED\",\"eventId\":\"%s\",\"creatorId\":\"%s\",\"eventName\":\"%s\"}",
                eventId, creatorId, eventName
        );
        kafkaTemplate.send("event-notifications", message);
    }
}
