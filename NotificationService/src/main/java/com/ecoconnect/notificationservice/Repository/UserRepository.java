package com.ecoconnect.notificationservice.Repository;

import com.ecoconnect.notificationservice.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
}
