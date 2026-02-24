package com.ludson.inventory_api.controllers;

import org.springframework.web.bind.annotation.*;

import com.ludson.inventory_api.services.ProductionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/production-plan")
public class ProductionController {

    private final ProductionService service;

    public ProductionController(ProductionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Map<String, Object>> plan() {
        return service.calculateProduction();
    }
}