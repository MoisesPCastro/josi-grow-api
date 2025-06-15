// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { IProduct, IProductsFile } from './interfaces';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';


@Injectable()
export class ProductsService {
    private readonly filePath = join(process.cwd(), 'storage', 'data.json');

    private readData(): IProductsFile {
        const raw = readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw) as IProductsFile;
    }

    private saveData(data: IProductsFile): void {
        writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    // produtos
    private readProducts(): IProduct[] {
        return this.readData().products;
    }

    private readProductsFile(): IProductsFile {
        return this.readData();
    }

    private saveProducts(products: IProduct[]): void {
        const data = this.readData();
        data.products = products;
        this.saveData(data);
    }

    async create(payload: Omit<IProduct, 'id'>): Promise<IProduct> {
        const data = this.readData();
        const newProduct: IProduct = {
            id: data.products.length + 1,
            ...payload,
        };
        data.products.push(newProduct);
        this.saveData(data);
        return newProduct;
    }

    findAll(status?: string): IProductsFile {
        let productsFile = this.readProductsFile();
        if (status !== undefined) {
            const desired = status.toLowerCase() === 'true';
            productsFile.products = productsFile.products.filter(p => p.status === desired);
        }
        return productsFile;
    }

    findOne(id: number): IProductsFile {
        const product = this.readProductsFile();
        const productId = product.products.find(p => p.id === id)
        if (!productId) throw new NotFoundException('Product not found');
        return { orderBy: product.orderBy, products: [productId] };
    }

    update(id: number, dto: Partial<Omit<IProduct, 'id' | 'publicId' | 'imageUrl'>>): void {
        const products = this.readProducts();
        const idx = products.findIndex(p => p.id === id);
        if (idx === -1) throw new NotFoundException('Product not found');
        products[idx] = { ...products[idx], ...dto };
        this.saveProducts(products);
    }

    remove(id: number): void {
        const products = this.readProducts().filter(p => p.id !== id);
        this.saveProducts(products);
    }

    // orderBy
    getOrderBy(): number[] {
        return this.readData().orderBy;
    }

    createOrderBy(orderByRequest: number[]): void {
        const data = this.readData();
        data.orderBy = orderByRequest;
        this.saveData(data);
    }
}
