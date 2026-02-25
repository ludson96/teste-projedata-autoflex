package com.ludson.inventory_api.models.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

/**
 * Entity representing a final product that can be manufactured.
 * Maps to the "products" table in the database.
 */
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    /**
     * The list of raw materials and their quantities required to produce this
     * product.
     * This defines the product's "recipe".
     */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductMaterial> materials;

    public Product() {
    }

    public Product(Long id, String name, BigDecimal price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public List<ProductMaterial> getMaterials() {
        return materials;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setMaterials(List<ProductMaterial> materials) {
        this.materials = materials;
    }
}