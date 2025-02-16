package com.ecoconnect.userservice.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public UserPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    // Publish "USER_FOLLOWED" event
    public void publishUserFollowed(String followerId, String followeeId, String followerEmail, String followeeEmail) {
        Map<String, Object> message = new HashMap<>();
        message.put("messageType", "USER_FOLLOWED");
        message.put("followerId", followerId);
        message.put("followeeId", followeeId);
        message.put("followerEmail", followerEmail);
        message.put("followeeEmail", followeeEmail);

        sendMessage("user-notifications", message);
    }

    // Publish "USER_UNFOLLOWED" event
    public void publishUserUnfollowed(String followerId, String followeeId) {
        Map<String, Object> message = new HashMap<>();
        message.put("messageType", "USER_UNFOLLOWED");
        message.put("followerId", followerId);
        message.put("followeeId", followeeId);

        sendMessage("user-notifications", message);
    }

    // Generic method to send JSON messages
    private void sendMessage(String topic, Map<String, Object> message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(topic, jsonMessage);
        } catch (Exception e) {
            throw new RuntimeException("Error serializing Kafka message", e);
        }
    }
}
