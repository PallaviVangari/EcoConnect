package com.ecoconnect.notificationservice.Service;

import com.ecoconnect.notificationservice.Model.User;
import com.ecoconnect.notificationservice.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.concurrent.TimeUnit;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public UserService(UserRepository userRepository, RedisTemplate<String, Object> redisTemplate) {
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
    }

    public User getUser(String userId) {
        User cachedUser = (User) redisTemplate.opsForValue().get("user:" + userId);
        if (cachedUser != null) {
            return cachedUser;
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            redisTemplate.opsForValue().set("user:" + userId, user, 1, TimeUnit.DAYS);
        }
        return user;
    }

    public void addFollower(String followeeId, String followerId, String followerEmail, String followeeEmail) {
        //  Ensure followee exists, if not create one
        User followee = getUser(followeeId);
        if (followee == null) {
            followee = new User();
            followee.setUserId(followeeId);
            followee.setEmail(followeeEmail);
            followee.setFollowers(new HashMap<>());
        }

        //  Ensure follower exists, if not create one
        User follower = getUser(followerId);
        System.out.println("Follower user value = "+follower);
        if (follower == null) {
            follower = new User();
            follower.setUserId(followerId);
            follower.setEmail(followerEmail);
            follower.setFollowers(new HashMap<>());
            userRepository.save(follower);
        }

        // Add follower details
        followee.getFollowers().put(followerId, followerEmail);
        userRepository.save(followee);

        // Update Redis
        redisTemplate.opsForValue().set("user:" + followeeId, followee, 1, TimeUnit.DAYS);
    }

    public void removeFollower(String followeeId, String followerId) {
        User followee = getUser(followeeId);
        if (followee == null) return;

        followee.getFollowers().remove(followerId);
        userRepository.save(followee);

        redisTemplate.opsForValue().set("user:" + followeeId, followee, 1, TimeUnit.DAYS);
    }
}
