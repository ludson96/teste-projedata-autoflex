package com.ludson.inventory_api.controllers;

import org.springframework.web.bind.annotation.*;

import com.ludson.inventory_api.dto.RawMaterialRequest;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;

import java.util.List;

/**
 * REST controller responsible for managing Raw Materials.
 * Provides endpoints to create, read, update, and delete raw materials in the
 * inventory.
 */
@RestController
@RequestMapping("/materials")
@CrossOrigin(origins = "*")
public class RawMaterialController {

    private final RawMaterialRepository repo;

    public RawMaterialController(RawMaterialRepository repo) {
        this.repo = repo;
    }

    /**
     * Retrieves all registered raw materials.
     *
     * @return A list containing all available raw materials.
     */
    @GetMapping
    public List<RawMaterial> getAll() {
        return repo.findAll();
    }

    /**
     * Creates a new raw material.
     *
     * @param req Request object containing the new raw material's data (name
     *            and stock quantity).
     * @return The created and persisted {@link RawMaterial} entity.
     */
    @PostMapping
    public RawMaterial create(@RequestBody RawMaterialRequest req) {
        RawMaterial m = new RawMaterial();
        m.setName(req.name());
        m.setStockQuantity(req.stockQuantity());
        return repo.save(m);
    }

    /**
     * Updates an existing raw material's data.
     *
     * @param id  The unique identifier of the raw material to be updated.
     * @param req Object containing the new data for the update.
     * @return The updated {@link RawMaterial} entity.
     * @throws java.util.NoSuchElementException If the raw material with the given
     *                                          ID is not found.
     */
    @PutMapping("/{id}")
    public RawMaterial update(@PathVariable Long id, @RequestBody RawMaterialRequest req) {
        RawMaterial m = repo.findById(id).orElseThrow();
        m.setName(req.name());
        m.setStockQuantity(req.stockQuantity());
        return repo.save(m);
    }

    /**
     * Removes a raw material from the system.
     *
     * @param id The unique identifier of the raw material to be removed.
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}