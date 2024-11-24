package com.ecoconnect.userservice.Controller;

import com.ecoconnect.userservice.Service.UserService;
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
            User createdUser = userService.registerUser(user);
            log.info("Created new user with id: {}", createdUser.getId());
            return ResponseEntity.ok(createdUser);
        }
        catch (Exception e) {
            log.error("Error creating user: A user with username '{}' already exists.", user.getUserName());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("A user with the username '" + user.getUserName() + "' already exists.");
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

}