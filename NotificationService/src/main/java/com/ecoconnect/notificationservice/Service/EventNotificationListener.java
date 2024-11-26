package com.ecoconnect.notificationservice.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EventNotificationListener {

    private final RedisTemplate<String, Object> redisTemplate;

    private final EmailService emailService; // Email sending service

    @Autowired
    public EventNotificationListener(RedisTemplate<String, Object> redisTemplate, EmailService emailService) {
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
    }

    @KafkaListener(topics = "event-notifications", groupId = "notification-group")
    public void handleEventNotifications(String message) {
        JsonNode json = parseMessage(message);

        if ("EVENT_CREATED".equals(json.get("messageType").asText())) {
            String creatorId = json.get("creatorId").asText();
            String eventName = json.get("eventName").asText();

            // Get the followers of the creator from Redis
            Set<Object> followers = redisTemplate.opsForSet().members("followers:" + creatorId);

            // Convert Set<Object> to Set<String> for type safety
            Set<String> followerIds = followers.stream()
                    .map(Object::toString)
                    .collect(Collectors.toSet());

            // Send emails to all followers
            for (String followerId : followerIds) {
                String email = (String) redisTemplate.opsForHash().get("user-emails", followerId);
                if (!email.isEmpty()) {
                    emailService.sendEmail(
                            email,
                            "New Event Created",
                            "Check out the new event: " + eventName + " created by " + creatorId
                    );
                }
            }
            System.out.println("Received message: " + message);
        }
        System.out.println("Received message: " + json);
    }

    private JsonNode parseMessage(String message) {
        // Use Jackson to parse the message (JSON)
        try {
            return new ObjectMapper().readTree(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
