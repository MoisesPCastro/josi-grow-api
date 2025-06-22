// src/settings/settings.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Firestore, CollectionReference } from '@google-cloud/firestore';

@Injectable()
export class SettingService {
    private readonly coll: CollectionReference;

    constructor(
        @Inject('FIRESTORE')
        private readonly firestore: Firestore,
    ) {
        this.coll = this.firestore.collection('setting');
    }

    async getOrderViewProduct(): Promise<string[]> {
        const doc = await this.coll.doc('order_view').get();
        const data = doc.data();
        return Array.isArray(data.orderViewProduct)
            ? data.orderViewProduct
            : [];
    }

    async updateOrderViewProduct(ids: string[]): Promise<void> {
        await this.coll
            .doc('order_view')
            .set({ orderViewProduct: ids }, { merge: true });
    }
}
