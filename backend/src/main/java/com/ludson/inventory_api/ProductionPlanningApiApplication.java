package com.ludson.inventory_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Inventory and Production Planning API application.
 * This class bootstraps the Spring Boot application, initializing the context and embedded server.
 */
@SpringBootApplication
public class ProductionPlanningApiApplication {

	/**
	 * The main method that launches the application.
	 *
	 * @param args Command line arguments passed to the application.
	 */
	public static void main(String[] args) {
		SpringApplication.run(ProductionPlanningApiApplication.class, args);
	}

}
