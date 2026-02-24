package com.ludson.inventory_api.controllers;

import org.springframework.web.bind.annotation.*;

import com.ludson.inventory_api.dto.RawMaterialRequest;
import com.ludson.inventory_api.models.entities.RawMaterial;
import com.ludson.inventory_api.models.repositories.RawMaterialRepository;

import java.util.List;

@RestController
@RequestMapping("/materials")
public class RawMaterialController {

    private final RawMaterialRepository repo;

    public RawMaterialController(RawMaterialRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<RawMaterial> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public RawMaterial create(@RequestBody RawMaterialRequest req) {
        RawMaterial m = new RawMaterial();
        m.setName(req.name());
        m.setStockQuantity(req.stockQuantity());
        return repo.save(m);
    }

    @PutMapping("/{id}")
    public RawMaterial update(@PathVariable Long id, @RequestBody RawMaterialRequest req) {
        RawMaterial m = repo.findById(id).orElseThrow();
        m.setName(req.name());
        m.setStockQuantity(req.stockQuantity());
        return repo.save(m);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}