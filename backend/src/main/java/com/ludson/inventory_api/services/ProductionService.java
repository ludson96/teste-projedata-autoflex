package com.ludson.inventory_api.services;

import org.springframework.stereotype.Service;

import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.entities.ProductMaterial;
import com.ludson.inventory_api.models.repositories.ProductMaterialRepository;
import com.ludson.inventory_api.models.repositories.ProductRepository;

import java.util.*;

@Service
public class ProductionService {

    private final ProductRepository productRepo;
    private final ProductMaterialRepository pmRepo;

    public ProductionService(ProductRepository productRepo,
                             ProductMaterialRepository pmRepo) {
        this.productRepo = productRepo;
        this.pmRepo = pmRepo;
    }

    public List<Map<String, Object>> calculateProduction() {
        List<Product> products = productRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Product product : products) {
            List<ProductMaterial> materials = pmRepo.findByProductId(product.getId());

            double maxProduction = Double.MAX_VALUE;

            for (ProductMaterial pm : materials) {
                double possible = pm.getMaterial().getStockQuantity() / pm.getQuantityRequired();
                maxProduction = Math.min(maxProduction, possible);
            }

            if (maxProduction == Double.MAX_VALUE) {
                maxProduction = 0;
            }

            int qty = (int) Math.floor(maxProduction);
            double totalValue = qty * product.getPrice().doubleValue();

            Map<String, Object> row = new HashMap<>();
            row.put("productId", product.getId());
            row.put("productName", product.getName());
            row.put("unitPrice", product.getPrice());
            row.put("maxProduction", qty);
            row.put("totalValue", totalValue);

            result.add(row);
        }

        result.sort((a, b) -> Double.compare(
                (double) b.get("totalValue"),
                (double) a.get("totalValue")
        ));

        return result;
    }
}