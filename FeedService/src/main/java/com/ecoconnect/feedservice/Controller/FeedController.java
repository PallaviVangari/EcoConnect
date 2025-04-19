package com.ecoconnect.feedservice.Controller;

import com.ecoconnect.feedservice.Model.FeedPost;
import com.ecoconnect.feedservice.Service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = "*")
public class FeedController {

    private final FeedService feedService;

    @Autowired
    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping("/{userId}")
    public List<FeedPost> getUserFeed(@PathVariable String userId, @RequestParam(defaultValue = "50") int limit, @RequestParam(required = false) String olderThan) {
        return feedService.getFeed(userId, limit, olderThan);
    }
}
