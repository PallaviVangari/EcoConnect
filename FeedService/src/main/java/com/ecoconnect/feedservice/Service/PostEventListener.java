package com.ecoconnect.feedservice.Service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Set;

@Service
public class PostEventListener {

    private final RedisTemplate<String, Object> redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public PostEventListener(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @KafkaListener(topics = "post-notifications", groupId = "feed-service-group")
    public void consumePostEvents(String message)
    {
        try
        {
            JsonNode event = objectMapper.readTree(message);
            String messageType = event.get("messageType").asText();

            if ("POST_CREATED".equals(messageType))
                handlePostCreated(event);
            else if ("POST_UPDATED".equals(messageType))
                handlePostUpdated(event);
            else if("POST_DELETED".equals(messageType))
                handlePostDeleted(event);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handlePostCreated(JsonNode event) {
        String postId = event.get("postId").asText();
        String creatorId = event.get("authorId").asText();

        // Cache the post details in Redis
        redisTemplate.opsForHash().put("posts", postId, event.toString());

        // Add the post to the creator's feed for future followers
        String creatorFeedKey = "creator-feed:" + creatorId;
        redisTemplate.opsForList().leftPush(creatorFeedKey, postId);
        redisTemplate.opsForList().trim(creatorFeedKey, 0, 99); // Limit size

        // Push the post to current followers' feeds
        Set<Object> followers = redisTemplate.opsForSet().members("followers:" + creatorId);
        if (!followers.isEmpty()) {
            for (Object followerId : followers) {
                String followerFeedKey = "feed:" + followerId;
                redisTemplate.opsForList().leftPush(followerFeedKey, postId);
                redisTemplate.opsForList().trim(followerFeedKey, 0, 99); // Limit size
            }
        }
    }

    private void handlePostUpdated(JsonNode event) {
        String postId = event.get("postId").asText();

        // Update the post details in Redis
        redisTemplate.opsForHash().put("posts", postId, event.toString());
        // No need to update feeds since they only store post IDs.
    }

    private void handlePostDeleted(JsonNode event) {
        String postId = event.get("postId").asText();
        String creatorId = event.get("authorId").asText(); // Ensure the correct field for creator ID is used

        // Remove the post details from Redis hash
        redisTemplate.opsForHash().delete("posts", postId);

        // Remove the post from the creator's feed
        String creatorFeedKey = "creator-feed:" + creatorId;
        redisTemplate.opsForList().remove(creatorFeedKey, 0, postId);

        // Remove the post from each follower's feed
        String followersKey = "followers:" + creatorId;
        Set<Object> followers = redisTemplate.opsForSet().members(followersKey);

        if (!followers.isEmpty()) {
            for (Object followerId : followers) {
                String followerFeedKey = "feed:" + followerId;
                redisTemplate.opsForList().remove(followerFeedKey, 0, postId);
            }
        }

        System.out.println("Post with ID " + postId + " has been removed.");
    }

}
