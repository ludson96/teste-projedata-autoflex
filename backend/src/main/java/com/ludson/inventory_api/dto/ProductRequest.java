package com.ludson.inventory_api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank(message = "Product name cannot be blank") String name,
        @NotNull(message = "Product price cannot be null") @Positive(message = "Product price must be positive") BigDecimal price,
        @NotEmpty(message = "Product must have at least one raw material") @Valid List<MaterialComponentRequest> materials) {
}