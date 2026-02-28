package com.ludson.inventory_api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MaterialComponentRequest(
        @NotNull Long rawMaterialId,
        @NotNull @Positive(message = "Quantity must be positive") Double quantity) {
}