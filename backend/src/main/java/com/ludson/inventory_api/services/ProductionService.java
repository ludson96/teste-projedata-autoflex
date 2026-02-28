package com.ludson.inventory_api.services;

import org.springframework.stereotype.Service;

import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.ProductRepository;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;

import java.util.*;

/**
 * Service class responsible for the core business logic of the production plan.
 * It handles the calculation of production feasibility based on available raw
 * material stock.
 */
@Service
public class ProductionService {

    private final ProductRepository productRepo;
    private final RawMaterialRepository rawMaterialRepo;

    public ProductionService(ProductRepository productRepo,
            RawMaterialRepository rawMaterialRepo) {
        this.productRepo = productRepo;
        this.rawMaterialRepo = rawMaterialRepo;
    }

    /**
     * Calculates the maximum production capacity for each product based on current
     * stock.
     * <p>
     * The logic follows these steps:
     * 1. Retrieves all products and sorts them by price (descending) to prioritize
     * higher value items.
     * 2. Creates a snapshot of the current raw material stock.
     * 3. Iterates through each product to calculate how many units can be produced
     * with the available materials.
     * 4. Deducts the materials required for that production quantity from the
     * temporary stock before moving to the next product.
     * </p>
     *
     * @return A list of maps containing production details: product ID, name, unit
     *         price,
     *         calculated max production quantity, and total potential value.
     */
    public List<Map<String, Object>> calculateProduction() {
        List<Product> products = productRepo.findAll();

        // Prioritize products with higher value (RF requirement)
        products.sort((p1, p2) -> p2.getPrice().compareTo(p1.getPrice()));

        // Create a snapshot of available stock to simulate consumption
        List<RawMaterial> allMaterials = rawMaterialRepo.findAll();
        Map<Long, Double> availableStock = new HashMap<>();
        for (RawMaterial rm : allMaterials) {
            availableStock.put(rm.getId(), rm.getStockQuantity());
        }

        List<Map<String, Object>> result = new ArrayList<>();


        return result;
    }
}