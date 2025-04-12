package com.ecoconnect.eventservice.Repository;

import com.ecoconnect.eventservice.Model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    Optional<Event> findEventById(String id);

    List<Event> findAll();

    List<Event> findByCreatorId(String creatorId);

}
