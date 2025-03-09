package com.ecoconnect.notificationservice.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "UserPreferences")
@Data
public class UserPreference {
    @Id
    private String userId;
    private boolean receiveEventNotifications;
    private boolean receiveProductNotifications;
}
