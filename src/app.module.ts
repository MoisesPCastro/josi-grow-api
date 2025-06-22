// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { CloudinaryModule } from './providers/cloudinary/cloudinary.module';
import { ProductsModule } from './products/products.module';
import { AuthMiddleware } from './middleware/autorization';
import { FirestoreModule } from './fireBase/firestore.module';
import { SettingModule } from './setting/setting-module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    CloudinaryModule,
    ProductsModule,
    FirestoreModule,
    SettingModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('products');
  }
}
