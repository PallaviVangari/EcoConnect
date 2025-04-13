package com.ecoconnect.marketplaceservice.Repository;

import com.ecoconnect.marketplaceservice.Model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findBySellerId(String sellerId);

    List<Product> findByIdIn(List<String> productIds);
}
