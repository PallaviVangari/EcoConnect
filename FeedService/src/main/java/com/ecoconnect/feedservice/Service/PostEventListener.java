package com.ecoconnect.feedservice.Service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ecoconnect.feedservice.Repository.FeedPostRepository;
import com.ecoconnect.feedservice.Model.FeedPost;

import java.time.LocalDateTime;

@Service
public class PostEventListener {

    private final RedisTemplate<String, Object> redisTemplate;
    private final FeedPostRepository feedPostRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public PostEventListener(RedisTemplate<String, Object> redisTemplate, FeedPostRepository feedPostRepository) {
        this.redisTemplate = redisTemplate;
        this.feedPostRepository = feedPostRepository;
    }

    @KafkaListener(topics = "post-notifications", groupId = "feed-service-group")
    public void consumePostEvents(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String messageType = event.get("messageType").asText();

            if ("POST_CREATED".equals(messageType)) {
                handlePostCreated(event);
            } else if ("POST_UPDATED".equals(messageType)) {
                handlePostUpdated(event);
            } else if ("POST_DELETED".equals(messageType)) {
                handlePostDeleted(event);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handlePostCreated(JsonNode event) {
        String postId = event.get("postId").asText();
        String creatorId = event.get("authorId").asText();
        LocalDateTime createdTime = LocalDateTime.parse(event.get("timestamp").asText());

        // Store post in MongoDB
        FeedPost feedPost = new FeedPost(postId, creatorId, event.get("content").asText(),createdTime);
        feedPostRepository.save(feedPost);

        // Add to creator's recent posts in Redis
        String creatorFeedKey = "recent_posts:" + creatorId;
        redisTemplate.opsForZSet().add(creatorFeedKey, postId, System.currentTimeMillis());
    }

    private void handlePostUpdated(JsonNode event) {
        String postId = event.get("postId").asText();

        // Update the post in Redis (if needed)
        redisTemplate.opsForHash().put("posts", postId, event.toString());

        // Update MongoDB if needed
        FeedPost feedPost = feedPostRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        feedPost.setContent(event.get("content").asText());
        feedPostRepository.save(feedPost);
    }

    private void handlePostDeleted(JsonNode event) {
        String postId = event.get("postId").asText();
        String creatorId = event.get("authorId").asText();

        // Delete post from Redis
        redisTemplate.opsForZSet().remove("recent_posts:" + creatorId, postId);

        // Delete from MongoDB
        feedPostRepository.deleteById(postId);
    }
}
