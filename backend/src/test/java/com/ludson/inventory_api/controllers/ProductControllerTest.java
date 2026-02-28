package com.ludson.inventory_api.controllers;

import com.ludson.inventory_api.dto.MaterialComponentRequest;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import org.mockito.ArgumentCaptor;

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
        when(repository.findAll()).thenReturn(List.of(new Product(), new Product()));

        List<Product> result = controller.getAll();

        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should create product, update stock, and return the new product")
    void create_ShouldReturnSavedProduct() {
        // Arrange
        MaterialComponentRequest materialRequest = new MaterialComponentRequest(1L, 10.0);
        ProductRequest request = new ProductRequest("Test Product", BigDecimal.TEN, List.of(materialRequest));

        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.setId(1L);
        rawMaterial.setName("Steel");
        rawMaterial.setStockQuantity(100.0);

        Product savedProduct = new Product();
        savedProduct.setId(1L);
        savedProduct.setName("Test Product");
        savedProduct.setPrice(BigDecimal.TEN);

        when(materialRepo.findById(1L)).thenReturn(Optional.of(rawMaterial));
        when(repository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Product result = controller.create(request);

        // Assert
        assertEquals("Test Product", result.getName());
        assertEquals(90.0, rawMaterial.getStockQuantity());

        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        verify(repository, times(1)).save(productCaptor.capture());
        Product capturedProduct = productCaptor.getValue();

        assertEquals(1, capturedProduct.getMaterials().size());
        assertEquals(90.0, capturedProduct.getMaterials().get(0).getMaterial().getStockQuantity());
        verify(materialRepo, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when creating a product with insufficient raw material stock")
    void create_WhenInsufficientStock_ShouldThrowException() {
        // Arrange
        MaterialComponentRequest materialRequest = new MaterialComponentRequest(1L, 10.0);
        ProductRequest request = new ProductRequest("Test Product", BigDecimal.TEN, List.of(materialRequest));

        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.setId(1L);
        rawMaterial.setName("Steel");
        rawMaterial.setStockQuantity(5.0); // Insufficient stock

        when(materialRepo.findById(1L)).thenReturn(Optional.of(rawMaterial));

        // Act & Assert
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> controller.create(request));

        assertTrue(exception.getMessage().contains("Not enough stock for raw material: Steel"));
        verify(repository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("Should update and return the existing product with new materials")
    void update_ShouldReturnUpdatedProduct() {
        Long id = 1L;
        MaterialComponentRequest materialRequest = new MaterialComponentRequest(2L, 5.0);
        ProductRequest request = new ProductRequest("Updated Name", BigDecimal.ONE, List.of(materialRequest));

        Product existingProduct = new Product();
        existingProduct.setId(id);
        existingProduct.setName("Old Name");
        existingProduct.setMaterials(Collections.emptyList()); // Start with no materials

        RawMaterial newRawMaterial = new RawMaterial();
        newRawMaterial.setId(2L);
        newRawMaterial.setName("Iron");

        when(repository.findById(id)).thenReturn(Optional.of(existingProduct));
        when(materialRepo.findById(2L)).thenReturn(Optional.of(newRawMaterial));
        when(repository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product result = controller.update(id, request);

        assertEquals("Updated Name", result.getName());
        assertEquals(BigDecimal.ONE, result.getPrice());
        assertEquals(1, result.getMaterials().size());
        assertEquals("Iron", result.getMaterials().get(0).getMaterial().getName());
        verify(repository, times(1)).findById(id);
        verify(repository, times(1)).save(existingProduct);
    }

    @Test
    @DisplayName("Should delete the product by ID")
    void delete_ShouldCallRepositoryDelete() {
        Long id = 1L;

        controller.delete(id);

        verify(repository, times(1)).deleteById(id);
    }
}