export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface RawMaterial {
  id: number;
  name: string;
  stockQuantity: number;
}

export interface ProductMaterial {
  id: number;
  productId: number;
  rawMaterialId: number;
  quantityRequired: number;
}
