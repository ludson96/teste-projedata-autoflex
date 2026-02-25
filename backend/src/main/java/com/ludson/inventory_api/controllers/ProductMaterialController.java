package com.ludson.inventory_api.controllers;

import com.ludson.inventory_api.dto.ProductMaterialRequest;
import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.entities.ProductMaterial;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.ProductMaterialRepository;
import com.ludson.inventory_api.models.repositories.ProductRepository;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing product composition.
 * Allows associating raw materials with products, defining the required
 * quantity for production.
 */
@RestController
@RequestMapping("/product-materials")
public class ProductMaterialController {

    private final ProductMaterialRepository repo;
    private final ProductRepository productRepo;
    private final RawMaterialRepository materialRepo;

    public ProductMaterialController(ProductMaterialRepository repo, ProductRepository productRepo,
            RawMaterialRepository materialRepo) {
        this.repo = repo;
        this.productRepo = productRepo;
        this.materialRepo = materialRepo;
    }

    /**
     * Fetches the list of materials required for a specific product.
     *
     * @param productId The product's identifier.
     * @return A list of {@link ProductMaterial} representing the product's
     *         composition.
     */
    @GetMapping("/{productId}")
    public List<ProductMaterial> getByProduct(@PathVariable Long productId) {
        return repo.findByProductId(productId);
    }

    /**
     * Adds a raw material to a product's composition.
     *
     * @param req Object containing the product and raw material IDs, as well as the
     *            required quantity.
     * @return The created {@link ProductMaterial} relationship.
     * @throws java.util.NoSuchElementException If the product or raw material is
     *                                          not found.
     */
    @PostMapping
    public ProductMaterial addMaterialToProduct(@RequestBody ProductMaterialRequest req) {
        Product product = productRepo.findById(req.productId()).orElseThrow();
        RawMaterial material = materialRepo.findById(req.rawMaterialId()).orElseThrow();

        ProductMaterial pm = new ProductMaterial();
        pm.setProduct(product);
        pm.setMaterial(material);
        pm.setQuantityRequired(req.quantityRequired());

        return repo.save(pm);
    }

    /**
     * Updates the required quantity of a raw material in a product's composition.
     *
     * @param id  The identifier of the relationship (ProductMaterial) to be
     *            updated.
     * @param req Object containing the new required quantity.
     * @return The updated {@link ProductMaterial} relationship.
     * @throws java.util.NoSuchElementException If the relationship is not found.
     */
    @PutMapping("/{id}")
    public ProductMaterial updateMaterial(@PathVariable Long id, @RequestBody ProductMaterialRequest req) {
        ProductMaterial pm = repo.findById(id).orElseThrow();
        pm.setQuantityRequired(req.quantityRequired());
        return repo.save(pm);
    }

    /**
     * Removes a raw material from a product's composition.
     *
     * @param id The identifier of the relationship (ProductMaterial) to be removed.
     */
    @DeleteMapping("/{id}")
    public void removeMaterial(@PathVariable Long id) {
        repo.deleteById(id);
    }
}