package com.ecoconnect.feedservice.Service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UserEventListener {

    private final RedisTemplate<String, Object> redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public UserEventListener(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @KafkaListener(topics = "user-notifications", groupId = "feed-service-group")
    public void consumeUserEvents(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String messageType = event.get("messageType").asText();

            if ("USER_FOLLOWED".equals(messageType)) {
                handleUserFollowed(event);
            } else if ("USER_UNFOLLOWED".equals(messageType)) {
                handleUserUnfollowed(event);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleUserFollowed(JsonNode event) {
        String followerId = event.get("followerId").asText();
        String followeeId = event.get("followeeId").asText();

        // Add the follower to the followee's followers set
        redisTemplate.opsForSet().add("followers:" + followeeId, followerId);

        // Populate the new follower's feed with recent posts from the followee

        //THIS IS CAUSING DUPLICATE POSTS IN FEED WHEN WE UNFOLLOW AND FOLLOW BACK

//        List<Object> recentPosts = redisTemplate.opsForList().range("creator-feed:" + followeeId, 0, 9);
//        if (!recentPosts.isEmpty()) {
//            String followerFeedKey = "feed:" + followerId;
//            redisTemplate.opsForList().leftPushAll(followerFeedKey, recentPosts);
//            redisTemplate.opsForList().trim(followerFeedKey, 0, 99); // Limit feed size
//        }
    }

    private void handleUserUnfollowed(JsonNode event) {
        String followerId = event.get("followerId").asText();
        String followeeId = event.get("followeeId").asText();

        // Remove the follower from the followee's followers set
        redisTemplate.opsForSet().remove("followers:" + followeeId, followerId);
    }
}
