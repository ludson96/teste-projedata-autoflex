package com.ludson.inventory_api.dto;

/**
 * DTO representing the request to associate a Raw Material with a Product.
 *
 * @param productId        The unique identifier of the product.
 * @param rawMaterialId    The unique identifier of the raw material.
 * @param quantityRequired The amount of raw material required to produce one unit of the product.
 */
public record ProductMaterialRequest(Long productId, Long rawMaterialId, Double quantityRequired) {
}