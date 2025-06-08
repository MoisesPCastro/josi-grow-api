import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middleware/autorization';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ProductsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('products');
  }
}
