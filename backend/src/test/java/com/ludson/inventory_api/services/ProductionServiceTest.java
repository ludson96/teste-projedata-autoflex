package com.ludson.inventory_api.services;

import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.repositories.ProductRepository;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductionServiceTest {

    @Mock
    private ProductRepository productRepo;

    @Mock
    private RawMaterialRepository rawMaterialRepo;

    @InjectMocks
    private ProductionService productionService;

    private Product productLowValue;
    private Product productHighValue;

    @BeforeEach
    void setUp() {
        productLowValue = new Product();
        productLowValue.setId(1L);
        productLowValue.setName("Cheap Product");
        productLowValue.setPrice(new BigDecimal("50.00"));

        productHighValue = new Product();
        productHighValue.setId(2L);
        productHighValue.setName("Expensive Product");
        productHighValue.setPrice(new BigDecimal("100.00"));
    }

    @Test
    void calculateProduction_ShouldReturnProductsSortedByPriceDescending() {
        // Arrange
        // Returns unordered to ensure the service performs sorting
        when(productRepo.findAll()).thenReturn(new ArrayList<>(Arrays.asList(productLowValue, productHighValue)));
        when(rawMaterialRepo.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<Map<String, Object>> result = productionService.calculateProduction();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());

        // Verify if the first item is the highest value product (100.00)
        Map<String, Object> firstItem = result.get(0);
        assertEquals(productHighValue.getId(), firstItem.get("id"));
        assertEquals(productHighValue.getName(), firstItem.get("name"));
        assertEquals(productHighValue.getPrice(), firstItem.get("price"));

        // Verify if the second item is the lowest value product (50.00)
        Map<String, Object> secondItem = result.get(1);
        assertEquals(productLowValue.getId(), secondItem.get("id"));
        assertEquals(productLowValue.getName(), secondItem.get("name"));
        assertEquals(productLowValue.getPrice(), secondItem.get("price"));

        verify(productRepo, times(1)).findAll();
    }
}
