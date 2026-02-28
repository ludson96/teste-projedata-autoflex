package com.ludson.inventory_api.controllers;

import com.ludson.inventory_api.dto.MaterialComponentRequest;
import com.ludson.inventory_api.models.entities.ProductMaterial;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import com.ludson.inventory_api.dto.ProductRequest;
import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.repositories.ProductRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

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
    private final RawMaterialRepository materialRepo;

    public ProductController(ProductRepository repo, RawMaterialRepository materialRepo) {
        this.repo = repo;
        this.materialRepo = materialRepo;
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
     * @param req Request object containing the new product's data (name, price and
     *            materials).
     * @return The created and persisted {@link Product} entity.
     */
    @PostMapping
    @Transactional
    public Product create(@RequestBody @Valid ProductRequest req) {
        Product p = new Product();
        p.setName(req.name());
        p.setPrice(req.price());

        List<ProductMaterial> productMaterials = new ArrayList<>();
        for (MaterialComponentRequest comp : req.materials()) {
            RawMaterial rm = materialRepo.findById(comp.rawMaterialId())
                    .orElseThrow(
                            () -> new NoSuchElementException("RawMaterial not found with id: " + comp.rawMaterialId()));

            double newStock = rm.getStockQuantity() - comp.quantity();
            if (newStock < 0) {
                throw new IllegalStateException(
                        "Not enough stock for raw material: " + rm.getName() + ". Required: " + comp.quantity()
                                + ", Available: " + rm.getStockQuantity());
            }
            rm.setStockQuantity(newStock);

            ProductMaterial pm = new ProductMaterial();
            pm.setProduct(p);
            pm.setMaterial(rm);
            pm.setQuantityRequired(comp.quantity());
            productMaterials.add(pm);
        }
        p.setMaterials(productMaterials);

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
    public Product update(@PathVariable Long id, @RequestBody @Valid ProductRequest req) {
        Product p = repo.findById(id).orElseThrow();
        p.setName(req.name());
        p.setPrice(req.price());

        // Limpa os materiais existentes e adiciona a nova lista.
        // A anotação orphanRemoval=true na entidade Product cuidará da exclusão.
        p.getMaterials().clear();

        List<ProductMaterial> productMaterials = new ArrayList<>();
        for (MaterialComponentRequest comp : req.materials()) {
            RawMaterial rm = materialRepo.findById(comp.rawMaterialId())
                    .orElseThrow(
                            () -> new NoSuchElementException("RawMaterial not found with id: " + comp.rawMaterialId()));

            ProductMaterial pm = new ProductMaterial();
            pm.setProduct(p);
            pm.setMaterial(rm);
            pm.setQuantityRequired(comp.quantity());
            productMaterials.add(pm);
        }
        p.setMaterials(productMaterials);

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