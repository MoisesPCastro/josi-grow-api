// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { IProduct } from './interfaces';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
    private readonly filePath = join(process.cwd(), 'storage', 'data.json');

    private readProducts(): IProduct[] {
        const data = readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data) as IProduct[];
    }

    private saveProducts(list: IProduct[]) {
        writeFileSync(this.filePath, JSON.stringify(list, null, 2), 'utf-8');
    }

    async create(payload: Omit<IProduct, 'id'>): Promise<IProduct> {
        const products = this.readProducts();
        const newProduct: IProduct = {
            id: products.length + 1,
            ...payload,
        };
        products.push(newProduct);
        this.saveProducts(products);
        return newProduct;
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

        return products
    }

    findOne(id: number): IProduct {
        const product = this.readProducts().find(p => p.id === id);
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    update(id: number, dto: Partial<Omit<IProduct, 'id' | 'publicId' | 'imageUrl'>>): IProduct {
        const products = this.readProducts();
        const idx = products.findIndex(p => p.id === id);
        if (idx === -1) throw new NotFoundException('Product not found');
        products[idx] = { ...products[idx], ...dto };
        this.saveProducts(products);
        return products[idx];
    }

    remove(id: number): void {
        const products = this.readProducts();
        const filtered = products.filter(p => p.id !== id);
        this.saveProducts(filtered);
    }
}
