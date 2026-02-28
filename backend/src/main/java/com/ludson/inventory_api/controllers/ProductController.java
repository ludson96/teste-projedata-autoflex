package com.ludson.inventory_api.controllers;

import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import com.ludson.inventory_api.dto.ProductRequest;
import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.ProductRepository;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    private final RawMaterialRepository rawMaterialRepo;

    public ProductController(ProductRepository repo, RawMaterialRepository rawMaterialRepo) {
        this.repo = repo;
        this.rawMaterialRepo = rawMaterialRepo;
    }

    /**
     * Retrieves all products registered in the system.
     *
     * @return A list containing all products.
     */
    @GetMapping
    public List<Map<String, Object>> getAll() {
        return repo.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new product.
     *
     * @param req Request object containing the new product's data (name, price and
     *            materials).
     * @return The created and persisted {@link Product} entity.
     */
    @PostMapping
    @Transactional
    public Map<String, Object> create(@RequestBody @Valid ProductRequest req) {
        Product p = new Product();
        p.setName(req.name());
        p.setPrice(req.price());

        if (req.materials() != null) {
            for (var mat : req.materials()) {
                RawMaterial rm = rawMaterialRepo.findById(mat.rawMaterialId()).orElseThrow();

                if (rm.getStockQuantity() < mat.quantity()) {
                    throw new RuntimeException("Estoque insuficiente para a matéria-prima: " + rm.getName());
                }

                rm.setStockQuantity(rm.getStockQuantity() - mat.quantity());
                rawMaterialRepo.save(rm);
            }
        }

        return convertToDto(repo.save(p));
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
    public Map<String, Object> update(@PathVariable Long id, @RequestBody @Valid ProductRequest req) {
        Product p = repo.findById(id).orElseThrow();
        p.setName(req.name());
        p.setPrice(req.price());

        // Limpa os materiais existentes e adiciona a nova lista.
        // A anotação orphanRemoval=true na entidade Product cuidará da exclusão.

        return convertToDto(repo.save(p));
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

    private Map<String, Object> convertToDto(Product product) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", product.getId());
        dto.put("name", product.getName());
        dto.put("price", product.getPrice());

        return dto;
    }
}