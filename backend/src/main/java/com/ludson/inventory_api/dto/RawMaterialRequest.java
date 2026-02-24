package com.ludson.inventory_api.dto;

public record RawMaterialRequest(
        String name,
        Double stockQuantity
) {}