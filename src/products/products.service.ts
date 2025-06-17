import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Firestore, CollectionReference, Query } from '@google-cloud/firestore';
import { IProduct, IProductsFile } from './interfaces';

@Injectable()
export class ProductsService {
    private readonly coll: CollectionReference;

    constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {
        this.coll = this.firestore.collection('products');
    }

    async create(payload: Omit<IProduct, 'id'>): Promise<void> {
        const ref = this.coll.doc();
        const id = ref.id;
        await ref.set({ ...payload, id });
    }

    async findAll(status?: string): Promise<IProductsFile> {
        let query: Query = this.coll;
        if (status !== undefined) {
            const desired = status.toLowerCase() === 'true';
            query = query.where('status', '==', desired);
        }
        const snap = await query.get();
        const products = snap.docs.map(d => d.data() as IProduct);

        // const orderBy = [] // futuro: buscar documento "orderBy"
        return { products, orderBy: [] };
    }

    async findOne(id: string): Promise<IProductsFile> {
        const doc = await this.coll.doc(id).get();
        if (!doc.exists) throw new NotFoundException('Product not found');
        const p = doc.data() as IProduct;
        return { products: [p], orderBy: [] };
    }

    async update(id: string, dto: Partial<IProduct>): Promise<void> {
        const ref = this.coll.doc(id);
        const doc = await ref.get();
        if (!doc.exists) throw new NotFoundException('Product not found');
        await ref.update(dto);
    }

    async remove(id: string): Promise<void> {
        await this.coll.doc(id).delete();
    }

    // futuros métodos de orderBy:
    // async getOrderBy(): Promise<number[]> { ... }
    // async createOrderBy(orderBy: number[]): Promise<void> { ... }
}
