package com.ludson.inventory_api.dto;

import java.math.BigDecimal;

/**
 * DTO representing the request to create or update a Product.
 *
 * @param name  The name of the product.
 * @param price The unit price of the product.
 */
public record ProductRequest(
                String name,
                BigDecimal price) {
}