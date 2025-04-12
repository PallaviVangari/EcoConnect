package com.ecoconnect.userservice.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "Users")
@Data
public class User {

    @Id
    private String id;
    @Indexed(unique = true)
    private String userName;
    private String password;
    @Indexed(unique = true)
    private String email;
    private Set<String> followers = new HashSet<>();
    private Set<String> following = new HashSet<>();
    private String location;
    private String bio;
    private String profileImageUrl;
}