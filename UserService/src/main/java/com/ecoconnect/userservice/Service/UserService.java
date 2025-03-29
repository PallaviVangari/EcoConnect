package com.ecoconnect.userservice.Service;

import com.ecoconnect.userservice.Model.User;
import com.ecoconnect.userservice.Repository.UserRepository;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserPublisher userPublisher;

    @Autowired
    public UserService(UserRepository userRepository, UserPublisher userPublisher) {
        this.userRepository = userRepository;
        this.userPublisher = userPublisher;
    }

    public User registerUser(User user)
    {
        if (userRepository.findUserByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        return userRepository.save(user);
    }

    public User updateUser(String userName, User updatedUser) {
        User user = userRepository.findUserByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + userName));

        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getUserName() != null) {
            user.setUserName(updatedUser.getUserName());
        }
        if(updatedUser.getPassword() != null){
            user.setPassword(updatedUser.getPassword());
        }
        if(updatedUser.getRole() != null){
            user.setRole(updatedUser.getRole());
        }
        return userRepository.save(user);
    }

    public List<User> getAllUsers()
    {
        return userRepository.findAll();
    }

    public void followUser(String currentUserId, String userToFollowUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with userId: " + currentUserId));
        User userToFollow = userRepository.findById(userToFollowUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with userId: " + userToFollowUserId));

        currentUser.getFollowing().add(userToFollow.getId());
        userToFollow.getFollowers().add(currentUser.getId());

        userRepository.save(currentUser);
        userRepository.save(userToFollow);

        userPublisher.publishUserFollowed(currentUserId, userToFollowUserId, currentUser.getEmail(), userToFollow.getEmail());
    }

    public void unfollowUser(String currentUserId, String userToUnfollowUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with userId: " + currentUserId));
        User userToUnfollow = userRepository.findById(userToUnfollowUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with userId: " + userToUnfollowUserId));

        currentUser.getFollowing().remove(userToUnfollow.getId());
        userToUnfollow.getFollowers().remove(currentUser.getId());

        userRepository.save(currentUser);
        userRepository.save(userToUnfollow);

        userPublisher.publishUserUnfollowed(currentUserId,userToUnfollowUserId);
    }

    public List<User> getFollowers(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + userId));
        List<String> followerIds = new ArrayList<>(user.getFollowers());
        // findAllById returns an Iterable, we need to convert it to a List
        List<User> followers = new ArrayList<>();
        for (String followingId : followerIds) {
            User followingUser = userRepository.findById(followingId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + followingId));
            followers.add(followingUser);
        }


        return followers;
    }

    public List<User> getFollowing(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with userId: " + userId));
        // Convert the Set of following IDs to a List to match findAllById signature
        List<String> followingIds = new ArrayList<>(user.getFollowing());
        // findAllById returns an Iterable, we need to convert it to a List
        List<User> following = new ArrayList<>();
        for (String followingId : followingIds) {
            User followingUser = userRepository.findById(followingId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with userId: " + followingId));
            following.add(followingUser);
        }
        return following;
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }


}
