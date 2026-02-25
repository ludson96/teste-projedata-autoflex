package com.ludson.inventory_api.models.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ludson.inventory_api.models.entities.Product;

/**
 * Repository interface for managing {@link Product} entities.
 * Extends {@link JpaRepository} to provide standard CRUD operations and
 * database interactions.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {
}