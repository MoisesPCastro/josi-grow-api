// src/products/dtos/createProduct.dto.ts
export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  status: boolean | string;
}
export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  status: boolean | string;
  imageUrl: string;
  publicId: string;     // identificador para exclusão
}
