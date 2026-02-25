package com.ludson.inventory_api.dto;

public record ProductMaterialRequest(Long productId, Long rawMaterialId, Double quantityRequired) {
}