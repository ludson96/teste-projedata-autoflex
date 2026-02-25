package com.ludson.inventory_api.models.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ludson.inventory_api.models.entities.RawMaterial;

/**
 * Repository interface for managing {@link RawMaterial} entities.
 * Extends {@link JpaRepository} to provide standard CRUD operations and
 * database interactions.
 */
public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {
}