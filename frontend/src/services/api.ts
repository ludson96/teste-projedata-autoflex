import axios from "axios";
import type { Product, RawMaterial } from "../types";

const API_URL = "/api";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const createProduct = async (
  product: Omit<Product, "id">,
): Promise<Product> => {
  const response = await axios.post(`${API_URL}/products`, product);
  return response.data;
};

export const updateProduct = async (
  id: number,
  product: Omit<Product, "id">,
): Promise<Product> => {
  const response = await axios.put(`${API_URL}/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/products/${id}`);
};

export const getRawMaterials = async (): Promise<RawMaterial[]> => {
  const response = await axios.get(`${API_URL}/materials`);
  return response.data;
};

export const createRawMaterial = async (
  rawMaterial: Omit<RawMaterial, "id">,
): Promise<RawMaterial> => {
  const response = await axios.post(`${API_URL}/materials`, rawMaterial);
  return response.data;
};

export const updateRawMaterial = async (
  id: number,
  rawMaterial: Omit<RawMaterial, "id">,
): Promise<RawMaterial> => {
  const response = await axios.put(`${API_URL}/materials/${id}`, rawMaterial);
  return response.data;
};

export const deleteRawMaterial = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/materials/${id}`);
};

export const getProductionPlan = async (): Promise<any[]> => {
  const response = await axios.get(`${API_URL}/production-plan`);
  return response.data;
};
