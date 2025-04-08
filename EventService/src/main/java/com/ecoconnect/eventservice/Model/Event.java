package com.ecoconnect.eventservice.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "Events")
@CompoundIndexes({
        @CompoundIndex(def = "{'rsvpUsers': 1}")
})
public class Event {
    @Id
    private String id;
    private String creatorId;
    private String name;
    private String description;
    private String location;
    private LocalDateTime dateTime;
    private List<String> rsvpUsers; // List of user IDs
}
