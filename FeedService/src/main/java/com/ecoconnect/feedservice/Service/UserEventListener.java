package com.ecoconnect.feedservice.Service;

import com.ecoconnect.feedservice.Model.User;
import com.ecoconnect.feedservice.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.kafka.annotation.KafkaListener;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

@Component
public class UserEventListener {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public UserEventListener(RedisTemplate<String, Object> redisTemplate, UserRepository userRepository, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    // Kafka Listener for "user-notifications" topic
    @KafkaListener(topics = "user-notifications", groupId = "feed-service-group")
    public void listenToUserEvents(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String messageType = event.get("messageType").asText();

            switch (messageType) {
                case "USER_FOLLOWED":
                    handleFollowEvent(event);
                    break;
                case "USER_UNFOLLOWED":
                    handleUnfollowEvent(event);
                    break;
                default:
                    System.out.println("Unknown message type: " + messageType);
            }
        } catch (Exception e) {
            System.err.println("Error processing Kafka message: " + e.getMessage());
        }
    }

    // Handle USER_FOLLOWED event
    private void handleFollowEvent(JsonNode event) {
        String followerId = event.get("followerId").asText();
        String followeeId = event.get("followeeId").asText();

        // Ensure follower exists in MongoDB
        User follower = userRepository.findById(followerId).orElseGet(() -> {
            User newUser = new User(followerId);
            return userRepository.save(newUser);
        });

        // Update MongoDB
        follower.getFollowing().add(followeeId);
        userRepository.save(follower);

        // Update Redis
        redisTemplate.opsForSet().add("followees:" + followerId, followeeId);

        System.out.println("User " + followerId + " followed " + followeeId);
    }

    // Handle USER_UNFOLLOWED event
    private void handleUnfollowEvent(JsonNode event) {
        String followerId = event.get("followerId").asText();
        String followeeId = event.get("followeeId").asText();

        Optional<User> followerOpt = userRepository.findById(followerId);

        if (followerOpt.isPresent()) {
            User follower = followerOpt.get();
            follower.getFollowing().remove(followeeId);
            userRepository.save(follower);

            // Update Redis
            redisTemplate.opsForSet().remove("followees:" + followerId, followeeId);

            System.out.println("User " + followerId + " unfollowed " + followeeId);
        }
    }
}
