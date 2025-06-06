package com.ecoconnect.notificationservice.Service;

import com.ecoconnect.notificationservice.Model.User;
import com.ecoconnect.notificationservice.Model.UserPreference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class NotificationListener {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;
    private final UserService userService;
    private final UserPreferenceService userPreferenceService;

    @Autowired
    public NotificationListener(EmailService emailService, UserService userService, UserPreferenceService userPreferenceService) {
        this.emailService = emailService;
        this.userService = userService;
        this.userPreferenceService = userPreferenceService;
        this.objectMapper = new ObjectMapper();
    }

    @KafkaListener(topics = "user-notifications", groupId = "notification-group")
    public void handleUserEvents(String message) {
        try {
            JsonNode json = objectMapper.readTree(message);
            String messageType = json.get("messageType").asText();

            if(messageType.equals("USER_CREATED"))
                    return;

            String followerId = json.get("followerId").asText();
            String followeeId = json.get("followeeId").asText();

            log.info("Received message from user-notifications");

            if ("USER_FOLLOWED".equals(messageType)) {
                String followerEmail = json.get("followerEmail").asText();
                String followeeEmail = json.get("followeeEmail").asText();
                userService.addFollower(followeeId, followerId, followerEmail,followeeEmail );
            } else if ("USER_UNFOLLOWED".equals(messageType)) {
                userService.removeFollower(followeeId, followerId);
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Encountered error in handling user events");
        }
    }

    @KafkaListener(topics = "event-notifications", groupId = "notification-group")
    public void handleEventNotifications(String message) {
        JsonNode json = parseMessage(message);
        if (json == null) return;

        log.info("Received message from event-notifications");

        String messageType = json.get("messageType").asText();

        if ("EVENT_CREATED".equals(messageType)) {
            handleEventCreated(json);
        }
        else if ("EVENT_RSVP".equals(messageType)) {
            handleEventRSVP(json);
        }
    }

    @KafkaListener(topics = "marketplace-notifications", groupId = "notification-group")
    public void handleProductNotifications(String message){
        JsonNode json = parseMessage(message);
        if(json == null) return;

        log.info("Received message from product-notifications");
        String messageType = json.get("messageType").asText();

        if ("PRODUCT_CREATED".equals(messageType)) {
            handleProductCreated(json);
        }
    }

    private void handleEventCreated(JsonNode json) {
        String creatorId = json.get("creatorId").asText();
        String eventName = json.get("eventName").asText();

        User creator = userService.getUser(creatorId);
        if (creator == null) return;

        Map<String, String> followers = creator.getFollowers();
        if (followers == null || followers.isEmpty()) return;

        for (Map.Entry<String, String> entry : followers.entrySet()) {
            String followerId = entry.getKey();  // Assuming key is the follower's ID
            User follower = userService.getUser(followerId);
            if (follower == null) continue;

            // Check user preferences before sending email
            UserPreference pref = userPreferenceService.getUserPreferences(followerId);
            log.info("Event notification preference:"+pref.isReceiveEventNotifications());
            if (pref.isReceiveEventNotifications()) {
                emailService.sendEmail(follower.getEmail(), "New Event Created",
                        "Check out the event: " + eventName + " created by " + creator.getEmail());
            }
        }
    }


    private void handleEventRSVP(JsonNode json) {
        String eventId = json.get("eventId").asText();
        String participantId = json.get("participantId").asText();
        String eventName = json.get("eventName").asText();
        String participantEmail = json.get("participantEmail").asText();

        emailService.sendEmail(participantEmail, " RSVP'd to Event"+ eventName, "Thank you for registering to "+eventName);
    }

    private void handleProductCreated(JsonNode json) {
        String sellerId = json.get("sellerId").asText();
        String productName = json.get("name").asText();

        // Fetch seller details
        User seller = userService.getUser(sellerId);
        if (seller == null) return;

        // Fetch followers (Map<userId, email>)
        Map<String, String> followers = seller.getFollowers();
        if (followers == null || followers.isEmpty()) return;

        // Send notifications to followers
        for (Map.Entry<String, String> entry : followers.entrySet()) {
            String followerId = entry.getKey();
            String followerEmail = entry.getValue();

            // Check user preferences before sending email
            UserPreference pref = userPreferenceService.getUserPreferences(followerId);
            if (followerEmail != null && pref.isReceiveProductNotifications()) {
                emailService.sendEmail(followerEmail, "New Product Added",
                        "Check out the new product: " + productName + " listed by " + seller.getEmail());
            }
        }
    }

    private JsonNode parseMessage(String message) {
        try {
            return objectMapper.readTree(message);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Encountered an error in parsing the json message. "+message);
            return null;
        }
    }
}
