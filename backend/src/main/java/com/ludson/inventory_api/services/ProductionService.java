package com.ludson.inventory_api.services;

import org.springframework.stereotype.Service;

import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.entities.ProductMaterial;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.ProductMaterialRepository;
import com.ludson.inventory_api.models.repositories.ProductRepository;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;

import java.util.*;

@Service
public class ProductionService {

    private final ProductRepository productRepo;
    private final ProductMaterialRepository pmRepo;
    private final RawMaterialRepository rawMaterialRepo;

    public ProductionService(ProductRepository productRepo,
            ProductMaterialRepository pmRepo,
            RawMaterialRepository rawMaterialRepo) {
        this.productRepo = productRepo;
        this.pmRepo = pmRepo;
        this.rawMaterialRepo = rawMaterialRepo;
    }

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

        for (Product product : products) {
            List<ProductMaterial> materials = pmRepo.findByProductId(product.getId());

            if (materials.isEmpty()) {
                continue; // Cannot produce without recipe
            }

            double maxProduction = Double.MAX_VALUE;

            for (ProductMaterial pm : materials) {
                Double currentStock = availableStock.getOrDefault(pm.getMaterial().getId(), 0.0);
                double possible = currentStock / pm.getQuantityRequired();
                maxProduction = Math.min(maxProduction, possible);
            }

            if (maxProduction == Double.MAX_VALUE) {
                maxProduction = 0;
            }

            int qty = (int) Math.floor(maxProduction);
            double totalValue = qty * product.getPrice().doubleValue();

            // Deduct the used materials from the temporary stock map
            if (qty > 0) {
                for (ProductMaterial pm : materials) {
                    double used = qty * pm.getQuantityRequired();
                    Long matId = pm.getMaterial().getId();
                    availableStock.put(matId, availableStock.get(matId) - used);
                }
            }

            Map<String, Object> row = new HashMap<>();
            row.put("productId", product.getId());
            row.put("productName", product.getName());
            row.put("unitPrice", product.getPrice());
            row.put("maxProduction", qty);
            row.put("totalValue", totalValue);

            result.add(row);
        }

        return result;
    }
}