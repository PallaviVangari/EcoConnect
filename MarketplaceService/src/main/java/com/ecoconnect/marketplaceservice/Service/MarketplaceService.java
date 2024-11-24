package com.ecoconnect.marketplaceservice.Service;

import com.ecoconnect.marketplaceservice.Model.Product;
import com.ecoconnect.marketplaceservice.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketplaceService {
    private final ProductRepository productRepository;

    @Autowired
    public MarketplaceService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public Product getProduct(String productId){
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("No product found with id:"+productId));

        return product;
    }

    public void deleteProduct(String sellerId, String productId){
        if(!productRepository.findById(productId).isPresent())
            throw new RuntimeException("Product with given ID doesnt exist. Product Id ="+productId);
        Product product = productRepository.findById(productId).get();
        if(!product.getSellerId().equalsIgnoreCase(sellerId))
            throw new RuntimeException("Only seller can delete the product");
        productRepository.delete(product);
    }

    public Product createProduct(Product product)
    {
        if(productRepository.findById(product.getId()).isPresent())
            throw new RuntimeException("Product with given ID already exists");

        return productRepository.save(product);
    }

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }
}
