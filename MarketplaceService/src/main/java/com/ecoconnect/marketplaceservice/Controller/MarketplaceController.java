package com.ecoconnect.marketplaceservice.Controller;

import com.ecoconnect.marketplaceservice.Model.Message;
import com.ecoconnect.marketplaceservice.Model.Product;
import com.ecoconnect.marketplaceservice.Service.MarketplaceService;
import com.ecoconnect.marketplaceservice.Service.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/marketplace")
public class MarketplaceController {
    private final MarketplaceService marketplaceService;
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public MarketplaceController(MarketplaceService marketplaceService, MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.marketplaceService = marketplaceService;
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/getAllProducts")
    public ResponseEntity<?> getAllProducts(){
        log.info("Received request for retrieving all products");
        List<Product> products = marketplaceService.getAllProducts();
        if(products.isEmpty())
        {
            log.info("No products found");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    @PostMapping("/createProduct")
    public ResponseEntity<?> createProduct(@RequestBody Product product){
        try {
            log.info("Received request for creating a product : {0}" + product.getName());
            Product p = marketplaceService.createProduct(product);
            return ResponseEntity.ok(p);
        }
        catch (Exception e)
        {
            log.error("Encountered error while creating product."+e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/{productId}/deleteProduct/{sellerId}")
    public ResponseEntity<?> deleteProduct(@PathVariable String productId,@PathVariable String sellerId){
        try{
            log.info("Received request to delete product with id:"+productId);
            Product product = marketplaceService.getProduct(productId);
            marketplaceService.deleteProduct(sellerId,productId);
            return ResponseEntity.ok("Product deleted successfully");
        }
        catch (Exception e){
            log.error("Encountered error while deleting product."+e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/{productId}/getProduct")
    public ResponseEntity<?> getProduct(@PathVariable String productId) {
        try{
            log.info("Received request to retrieve product with id: "+productId);
            Product product = marketplaceService.getProduct(productId);
            return ResponseEntity.ok(product);
        }
        catch (Exception e){
            log.error("Encountered error while retrieving product."+e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PutMapping("/{productId}/updateProduct/{sellerId}")
    public ResponseEntity<?> updateProduct(@PathVariable String productId,
                                           @PathVariable String sellerId,
                                           @RequestBody Product updatedProduct) {
        try {
            log.info("Received request to update product with ID: {}", productId);
            Product product = marketplaceService.updateProduct(sellerId, productId, updatedProduct);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            log.error("Error while updating product: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String query) {
        log.info("Searching for products with query: {}", query);
        return ResponseEntity.ok(marketplaceService.searchProducts(query));
    }

    @GetMapping("/seller/{sellerId}/products")
    public ResponseEntity<List<Product>> getProductsBySeller(@PathVariable String sellerId) {
        log.info("Fetching products for seller: {}", sellerId);
        return ResponseEntity.ok(marketplaceService.getProductsBySeller(sellerId));
    }

//    @PostMapping("/messages")
//    public ResponseEntity<Message> createMessage(@RequestBody Message message) {
//        try {
//            Message createdMessage = messageService.createMessage(message);
//            if (createdMessage != null) {
//                messagingTemplate.convertAndSend("/topic/return", createdMessage);
//                return ResponseEntity.status(HttpStatus.CREATED).body(createdMessage);
//            } else {
//                return ResponseEntity.badRequest().build();
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }
//
    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessagesBetweenUsers(
            @RequestParam(required = false) String senderId,
            @RequestParam(required = false) String receiverId,
            @RequestParam(required = false) String productId) {
        try {
            List<Message> messages = messageService.findMessages(senderId, receiverId, productId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/messages/user/{userId}/products")
    public ResponseEntity<List<Product>> getUserConversationProducts(@PathVariable String userId) {
        try {
            List<Product> products = messageService.getConversationProductsForUser(userId);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> createMessage(@RequestBody Message message) {
        try {
            if (message.getTimestamp() == null) {
                message.setTimestamp(new Date().toString()); // Set current timestamp if null
            }
            Message createdMessage = messageService.createMessage(message);
            if (createdMessage != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(createdMessage);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

//    @GetMapping("/messages")
//    public ResponseEntity<List<Message>> getMessages(@RequestParam(required = false) String senderId, @RequestParam(required = false) String receiverId, @RequestParam(required = false) String productId) {
//        try {
//            List<Message> messages = messageService.findMessages(senderId, receiverId,productId);
//            return ResponseEntity.ok(messages);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

    @GetMapping("/messages/seller/{sellerId}/product/{productId}")
    public List<Message> getMessagesForProduct(@PathVariable String sellerId, @PathVariable String productId) {
        return messageService.findByProductIdAndReceiverId(productId, sellerId);
    }




}
