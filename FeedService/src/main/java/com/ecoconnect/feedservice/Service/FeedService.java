package com.ecoconnect.feedservice.Service;

import com.ecoconnect.feedservice.Model.FeedPost;
import com.ecoconnect.feedservice.Model.User;
import com.ecoconnect.feedservice.Repository.FeedPostRepository;
import com.ecoconnect.feedservice.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class FeedService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final FeedPostRepository feedPostRepository;
    private final UserRepository userRepository;

    @Autowired
    public FeedService(RedisTemplate<String, Object> redisTemplate, FeedPostRepository feedPostRepository, UserRepository userRepository) {
        this.redisTemplate = redisTemplate;
        this.feedPostRepository = feedPostRepository;
        this.userRepository = userRepository;
    }

    public List<FeedPost> getFeed(String userId, int limit, String olderThan) {
        Set<String> followees = getFollowees(userId);
        if (followees.isEmpty())
            return Collections.emptyList();

        Set<FeedPost> combined = new TreeSet<>(Comparator.comparing(FeedPost::getCreatedDate).reversed());

        // Fetch from Redis
        Set<FeedPost> redisPosts = fetchFeedPostsFromRedis(followees, limit, olderThan);
        combined.addAll(redisPosts);

        // If Redis doesn't have enough, fallback to Mongo
        if (combined.size() < limit) {
            List<FeedPost> mongoPosts = fetchFeedPostsFromMongoDB(followees.stream().toList(), limit - combined.size(), olderThan);

            // Deduplicate based on postId
            Set<String> seenIds = combined.stream().map(FeedPost::getPostId).collect(Collectors.toSet());
            List<FeedPost> newOnly = mongoPosts.stream()
                    .filter(p -> !seenIds.contains(p.getPostId()))
                    .toList();

            combined.addAll(newOnly);
            cacheFeedPostsToRedis(newOnly); // Cache only new ones
        }

        // Final sorted + limited result
        return combined.stream()
                .sorted(Comparator.comparing(FeedPost::getCreatedDate).reversed())
                .limit(limit)
                .toList();
    }

    private Set<String> getFollowees(String userId) {
        Set<Object> cachedFollowees = redisTemplate.opsForSet().members("followees:" + userId);

        if (cachedFollowees != null && !cachedFollowees.isEmpty()) {
            return cachedFollowees.stream().map(Object::toString).collect(Collectors.toSet());
        }

        User user = userRepository.findUserFollowing(userId);
        Set<String> followees = (user != null) ? user.getFollowing() : Collections.emptySet();
        if (followees != null && !followees.isEmpty())
            updateFolloweesInRedis(userId,followees);

        return followees;
    }

    private Set<FeedPost> fetchFeedPostsFromRedis(Set<String> followees, int limit, String olderThan) {
        Set<FeedPost> feedPosts = new TreeSet<>(Comparator.comparing(FeedPost::getCreatedDate).reversed());

        Long maxScore = null;
        if (olderThan != null && !olderThan.isEmpty()) {
            maxScore = LocalDateTime.parse(olderThan).toEpochSecond(ZoneOffset.UTC);
        }

        for (String followeeId : followees) {
            Set<Object> postIds;
            if (maxScore != null) {
                postIds = redisTemplate.opsForZSet().reverseRangeByScore(
                        "recent_posts:" + followeeId, 0, maxScore - 1, 0, limit
                );
            } else {
                postIds = redisTemplate.opsForZSet().reverseRange(
                        "recent_posts:" + followeeId, 0, limit - 1
                );
            }

            if (postIds != null) {
                List<FeedPost> posts = feedPostRepository.findAllById(
                        postIds.stream().map(Object::toString).toList()
                );
                feedPosts.addAll(posts);
            }
        }

        return feedPosts;
    }

    private List<FeedPost> fetchFeedPostsFromMongoDB(List<String> followees, int limit, String olderThan) {
        if (olderThan == null || olderThan.isEmpty()) {
            return feedPostRepository.findByAuthorIdInOrderByCreatedDateDesc(followees)
                    .stream().limit(limit).toList();
        } else {
            LocalDateTime cutoff = LocalDateTime.parse(olderThan);
            return feedPostRepository.findByAuthorIdInAndCreatedDateBeforeOrderByCreatedDateDesc(followees, cutoff)
                    .stream().limit(limit).toList();
        }
    }

    private void cacheFeedPostsToRedis(List<FeedPost> posts) {
        for (FeedPost post : posts) {
            String key = "recent_posts:" + post.getAuthorId();
            redisTemplate.opsForZSet().add(
                    key,
                    post.getPostId(),
                    post.getCreatedDate().toEpochSecond(ZoneOffset.UTC)
            );
            redisTemplate.opsForZSet().removeRange(key, 0, -51);
        }
    }

    public void updateFolloweesInRedis(String userId, Set<String> followees) {
        redisTemplate.opsForSet().add("followees:" + userId, followees.toArray());
        redisTemplate.expire("followees:" + userId, 1, TimeUnit.DAYS);
    }
}
