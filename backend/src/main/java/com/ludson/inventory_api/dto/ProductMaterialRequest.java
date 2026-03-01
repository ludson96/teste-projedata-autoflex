package com.ludson.inventory_api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProductMaterialRequest(
        @NotNull Long rawMaterialId,
        @NotNull @Positive Double quantity) {
}