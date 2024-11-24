package com.ecoconnect.userservice.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private String role;
}