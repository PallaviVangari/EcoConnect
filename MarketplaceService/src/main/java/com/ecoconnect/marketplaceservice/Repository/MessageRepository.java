package com.ecoconnect.marketplaceservice.Repository;

import com.ecoconnect.marketplaceservice.Model.Message;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    @Query("{ $or: [ { 'senderId': ?0, 'receiverId': ?1 }, { 'senderId': ?1, 'receiverId': ?0 } ] }")
    List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId);

    @Query("{ 'productId': ?2, $or: [ { 'senderId': ?0, 'receiverId': ?1 }, { 'senderId': ?1, 'receiverId': ?0 } ] }")
    List<Message> findBySenderIdAndReceiverIdAndProductId(String senderId, String receiverId, String productId);

    @Query("{ '$or': [ { 'senderId': ?0 }, { 'receiverId': ?0 } ] }")
    @Aggregation(pipeline = {
            "{ '$match': { '$or': [ { 'senderId': ?0 }, { 'receiverId': ?0 } ] } }",
            "{ '$group': { '_id': '$productId' } }"
    })
    List<String> findDistinctProductIdsByUser(String userId);

    @Query("{ 'productId': ?0, 'sellerId': ?1 }")
    List<Message> findByProductIdAndSellerId(String productId, String sellerId);
}
