package com.ecoconnect.feedservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class FeedServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FeedServiceApplication.class, args);
	}

}
