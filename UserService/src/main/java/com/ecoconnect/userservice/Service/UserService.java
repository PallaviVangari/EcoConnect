package com.ecoconnect.userservice.Service;

import com.ecoconnect.userservice.Model.User;
import com.ecoconnect.userservice.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}
