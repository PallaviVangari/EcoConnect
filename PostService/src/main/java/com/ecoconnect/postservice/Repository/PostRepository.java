package com.ecoconnect.postservice.Repository;

import com.ecoconnect.postservice.Model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    // The standard CRUD operations like save, findById, deleteById, etc., are inherited from MongoRepository

    // Custom method to retrieve all posts by a specific user
    List<Post> findByAuthorId(String userId);
}