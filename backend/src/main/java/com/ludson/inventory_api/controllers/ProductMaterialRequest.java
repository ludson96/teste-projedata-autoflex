package com.ludson.inventory_api.controllers;

public record ProductMaterialRequest(Long productId, Long rawMaterialId, Double quantityRequired) {
}