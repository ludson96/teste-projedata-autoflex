package com.ludson.inventory_api.controllers;

import com.ludson.inventory_api.services.ProductionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductionControllerTest {

    @Mock
    private ProductionService service;

    @InjectMocks
    private ProductionController controller;

    @Test
    void plan_ShouldReturnServiceResult() {
        List<Map<String, Object>> expectedResult = List.of(Map.of("key", "value"));
        when(service.calculateProduction()).thenReturn(expectedResult);

        List<Map<String, Object>> result = controller.plan();

        assertEquals(expectedResult, result);
        verify(service, times(1)).calculateProduction();
    }
}