package com.ecoconnect.notificationservice.Repository;

import com.ecoconnect.notificationservice.Model.UserPreference;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPreferenceRepository extends MongoRepository<UserPreference, String> {
}
