package com.ecoconnect.userservice.Controller;

import com.ecoconnect.userservice.Service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecoconnect.userservice.Model.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Register a new user", description = "Creates a new user and returns user details")
    @PostMapping("/create")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            log.info("Received request to create a new user with username: {}", user.getUserName());
            if(userService.existsByEmail(user.getEmail()))
            {
                log.warn("User with email '{}' already exists. Skipping creation.", user.getEmail());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("A user with the email '" + user.getEmail() + "' already exists.");
            }
            User createdUser = userService.registerUser(user);
            log.info("Successfully created new user with id: {}", createdUser.getId());
            return ResponseEntity.ok(createdUser);
        }
        catch (Exception e) {
            log.error("Error creating user: A user with email '{}' already exists.", user.getEmail());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("A user with the email '" + user.getEmail() + "' already exists.");
        }
    }

    @PutMapping("/{userName}")
    @Operation(summary = "Update a new user", description = "Updates a user and returns updated user details")
    public ResponseEntity<?> updateUser(@PathVariable String userName, @RequestBody User updatedUser) {
        try {
            log.info("Received request to update user: {}", userName);
            User user = userService.updateUser(userName, updatedUser);
            return ResponseEntity.ok(user);
        }
        catch (Exception e)
        {
            log.error("Error Updating username: A user with username '{}' already exists.", updatedUser.getUserName());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("A user with the username '" + updatedUser.getUserName() + "' already exists.");
        }
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("Received request to get all  users");
        List<User> users = userService.getAllUsers();
        if(users.isEmpty()) {
            log.info("No users found ");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{userId}/follow/{userToFollowUserId}")
    public ResponseEntity<Void> followUser(@PathVariable String userId, @PathVariable String userToFollowUserId) throws JsonProcessingException {
        log.info("Received request for user with Id: {} to follow user with Id: {}", userId, userToFollowUserId);
        userService.followUser(userId, userToFollowUserId);
        log.info("User with username: {} followed user with id: {}", userId, userToFollowUserId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/unfollow/{userToUnfollowUserId}")
    public ResponseEntity<Void> unfollowUser(@PathVariable String userId, @PathVariable String userToUnfollowUserId) throws JsonProcessingException {
        log.info("Received request for user with username: {} to unfollow user with id: {}", userId, userToUnfollowUserId);
        userService.unfollowUser(userId, userToUnfollowUserId);
        log.info("User with username: {} unfollowed user with id: {}", userId, userToUnfollowUserId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable String userId) {
        log.info("Received request to get followers for user with username: {}", userId);
        List<User> followers = userService.getFollowers(userId);
        log.info("Retrieved {} followers for user with username: {}", followers.size(), userId);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable String userId) {
        log.info("Received request to get following for user with username: {}", userId);
        List<User> following = userService.getFollowing(userId);
        log.info("Retrieved {} following for user with username: {}", following.size(), userId);
        return ResponseEntity.ok(following);
    }

    @GetMapping("/getUserById/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            log.info("Fetching user with id: {}", userId);
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error fetching user with id {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with id: " + userId);
        }
    }

}