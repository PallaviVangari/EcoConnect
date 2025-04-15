package com.ecoconnect.postservice.Repository;

import com.ecoconnect.postservice.Model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    // The standard CRUD operations like save, findById, deleteById, etc., are inherited from MongoRepository

    List<Post> findByAuthorIdOrderByCreatedDateDesc(String authorId);

}