// src/products/dtos/createProduct.dto.ts
export class ICreateProductDto {
  name: string;
  description: string;
  price: number;
  status: boolean | string
  emphasis?: boolean | string;
}
export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  status: boolean | string;
  imageUrl: string;
  publicId: string;     // identificador para exclusão
  emphasis: boolean | string;
}

export interface IProductsFile {
  products: IProduct[];
  orderBy: number[];
}
