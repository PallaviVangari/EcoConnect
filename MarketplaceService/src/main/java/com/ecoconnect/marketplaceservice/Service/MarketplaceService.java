package com.ecoconnect.marketplaceservice.Service;

import com.ecoconnect.marketplaceservice.Model.Product;
import com.ecoconnect.marketplaceservice.Repository.ProductRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketplaceService {
    private final ProductRepository productRepository;
    private final MarketplacePublisher marketplacePublisher;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public MarketplaceService(ProductRepository productRepository, MarketplacePublisher marketplacePublisher, MongoTemplate mongoTemplate){
        this.productRepository = productRepository;
        this.marketplacePublisher = marketplacePublisher;
        this.mongoTemplate = mongoTemplate;
    }

    public Product getProduct(String productId){
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("No product found with id:"+productId));

        return product;
    }

    public void deleteProduct(String sellerId, String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product with ID " + productId + " does not exist"));

        if (!product.getSellerId().equalsIgnoreCase(sellerId))
            throw new RuntimeException("Only the seller can delete this product");

        productRepository.delete(product);
    }

    public Product createProduct(Product product)
    {
        if(productRepository.findById(product.getId()).isPresent())
            throw new RuntimeException("Product with given ID already exists");

        Product createdProduct = productRepository.save(product);

        // Publish Kafka event
        marketplacePublisher.publishProductCreated(
                createdProduct.getId(),
                createdProduct.getSellerId(),
                createdProduct.getName()
        );
        return createdProduct;
    }

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    public Product updateProduct(String sellerId, String productId, Product updatedProduct) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product with ID " + productId + " does not exist"));

        if (!existingProduct.getSellerId().equalsIgnoreCase(sellerId))
            throw new RuntimeException("Only the seller can update this product");

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());

        return productRepository.save(existingProduct);
    }

    public List<Product> searchProducts(String query) {
        Criteria criteria = new Criteria().orOperator(
                Criteria.where("name").regex(query, "i"),
                Criteria.where("description").regex(query, "i")
        );
        Query mongoQuery = new Query(criteria);
        return mongoTemplate.find(mongoQuery, Product.class);
    }
    public List<Product> getProductsBySeller(String sellerId) {
        return productRepository.findBySellerId(sellerId);
    }


}
