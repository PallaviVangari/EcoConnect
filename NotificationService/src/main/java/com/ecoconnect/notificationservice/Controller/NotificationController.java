package com.ecoconnect.notificationservice.Controller;

import com.ecoconnect.notificationservice.Model.UserPreference;
import com.ecoconnect.notificationservice.Service.UserPreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications/preferences")
public class NotificationController {

    private final UserPreferenceService preferenceService;

    @Autowired
    public NotificationController(UserPreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @GetMapping("/{userId}")
    public UserPreference getPreferences(@PathVariable String userId) {
        return preferenceService.getUserPreferences(userId);
    }

    @PostMapping("/{userId}")
    public void updatePreferences(@PathVariable String userId, @RequestBody UserPreference preferences) {
        preferenceService.updateUserPreferences(userId, preferences);
    }
}
