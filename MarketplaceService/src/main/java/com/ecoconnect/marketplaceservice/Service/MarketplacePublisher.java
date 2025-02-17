package com.ecoconnect.marketplaceservice.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class MarketplacePublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public MarketplacePublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishProductCreated(String productId, String sellerId, String name) {
        Map<String, Object> message = new HashMap<>();
        message.put("messageType", "PRODUCT_CREATED");
        message.put("productId", productId);
        message.put("sellerId", sellerId);
        message.put("name", name);

        sendMessage("marketplace-notifications", message);
    }

    private void sendMessage(String topic, Map<String, Object> message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            kafkaTemplate.send(topic, jsonMessage);
        } catch (Exception e) {
            throw new RuntimeException("Error serializing Kafka message", e);
        }
    }
}
