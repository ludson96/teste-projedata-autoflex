package com.ludson.inventory_api.controllers;

import com.ludson.inventory_api.dto.RawMaterialRequest;
import com.ludson.inventory_api.models.entities.RawMaterial;
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
@DisplayName("Raw Material Controller Tests")
class RawMaterialControllerTest {

    @Mock
    private RawMaterialRepository repository;

    @InjectMocks
    private RawMaterialController controller;

    @Test
    @DisplayName("Should return a list of all raw materials")
    void getAll_ShouldReturnListOfMaterials() {
        when(repository.findAll()).thenReturn(List.of(new RawMaterial()));

        List<RawMaterial> result = controller.getAll();

        assertEquals(1, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should create and return a new raw material")
    void create_ShouldReturnSavedMaterial() {
        RawMaterialRequest request = new RawMaterialRequest("Steel", 100.0);
        RawMaterial savedMaterial = new RawMaterial();
        savedMaterial.setId(1L);
        savedMaterial.setName("Steel");
        savedMaterial.setStockQuantity(100.0);

        when(repository.save(any(RawMaterial.class))).thenReturn(savedMaterial);

        RawMaterial result = controller.create(request);

        assertEquals("Steel", result.getName());
        assertEquals(100.0, result.getStockQuantity());
        verify(repository, times(1)).save(any(RawMaterial.class));
    }

    @Test
    @DisplayName("Should update and return the existing raw material")
    void update_ShouldReturnUpdatedMaterial() {
        Long id = 1L;
        RawMaterialRequest request = new RawMaterialRequest("Iron", 50.0);
        RawMaterial existingMaterial = new RawMaterial();
        existingMaterial.setId(id);
        existingMaterial.setName("Steel");

        when(repository.findById(id)).thenReturn(Optional.of(existingMaterial));
        when(repository.save(any(RawMaterial.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RawMaterial result = controller.update(id, request);

        assertEquals("Iron", result.getName());
        assertEquals(50.0, result.getStockQuantity());
        verify(repository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Should delete the raw material by ID")
    void delete_ShouldCallRepositoryDelete() {
        Long id = 1L;
        controller.delete(id);
        verify(repository, times(1)).deleteById(id);
    }
}