// src/products/dtos/createProduct.dto.ts
export class ICreateProductDto {
  name: string;
  description: string;
  message: string;
  price: number;
  status: boolean | string
  emphasis?: boolean | string;
  marca: string;
}
export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  status: boolean | string;
  message: string;
  imageUrl: string;
  publicId: string;     // identificador para exclusão
  emphasis: boolean | string;
}

export interface IProductsFile {
  products: IProduct[];
  orderBy: string[];
}