package com.ludson.inventory_api.models.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ludson.inventory_api.models.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {}