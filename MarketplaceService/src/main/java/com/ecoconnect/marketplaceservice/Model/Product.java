package com.ecoconnect.marketplaceservice.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "Products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String sellerId; // User ID of the seller
    private LocalDateTime postedDate;
}

