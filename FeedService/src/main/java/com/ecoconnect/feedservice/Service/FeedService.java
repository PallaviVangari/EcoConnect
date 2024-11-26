package com.ecoconnect.feedservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FeedService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public FeedService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public List<String> getFeed(String userId) {
        // Get the list of post IDs from the user's feed
        List<Object> postIds = redisTemplate.opsForList().range("feed:" + userId, 0, 99);
        List<String> posts = new ArrayList<>();

        if (!postIds.isEmpty()) {
            // Fetch each post's details from the "posts" hash
            for (Object postId : postIds) {
                String postDetails = (String) redisTemplate.opsForHash().get("posts", postId);
                if (!postDetails.isEmpty()) {
                    posts.add(postDetails);
                }
            }
        }

        return posts;
    }
}

