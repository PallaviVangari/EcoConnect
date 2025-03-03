package com.ecoconnect.feedservice.Repository;

import com.ecoconnect.feedservice.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    @Query(value = "{ '_id': ?0 }", fields = "{ 'following': 1 }")
    User findUserFollowing(String userId);

}
