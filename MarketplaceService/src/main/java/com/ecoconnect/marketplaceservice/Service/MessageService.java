package com.ecoconnect.marketplaceservice.Service;

import com.ecoconnect.marketplaceservice.Model.Message;
import com.ecoconnect.marketplaceservice.Model.Product;
import com.ecoconnect.marketplaceservice.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MarketplaceService marketplace;

    public List<Message> findAllMessages(){
        return messageRepository.findAll();
    }
    public List<Message> findMessageBetweenUsers(String senderId, String receiverId){
        return messageRepository.findBySenderIdAndReceiverId(senderId, receiverId);
    }
    public List<Message> findMessages(String senderId, String receiverId, String productId){
        System.out.println("Fetching messages for product: " + productId + " between " + senderId + " and " + receiverId);
        if (senderId != null && receiverId != null && productId != null) {
            return messageRepository.findBySenderIdAndReceiverIdAndProductId(senderId, receiverId, productId);
        } else if (senderId != null && receiverId != null) {
            return messageRepository.findBySenderIdAndReceiverId(senderId, receiverId);
        } else {
            return messageRepository.findAll(); // fallback
        }
    }
    public Message createMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Product> getConversationProductsForUser(String userId) {
        List<String> productIds = messageRepository.findDistinctProductIdsByUser(userId);
        return marketplace.getProductsByIds(productIds); //
    }

    public List<Message> findByProductIdAndReceiverId(String productId, String sellerId) {
        return messageRepository.findByProductIdAndSellerId(productId, sellerId);
    }
}
