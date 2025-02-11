package com.ecoconnect.postservice.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class PostPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public PostPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    // Publish POST_CREATED message
    public void publishPostCreated(String postId, String authorId, String content, String createdDate) {
        publishEvent("POST_CREATED", postId, authorId, content, createdDate);
    }

    // Publish POST_UPDATED message
    public void publishPostUpdated(String postId, String authorId, String content, String lastModifiedDate) {
        publishEvent("POST_UPDATED", postId, authorId, content, lastModifiedDate);
    }

    // Publish POST_DELETED message
    public void publishPostDeleted(String postId, String authorId) {
        publishEvent("POST_DELETED", postId, authorId, null, null);
    }

    private void publishEvent(String messageType, String postId, String authorId, String content, String timestamp) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("messageType", messageType);
            message.put("postId", postId);
            message.put("authorId", authorId);
            if (content != null) message.put("content", content);
            if (timestamp != null) message.put("timestamp", timestamp);

            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send("post-notifications", jsonMessage);

        } catch (Exception e) {
            throw new RuntimeException("Error serializing Kafka message", e);
        }
    }
}
