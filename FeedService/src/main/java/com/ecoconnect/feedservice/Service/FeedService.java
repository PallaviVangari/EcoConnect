package com.ecoconnect.feedservice.Service;

import com.ecoconnect.feedservice.Model.FeedPost;
import com.ecoconnect.feedservice.Model.User;
import com.ecoconnect.feedservice.Repository.FeedPostRepository;
import com.ecoconnect.feedservice.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
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

    public List<FeedPost> getFeed(String userId, int limit) {
        Set<String> followees = getFollowees(userId);
        if (followees.isEmpty())
            return Collections.emptyList();

        Set<FeedPost> feedPosts = fetchFeedPostsFromRedis(followees, limit);

        if (feedPosts.size() < limit) {
            List<FeedPost> additionalPosts = fetchFeedPostsFromMongoDB(followees.stream().toList(), limit - feedPosts.size());
            cacheFeedPostsToRedis(additionalPosts);
            feedPosts.addAll(additionalPosts);
        }

        return feedPosts.stream().limit(limit).collect(Collectors.toList());
    }

    private Set<String> getFollowees(String userId) {
        Set<Object> cachedFollowees = redisTemplate.opsForSet().members("followees:" + userId);

        if (cachedFollowees != null && !cachedFollowees.isEmpty()) {
            return cachedFollowees.stream().map(Object::toString).collect(Collectors.toSet());
        }

        User user = userRepository.findUserFollowing(userId);
        Set<String> followees = (user != null) ? user.getFollowing() : Collections.EMPTY_SET;
        if (followees != null && !followees.isEmpty())
            updateFolloweesInRedis(userId,followees );

        return followees;
    }

    private Set<FeedPost> fetchFeedPostsFromRedis(Set<String> followees, int limit) {
        Set<FeedPost> feedPosts = new TreeSet<>(Comparator.comparing(FeedPost::getCreatedDate).reversed());

        for (String followeeId : followees) {
            Set<Object> postIds = redisTemplate.opsForZSet().reverseRange("recent_posts:" + followeeId, 0, limit - 1);
            if (postIds != null) {
                List<FeedPost> posts = feedPostRepository.findAllById(
                        postIds.stream().map(Object::toString).collect(Collectors.toList())
                );
                feedPosts.addAll(posts);
            }
        }

        return feedPosts;
    }

    private List<FeedPost> fetchFeedPostsFromMongoDB(List<String> followees, int remainingPosts) {
        return feedPostRepository.findByAuthorIdInOrderByCreatedDateDesc(followees)
                .stream()
                .limit(remainingPosts)
                .collect(Collectors.toList());
    }



    private void cacheFeedPostsToRedis( List<FeedPost> posts) {
        for (FeedPost post : posts) {
            String key = "recent_posts:" + post.getAuthorId();
            redisTemplate.opsForZSet().add(key, post.getPostId(), post.getCreatedDate().toEpochSecond(ZoneOffset.UTC));
            redisTemplate.opsForZSet().removeRange(key, 0, -51); // Keep latest 50 posts
        }
    }

    public void updateFolloweesInRedis(String userId, Set<String> followees) {
        redisTemplate.opsForSet().add("followees:" + userId, followees.toArray());
        redisTemplate.expire("followees:" + userId, 1, TimeUnit.DAYS);
    }
}
