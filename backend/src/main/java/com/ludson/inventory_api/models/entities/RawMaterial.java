package com.ludson.inventory_api.models.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "raw_materials")
public class RawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double stockQuantity;

    public RawMaterial() {}

    public RawMaterial(Long id, String name, Double stockQuantity) {
        this.id = id;
        this.name = name;
        this.stockQuantity = stockQuantity;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getStockQuantity() { return stockQuantity; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setStockQuantity(Double stockQuantity) { this.stockQuantity = stockQuantity; }
}