// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CloudinaryModule } from 'src/providers/cloudinary/cloudinary.module';
import { FirestoreModule } from 'src/fireBase/firestore.module';
import { SettingModule } from 'src/setting/setting-module';

@Module({
    imports: [CloudinaryModule, FirestoreModule, SettingModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule { }
