package com.ludson.inventory_api.dto;

/**
 * DTO representing the request to create or update a Raw Material.
 *
 * @param name          The name of the raw material.
 * @param stockQuantity The current quantity available in stock.
 */
public record RawMaterialRequest(
                String name,
                Double stockQuantity) {
}