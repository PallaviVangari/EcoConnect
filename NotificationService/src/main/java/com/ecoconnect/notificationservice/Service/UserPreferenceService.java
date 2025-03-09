package com.ecoconnect.notificationservice.Service;

import com.ecoconnect.notificationservice.Model.UserPreference;
import com.ecoconnect.notificationservice.Repository.UserPreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
public class UserPreferenceService {

    private final UserPreferenceRepository preferenceRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public UserPreferenceService(UserPreferenceRepository preferenceRepository, RedisTemplate<String, Object> redisTemplate) {
        this.preferenceRepository = preferenceRepository;
        this.redisTemplate = redisTemplate;
    }

    public UserPreference getUserPreferences(String userId) {
        // Check Redis first
        UserPreference cachedPref = (UserPreference) redisTemplate.opsForValue().get("user-preferences:" + userId);
        if (cachedPref != null) {
            return cachedPref;
        }

        // Fetch from MongoDB and cache it
        UserPreference pref = preferenceRepository.findById(userId).orElse(new UserPreference());
        redisTemplate.opsForValue().set("user-preferences:" + userId, pref, 1, TimeUnit.DAYS);
        return pref;
    }

    public void updateUserPreferences(String userId, UserPreference preferences) {
        preferences.setUserId(userId);
        preferenceRepository.save(preferences);
        redisTemplate.opsForValue().set("user-preferences:" + userId, preferences, 1, TimeUnit.DAYS);
    }
}
