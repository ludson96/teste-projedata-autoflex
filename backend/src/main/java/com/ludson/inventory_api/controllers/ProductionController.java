package com.ludson.inventory_api.controllers;

import org.springframework.web.bind.annotation.*;

import com.ludson.inventory_api.services.ProductionService;

import java.util.List;
import java.util.Map;

/**
 * REST controller responsible for the Production Plan.
 * Manages operations related to calculating production feasibility based on
 * inventory.
 */
@RestController
@RequestMapping("/production-plan")
public class ProductionController {

    private final ProductionService service;

    public ProductionController(ProductionService service) {
        this.service = service;
    }

    /**
     * Calculates and returns the production plan.
     * This endpoint analyzes the current inventory and determines the quantity of
     * products that can be manufactured.
     *
     * @return A list of maps containing the details of the calculated production
     *         plan.
     */
    @GetMapping
    public List<Map<String, Object>> plan() {
        return service.calculateProduction();
    }
}