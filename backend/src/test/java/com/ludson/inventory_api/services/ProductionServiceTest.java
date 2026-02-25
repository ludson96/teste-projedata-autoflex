package com.ludson.inventory_api.services;

import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.entities.ProductMaterial;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.ProductMaterialRepository;
import com.ludson.inventory_api.models.repositories.ProductRepository;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Production Service Tests")
class ProductionServiceTest {

    @Mock
    private ProductRepository productRepo;
    @Mock
    private ProductMaterialRepository pmRepo;
    @Mock
    private RawMaterialRepository rawMaterialRepo;

    @InjectMocks
    private ProductionService service;

    @Test
    @DisplayName("Should prioritize high value products and deduct stock correctly")
    void calculateProduction_ShouldPrioritizeHighValueProductsAndDeductStock() {
        Product productA = new Product();
        productA.setId(1L);
        productA.setName("Product A");
        productA.setPrice(new BigDecimal("100.00"));

        Product productB = new Product();
        productB.setId(2L);
        productB.setName("Product B");
        productB.setPrice(new BigDecimal("50.00"));

        List<Product> products = new ArrayList<>(List.of(productB, productA));

        RawMaterial materialM = new RawMaterial();
        materialM.setId(1L);
        materialM.setName("Material M");
        materialM.setStockQuantity(100.0);

        ProductMaterial pmA = new ProductMaterial();
        pmA.setProduct(productA);
        pmA.setMaterial(materialM);
        pmA.setQuantityRequired(10.0);

        ProductMaterial pmB = new ProductMaterial();
        pmB.setProduct(productB);
        pmB.setMaterial(materialM);
        pmB.setQuantityRequired(5.0);

        // Mock Repositories
        when(productRepo.findAll()).thenReturn(products);
        when(rawMaterialRepo.findAll()).thenReturn(List.of(materialM));
        when(pmRepo.findByProductId(productA.getId())).thenReturn(List.of(pmA));
        when(pmRepo.findByProductId(productB.getId())).thenReturn(List.of(pmB));

        // Execute
        List<Map<String, Object>> result = service.calculateProduction();

        // Verify
        // Result should contain 2 entries
        assertEquals(2, result.size());

        // Find result for Product A
        Map<String, Object> resultA = result.stream()
                .filter(m -> m.get("productId").equals(1L))
                .findFirst().orElseThrow();

        // Find result for Product B
        Map<String, Object> resultB = result.stream()
                .filter(m -> m.get("productId").equals(2L))
                .findFirst().orElseThrow();

        // Assertions
        assertEquals(10, resultA.get("maxProduction")); // 100 stock / 10 req
        assertEquals(1000.0, resultA.get("totalValue")); // 10 qty * 100 price

        assertEquals(0, resultB.get("maxProduction")); // 0 stock remaining
        assertEquals(0.0, resultB.get("totalValue"));
    }
}