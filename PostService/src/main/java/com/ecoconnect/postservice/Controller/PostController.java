package com.ecoconnect.postservice.Controller;

import com.ecoconnect.postservice.Model.Post;
import com.ecoconnect.postservice.Service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@Slf4j
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/createPost")
    public Post addPost(@RequestBody Post post)
    {
        var createdPost = postService.addPost(post);
        log.info("Post created with id: " + createdPost.getPostId());
        return createdPost;
    }

    @GetMapping("/getUserPosts/{userId}")
    public List<Post> getAllPostsByUserId(@PathVariable String userId)
    {
        return postService.getPostsByAuthorId(userId);
    }

    @PutMapping("/updatePost/{userId}/{postId}")
    public Optional<Post> updatePostById(@PathVariable String userId, @PathVariable String postId, @RequestParam(required = false) boolean isAdmin, @RequestBody Post post)
    {
        var updatedPost = postService.updatePostByPostId(userId, postId, post, isAdmin);
        log.info("Post updated with id: " + postId);
        return updatedPost;
    }

    @DeleteMapping("/deletePost/{userId}/{postId}")
    public void deletePostByPostId(@PathVariable String userId, @PathVariable String postId, @RequestParam(required = false) boolean isAdmin)
    {
        postService.getPostByPostId(postId);
        postService.deletePostByPostId(userId, postId, isAdmin);
        log.info("Post deleted with id: " + postId);
    }
    @GetMapping("/getAllPosts")
    public ResponseEntity<List<Post>> getAllPostsByUserId()
    {
        log.info("Received request to get all posts");
        List<Post> posts = postService.getAllPosts();
        if(posts.isEmpty()) {
            log.info("No Posts found ");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(posts);
    }
    @GetMapping("/searchPosts")
    public List<Post> searchPosts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String content) {
        return postService.searchPosts(fromDate, toDate, userId, content);
    }

}