package com.ludson.inventory_api.controllers;

import com.ludson.inventory_api.dto.ProductMaterialRequest;
import com.ludson.inventory_api.dto.ProductRequest;
import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.ProductRepository;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Product Controller Tests")
class ProductControllerTest {

    @Mock
    private ProductRepository repository;

    @Mock
    private RawMaterialRepository materialRepo;

    @InjectMocks
    private ProductController controller;

    @Test
    @DisplayName("Should return a list of all products")
    void getAll_ShouldReturnListOfProducts() {
        // Arrange
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(BigDecimal.TEN);

        when(repository.findAll()).thenReturn(List.of(product));

        // Act
        List<Map<String, Object>> result = controller.getAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).get("name"));
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should create and return a new product")
    void create_ShouldReturnSavedProduct() {
        // Arrange
        ProductMaterialRequest materialReq = new ProductMaterialRequest(1L, 10.0);
        ProductRequest request = new ProductRequest("Test Product", BigDecimal.TEN, List.of(materialReq));
        
        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.setId(1L);
        rawMaterial.setName("Iron");
        rawMaterial.setStockQuantity(100.0);

        Product savedProduct = new Product();
        savedProduct.setId(1L);
        savedProduct.setName("Test Product");
        savedProduct.setPrice(BigDecimal.TEN);

        when(materialRepo.findById(1L)).thenReturn(Optional.of(rawMaterial));
        // Mock saving the raw material to return itself (simulating DB update)
        when(materialRepo.save(any(RawMaterial.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(repository.save(any(Product.class))).thenReturn(savedProduct);

        // Act
        Map<String, Object> result = controller.create(request);

        // Assert
        assertNotNull(result);
        assertEquals("Test Product", result.get("name"));
        assertEquals(BigDecimal.TEN, result.get("price"));
        
        // Verify stock update: 100 - 10 = 90
        assertEquals(90.0, rawMaterial.getStockQuantity());
        verify(materialRepo, times(1)).save(rawMaterial);
        verify(repository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Should throw exception when creating product with insufficient stock")
    void create_ShouldThrowException_WhenStockIsInsufficient() {
        // Arrange
        // Requesting 150, but stock is only 100
        ProductMaterialRequest materialReq = new ProductMaterialRequest(1L, 150.0);
        ProductRequest request = new ProductRequest("Test Product", BigDecimal.TEN, List.of(materialReq));
        
        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.setId(1L);
        rawMaterial.setName("Iron");
        rawMaterial.setStockQuantity(100.0);

        when(materialRepo.findById(1L)).thenReturn(Optional.of(rawMaterial));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            controller.create(request);
        });

        // The message is hardcoded in Portuguese in the controller, so we assert it as is
        assertEquals("Estoque insuficiente para a matéria-prima: Iron", exception.getMessage());
        verify(repository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("Should update and return the existing product")
    void update_ShouldReturnUpdatedProduct() {
        // Arrange
        Long id = 1L;
        ProductRequest request = new ProductRequest("Updated Product", BigDecimal.ONE, Collections.emptyList());
        
        Product existingProduct = new Product();
        existingProduct.setId(id);
        existingProduct.setName("Old Product");
        existingProduct.setPrice(BigDecimal.TEN);

        when(repository.findById(id)).thenReturn(Optional.of(existingProduct));
        when(repository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Map<String, Object> result = controller.update(id, request);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Product", result.get("name"));
        assertEquals(BigDecimal.ONE, result.get("price"));
        verify(repository, times(1)).findById(id);
        verify(repository, times(1)).save(existingProduct);
    }

    @Test
    @DisplayName("Should delete the product by ID")
    void delete_ShouldCallRepositoryDelete() {
        // Arrange
        Long id = 1L;

        // Act
        controller.delete(id);

        // Assert
        verify(repository, times(1)).deleteById(id);
    }
}
