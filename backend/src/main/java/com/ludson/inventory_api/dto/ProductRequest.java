package com.ludson.inventory_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
                @NotBlank String name,
                @NotNull @Positive BigDecimal price,
                List<ProductMaterialRequest> materials) {
}