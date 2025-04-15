package com.ecoconnect.feedservice.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private Set<String> following = new HashSet<>(); // Stores followees
    private String userName;

    public User(String id) {
        this.id = id;
    }
}
