package com.ludson.inventory_api.models.entities;

import jakarta.persistence.*;

/**
 * Entity representing the association between a Product and a Raw Material.
 * This class functions as a join entity with an additional column for quantity,
 * defining the "recipe" or composition of a product.
 * Maps to the "product_materials" table.
 */
@Entity
@Table(name = "product_materials")
public class ProductMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Product product;

    @ManyToOne(optional = false)
    private RawMaterial material;

    @Column(nullable = false)
    private Double quantityRequired;

    public ProductMaterial() {}

    public ProductMaterial(Product product, RawMaterial material, Double quantityRequired) {
        this.product = product;
        this.material = material;
        this.quantityRequired = quantityRequired;
    }

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public RawMaterial getMaterial() { return material; }
    public Double getQuantityRequired() { return quantityRequired; }

    public void setId(Long id) { this.id = id; }
    public void setProduct(Product product) { this.product = product; }
    public void setMaterial(RawMaterial material) { this.material = material; }
    public void setQuantityRequired(Double quantityRequired) { this.quantityRequired = quantityRequired; }
}