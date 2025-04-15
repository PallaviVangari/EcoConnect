package com.ecoconnect.postservice.Service;

import com.ecoconnect.postservice.Model.Post;
import com.ecoconnect.postservice.Repository.PostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@Slf4j
public class PostService {

    private final PostRepository postRepository;

    private final MongoTemplate mongoTemplate;

    private final PostPublisher postPublisher;

    @Autowired
    public PostService(PostRepository postRepository, MongoTemplate mongoTemplate, PostPublisher postPublisher) {
        this.postPublisher = postPublisher;
        this.postRepository = postRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public Post addPost(Post post)
    {
        post.setCreatedDate(LocalDateTime.now());
        post.setLastModifiedDate(LocalDateTime.now());
        Post savedPost = postRepository.save(post);

        // Publish POST_CREATED event
        postPublisher.publishPostCreated(
                savedPost.getPostId(),
                savedPost.getAuthorId(),
                savedPost.getContent(),
                savedPost.getCreatedDate().toString()
        );

        return savedPost;
    }

    public Optional<Post> getPostByPostId(String postId)
    {
        return postRepository.findById(postId);
    }

    public List<Post> getPostsByAuthorId(String userId)
    {
        return postRepository.findByAuthorIdOrderByCreatedDateDesc(userId);
    }

    public Optional<Post> updatePostByPostId(String userId, String postId, Post post, boolean isAdmin) {
        Optional<Post> postToBeUpdated = postRepository.findById(postId);

        if (postToBeUpdated.isPresent()) {
            if(!isAdmin && !userId.equals(postToBeUpdated.get().getAuthorId()))
            {
                log.debug("A user cannot update other user's posts");
                return Optional.empty();
            }
            Post updatedPost = postToBeUpdated.map(p -> {
                p.setContent(post.getContent());
                return p;
            }).orElse(null);
            updatedPost.setLastModifiedDate(LocalDateTime.now());
            postRepository.save(updatedPost);

            postPublisher.publishPostUpdated(
                    updatedPost.getPostId(),
                    updatedPost.getAuthorId(),
                    updatedPost.getContent(),
                    updatedPost.getLastModifiedDate().toString()
            );
            return Optional.of(updatedPost);
        } else {
            log.debug("Was not able to find the post to update with ID value " + postId);
            return Optional.empty();
        }
    }


    public boolean deletePostByPostId(String userId, String postId, boolean isAdmin)
    {
        Optional<Post> postToBeDeleted = postRepository.findById(postId);

        if(postToBeDeleted.isPresent())
        {
            if(!isAdmin && !userId.equals(postToBeDeleted.map(p -> p.getAuthorId()).orElse(null)))
                log.debug("A user cannot delete other user's posts");
            else
            {
                postRepository.deleteById(postId);
                postPublisher.publishPostDeleted(postId, userId);
                return true;
            }
        }
        else
            log.debug("Did not find the post to be deleted");
        return false;
    }
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts;
    }
    public List<Post> searchPosts(LocalDateTime fromDate, LocalDateTime toDate, String userId, String content) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (fromDate != null) {
            criteriaList.add(Criteria.where("createdDate").gte(fromDate));
        }
        if (toDate != null) {
            criteriaList.add(Criteria.where("createdDate").lte(toDate));
        }
        if (userId != null && !userId.isEmpty()) {
            criteriaList.add(Criteria.where("userId").is(userId));
        }
        if (content != null && !content.isEmpty()) {
            criteriaList.add(Criteria.where("content").regex(Pattern.quote(content), "i"));
        }

        if (criteriaList.isEmpty()) {
            return mongoTemplate.findAll(Post.class);
        }

        Criteria combinedCriteria = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
        Query query = Query.query(combinedCriteria);
        return mongoTemplate.find(query, Post.class);

    }
}