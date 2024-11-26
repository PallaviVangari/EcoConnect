package com.ecoconnect.notificationservice.Service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UserListener {

    private final RedisTemplate<String, Object> redisTemplate;

    private final EmailService emailService;

    @Autowired
    public UserListener(RedisTemplate<String, Object> redisTemplate, EmailService emailService) {
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
    }

    @KafkaListener(topics = "user-notifications", groupId = "notification-group")
    public void handleUserEvents(String message) {
        JsonNode json = parseMessage(message);
        String messageType = json.get("messageType").asText();

        if ("USER_FOLLOWED".equals(messageType)) {
            String followerId = json.get("followerId").asText();
            String followeeId = json.get("followeeId").asText();
            String followerEmail = json.get("followerEmail").asText();
            String followeeEmail = json.get("followeeEmail").asText();

            // Update Redis with both follower's and followee's email
            redisTemplate.opsForHash().put("user-emails", followerId, followerEmail);
            redisTemplate.opsForHash().put("user-emails", followeeId, followeeEmail);

            // Add the follower to the followee's followers list
            redisTemplate.opsForSet().add("followers:" + followeeId, followerId);
        }
        else if ("USER_UNFOLLOWED".equals(messageType)) {
            String followerId = json.get("followerId").asText();
            String followeeId = json.get("followeeId").asText();

            redisTemplate.opsForSet().remove("followers:" + followeeId, followerId);
        }
    }

    private JsonNode parseMessage(String message) {
        try {
            return new ObjectMapper().readTree(message);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
