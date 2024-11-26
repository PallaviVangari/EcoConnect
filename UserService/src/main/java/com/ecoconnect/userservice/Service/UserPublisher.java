package com.ecoconnect.userservice.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public UserPublisher(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    // Method to publish "USER_FOLLOWED" event to Kafka
    public void publishUserFollowed(String followerId, String followeeId, String followerEmail, String followeeEmail) {
        String message = String.format(
                "{\"messageType\":\"USER_FOLLOWED\",\"followerId\":\"%s\",\"followeeId\":\"%s\",\"followerEmail\":\"%s\",\"followeeEmail\":\"%s\"}",
                followerId, followeeId, followerEmail, followeeEmail
        );

        // Send the message to the "user-notifications" Kafka topic
        kafkaTemplate.send("user-notifications", message);
    }

    // Method to publish "USER_UNFOLLOWED" event to Kafka
    public void publishUserUnfollowed(String followerId, String followeeId) {
        String message = String.format(
                "{\"messageType\":\"USER_UNFOLLOWED\",\"followerId\":\"%s\",\"followeeId\":\"%s\"}",
                followerId, followeeId
        );

        // Send the message to the "user-notifications" Kafka topic
        kafkaTemplate.send("user-notifications", message);
    }
}
