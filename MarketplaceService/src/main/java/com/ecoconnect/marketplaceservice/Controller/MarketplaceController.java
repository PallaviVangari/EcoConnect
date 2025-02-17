package com.ecoconnect.marketplaceservice.Controller;

import com.ecoconnect.marketplaceservice.Model.Product;
import com.ecoconnect.marketplaceservice.Service.MarketplaceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/marketplace")
public class MarketplaceController {
    private final MarketplaceService marketplaceService;

    public MarketplaceController(MarketplaceService marketplaceService){
        this.marketplaceService = marketplaceService;
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

}
