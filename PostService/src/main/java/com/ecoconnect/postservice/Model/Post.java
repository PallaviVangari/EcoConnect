package com.ecoconnect.postservice.Model;

import java.time.LocalDateTime;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Posts")
@Data
public class Post {

    @Id
    private String postId;

    private String authorId;

    private LocalDateTime createdDate;

    private LocalDateTime lastModifiedDate;

    private String content;
}