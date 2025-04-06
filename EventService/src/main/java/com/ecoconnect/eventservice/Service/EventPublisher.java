package com.ecoconnect.eventservice.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class EventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public EventPublisher(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishEventCreated(String eventId, String creatorId, String eventName) {
        publishEvent("EVENT_CREATED", eventId, creatorId, null, eventName, null);
    }

    public void publishEventRSVP(String eventId, String participantId, String eventName, String participantEmail) {
        publishEvent("EVENT_RSVP", eventId, null, participantId, eventName, participantEmail);
    }

    private void publishEvent(String messageType, String eventId, String creatorId, String participantId, String eventName, String participantEmail) {
        try {
            Map<String, String> message = Map.of(
                    "messageType", messageType,
                    "eventId", eventId,
                    "creatorId", creatorId != null ? creatorId : "",
                    "participantId", participantId != null ? participantId : "",
                    "eventName", eventName,
                    "participantEmail", participantEmail != null ? participantEmail : ""
            );

            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send("event-notifications", jsonMessage);
            System.out.println(messageType + "message has been sent");

        } catch (Exception e) {
            throw new RuntimeException("Error serializing Kafka message", e);
        }
    }
}
