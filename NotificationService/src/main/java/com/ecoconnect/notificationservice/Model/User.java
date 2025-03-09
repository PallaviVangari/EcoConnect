package com.ecoconnect.notificationservice.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "UserEmailsAndFollowers")
@Data
public class User {
    @Id
    private String userId;
    private String email;
    private Map<String, String> followers = new HashMap<>();
}
