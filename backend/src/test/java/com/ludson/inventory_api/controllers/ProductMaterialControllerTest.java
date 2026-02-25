package com.ludson.inventory_api.controllers;

import com.ludson.inventory_api.dto.ProductMaterialRequest;
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

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Product Material Association Controller Tests")
class ProductMaterialControllerTest {

    @Mock
    private ProductMaterialRepository repo;
    @Mock
    private ProductRepository productRepo;
    @Mock
    private RawMaterialRepository materialRepo;

    @InjectMocks
    private ProductMaterialController controller;

    @Test
    @DisplayName("Should return materials associated with a product")
    void getByProduct_ShouldReturnMaterialsForProduct() {
        Long productId = 1L;
        when(repo.findByProductId(productId)).thenReturn(List.of(new ProductMaterial()));

        List<ProductMaterial> result = controller.getByProduct(productId);

        assertEquals(1, result.size());
        verify(repo, times(1)).findByProductId(productId);
    }

    @Test
    @DisplayName("Should create a new association between product and material")
    void addMaterialToProduct_ShouldCreateAssociation() {
        ProductMaterialRequest request = new ProductMaterialRequest(1L, 2L, 5.0);
        Product product = new Product();
        product.setId(1L);
        RawMaterial material = new RawMaterial();
        material.setId(2L);

        when(productRepo.findById(1L)).thenReturn(Optional.of(product));
        when(materialRepo.findById(2L)).thenReturn(Optional.of(material));
        when(repo.save(any(ProductMaterial.class))).thenAnswer(invocation -> {
            ProductMaterial pm = invocation.getArgument(0);
            pm.setId(10L);
            return pm;
        });

        ProductMaterial result = controller.addMaterialToProduct(request);

        assertEquals(10L, result.getId());
        assertEquals(product, result.getProduct());
        assertEquals(material, result.getMaterial());
        assertEquals(5.0, result.getQuantityRequired());
    }

    @Test
    @DisplayName("Should update the quantity required for an association")
    void updateMaterial_ShouldUpdateQuantity() {
        Long id = 1L;
        ProductMaterialRequest request = new ProductMaterialRequest(null, null, 10.0);
        ProductMaterial existingPm = new ProductMaterial();
        existingPm.setId(id);
        existingPm.setQuantityRequired(5.0);

        when(repo.findById(id)).thenReturn(Optional.of(existingPm));
        when(repo.save(any(ProductMaterial.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductMaterial result = controller.updateMaterial(id, request);

        assertEquals(10.0, result.getQuantityRequired());
        verify(repo, times(1)).findById(id);
    }

    @Test
    @DisplayName("Should delete the association")
    void removeMaterial_ShouldDeleteAssociation() {
        Long id = 1L;
        controller.removeMaterial(id);
        verify(repo, times(1)).deleteById(id);
    }
}