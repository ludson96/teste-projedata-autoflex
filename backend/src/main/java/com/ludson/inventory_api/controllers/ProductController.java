package com.ludson.inventory_api.controllers;

import org.springframework.web.bind.annotation.*;

import com.ludson.inventory_api.dto.ProductRequest;
import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.repositories.ProductRepository;

import java.util.List;

/**
 * REST controller responsible for managing Final Products.
 * Provides endpoints to create, read, update, and delete products to be
 * manufactured.
 */
@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    /**
     * Retrieves all products registered in the system.
     *
     * @return A list containing all products.
     */
    @GetMapping
    public List<Product> getAll() {
        return repo.findAll();
    }

    /**
     * Creates a new product.
     *
     * @param req Request object containing the new product's data (name and price).
     * @return The created and persisted {@link Product} entity.
     */
    @PostMapping
    public Product create(@RequestBody ProductRequest req) {
        Product p = new Product();
        p.setName(req.name());
        p.setPrice(req.price());
        return repo.save(p);
    }

    /**
     * Updates an existing product's data.
     *
     * @param id  The unique identifier of the product to be updated.
     * @param req Object containing the new product data.
     * @return The updated {@link Product} entity.
     * @throws java.util.NoSuchElementException If the product with the given ID is
     *                                          not found.
     */
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody ProductRequest req) {
        Product p = repo.findById(id).orElseThrow();
        p.setName(req.name());
        p.setPrice(req.price());
        return repo.save(p);
    }

    /**
     * Removes a product from the system.
     *
     * @param id The unique identifier of the product to be removed.
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}