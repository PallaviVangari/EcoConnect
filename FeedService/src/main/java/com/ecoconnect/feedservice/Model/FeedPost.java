package com.ecoconnect.feedservice.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "feedPosts")
public class FeedPost {
    @Id
    private String postId;
    private String authorId;
    private String content;
    private LocalDateTime createdDate;
    private String authorName;
}
