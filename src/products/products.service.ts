import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { IProduct } from './interfaces';
import * as fs from 'fs';

@Injectable()
export class ProductsService {

    private readonly filePath = join(process.cwd(), 'storage', 'data.json');

    constructor() {
        const dir = join(process.cwd(), 'storage');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (!fs.existsSync(this.filePath)) {
            writeFileSync(this.filePath, '[]', 'utf-8');
        }
    }

    private readProducts(): IProduct[] {
        const data = readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    private createProducts(products: IProduct[]): void {
        writeFileSync(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
    }

    private verifyExistProductId(id: number): IProduct {
        const products = this.readProducts();
        const productId = products.find((product) => product.id === id);
        if (!productId) throw new NotFoundException('IProduct not found');
        return productId;
    }

    create(product: IProduct): void {
        const products = this.readProducts();
        product.id = products.length + 1;
        products.push(product);
        this.createProducts(products);
    }

    findAll(status?: string): IProduct[] {
        let products = this.readProducts();

        if (status !== undefined) {
            const normalized = status.toLowerCase();
            const isValid = normalized === 'true' || normalized === 'false';
            if (isValid) {
                const desired = normalized === 'true';
                products = products.filter((p) => p.status === desired);
            }
        }

        return products.map((product) => ({
            ...product,
            image: `${process.env.URL_BASE}/uploads/${product.image}`,
        }));
    }



    findOne(id: number): IProduct {
        const product = this.verifyExistProductId(id);

        return {
            ...product,
            image: `${process.env.URL_BASE}/uploads/${product.image}`,
        };
    }


    update(id: number, updatedProduct: Partial<IProduct>): void {
        const products = this.readProducts();
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) throw new NotFoundException('IProduct not found');

        products[index] = { ...products[index], ...updatedProduct };
        this.createProducts(products);;
    }

    delete(id: number): void {
        const product = this.verifyExistProductId(id);

        const imagePath = join(process.cwd(), 'public', 'uploads', product.image);

        if (
            product.image &&               // Verifica se há nome de imagem
            fs.existsSync(imagePath) &&
            fs.statSync(imagePath).isFile()  // Verifica se é realmente um arquivo
        ) {
            fs.unlinkSync(imagePath);
        }

        // Remove o produto da lista
        let products = this.readProducts();
        products = products.filter((p) => p.id !== id);
        this.createProducts(products);
    }

}
