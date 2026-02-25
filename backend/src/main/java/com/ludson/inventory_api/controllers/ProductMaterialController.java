package com.ludson.inventory_api.controllers;

import com.ludson.inventory_api.models.entities.Product;
import com.ludson.inventory_api.models.entities.ProductMaterial;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.ProductMaterialRepository;
import com.ludson.inventory_api.models.repositories.ProductRepository;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{productId}")
    public List<ProductMaterial> getByProduct(@PathVariable Long productId) {
        return repo.findByProductId(productId);
    }

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

    @DeleteMapping("/{id}")
    public void removeMaterial(@PathVariable Long id) {
        repo.deleteById(id);
    }
}