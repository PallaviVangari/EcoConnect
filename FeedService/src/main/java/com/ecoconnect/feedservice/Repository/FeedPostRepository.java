package com.ecoconnect.feedservice.Repository;

import com.ecoconnect.feedservice.Model.FeedPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FeedPostRepository extends MongoRepository<FeedPost, String> {

    List<FeedPost> findByAuthorIdInOrderByCreatedDateDesc(List<String> authorIds);
    List<FeedPost> findByAuthorIdInAndCreatedDateBeforeOrderByCreatedDateDesc(List<String> authorIds, LocalDateTime before);

}
