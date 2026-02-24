package com.ludson.inventory_api.dto;

import java.math.BigDecimal;

public record ProductRequest(
        String name,
        BigDecimal price
) {}