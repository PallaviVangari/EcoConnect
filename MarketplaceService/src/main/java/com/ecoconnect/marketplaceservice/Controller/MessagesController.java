package com.ecoconnect.marketplaceservice.Controller;

import com.ecoconnect.marketplaceservice.Model.Message;
import com.ecoconnect.marketplaceservice.Service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class MessagesController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    public MessagesController(SimpMessagingTemplate messagingTemplate, MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }

    // Handle incoming messages and broadcast them to the correct topic
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(Message message) {
        try {
            // Create the message (persist it, if needed)
            Message createdMessage = messageService.createMessage(message);

            if (createdMessage != null) {
                // Broadcast the message to the topic for the given productId
                messagingTemplate.convertAndSend("/topic/messages/" + message.getProductId(), createdMessage);
            }
        } catch (Exception e) {
            // Handle any exceptions (you can log them if necessary)
            e.printStackTrace();
        }
    }
}
