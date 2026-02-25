package com.ludson.inventory_api.models.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ludson.inventory_api.models.entities.ProductMaterial;
import java.util.List;

/**
 * Repository interface for managing {@link ProductMaterial} entities.
 * Handles database operations related to the association between products and raw materials.
 */
public interface ProductMaterialRepository extends JpaRepository<ProductMaterial, Long> {
    /**
     * Finds all material associations for a specific product.
     *
     * @param productId The unique identifier of the product.
     * @return A list of {@link ProductMaterial} entities associated with the given product ID.
     */
    List<ProductMaterial> findByProductId(Long productId);
}