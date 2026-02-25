package com.ludson.inventory_api.controllers;

import com.ludson.inventory_api.dto.ProductRequest;
import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.repositories.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductRepository repository;

    @InjectMocks
    private ProductController controller;

    @Test
    void getAll_ShouldReturnListOfProducts() {
        when(repository.findAll()).thenReturn(List.of(new Product(), new Product()));

        List<Product> result = controller.getAll();

        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void create_ShouldReturnSavedProduct() {
        ProductRequest request = new ProductRequest("Test Product", BigDecimal.TEN);
        Product savedProduct = new Product();
        savedProduct.setId(1L);
        savedProduct.setName("Test Product");
        savedProduct.setPrice(BigDecimal.TEN);

        when(repository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = controller.create(request);

        assertEquals(1L, result.getId());
        assertEquals("Test Product", result.getName());
        verify(repository, times(1)).save(any(Product.class));
    }

    @Test
    void update_ShouldReturnUpdatedProduct() {
        Long id = 1L;
        ProductRequest request = new ProductRequest("Updated Name", BigDecimal.ONE);
        Product existingProduct = new Product();
        existingProduct.setId(id);
        existingProduct.setName("Old Name");

        when(repository.findById(id)).thenReturn(Optional.of(existingProduct));
        when(repository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product result = controller.update(id, request);

        assertEquals("Updated Name", result.getName());
        assertEquals(BigDecimal.ONE, result.getPrice());
        verify(repository, times(1)).findById(id);
        verify(repository, times(1)).save(existingProduct);
    }

    @Test
    void delete_ShouldCallRepositoryDelete() {
        Long id = 1L;

        controller.delete(id);

        verify(repository, times(1)).deleteById(id);
    }
}