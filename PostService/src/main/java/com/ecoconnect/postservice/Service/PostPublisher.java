package com.ecoconnect.postservice.Service;

import org.apache.kafka.common.protocol.types.Field;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PostPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    public PostPublisher(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    // Publish POST_CREATED message
    public void publishPostCreated(String postId, String authorId, String content, String createdDate) {
        String message = String.format(
                "{\"messageType\":\"POST_CREATED\",\"postId\":\"%s\",\"authorId\":\"%s\",\"content\":\"%s\",\"createdDate\":\"%s\"}",
                postId, authorId, content, createdDate
        );
        kafkaTemplate.send("post-notifications", message);
    }

    // Publish POST_UPDATED message
    public void publishPostUpdated(String postId, String authorId, String content, String lastModifiedDate) {
        String message = String.format(
                "{\"messageType\":\"POST_UPDATED\",\"postId\":\"%s\",\"authorId\":\"%s\",\"content\":\"%s\",\"lastModifiedDate\":\"%s\"}",
                postId, authorId, content, lastModifiedDate
        );
        kafkaTemplate.send("post-notifications", message);
    }

    //Publish POST_DELETED message
    public void publishPostDeleted(String postId, String authorId){
        String message = String.format(
                "{\"messageType\":\"POST_DELETED\",\"postId\":\"%s\",\"authorId\":\"%s\"}",
                    postId,authorId
        );
        kafkaTemplate.send("post-notifications", message);
    }
}
