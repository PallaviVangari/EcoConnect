package com.ecoconnect.userservice.Repository;

import com.ecoconnect.userservice.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findUserByEmail(String email);

    Optional<User> findUserByUserName(String userName);

    List<User> findAll();
}
