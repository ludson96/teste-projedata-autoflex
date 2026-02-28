export interface RawMaterial {
    id: number;
    name: string;
    stockQuantity: number;
}

export interface ProductMaterial {
    id: number;
    quantityRequired: number;
    material: RawMaterial;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    materials: ProductMaterial[];
}