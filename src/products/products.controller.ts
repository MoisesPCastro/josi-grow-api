import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, Query, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { IProduct } from './interfaces';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dtos/createProducts.dto';
import { join } from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { memoryStorage } from 'multer';


@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @HttpCode(201)
    @UseInterceptors(
        FileInterceptor('image', {
            storage: memoryStorage(),
        }),
    )
    async create(
        @Body() productDto: Omit<CreateProductDto, 'image'>,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('Image is required');
        }

        const uploadPath = join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const filename = `${Date.now()}.jpg`;
        const filepath = join(uploadPath, filename);

        await sharp(file.buffer)
            .jpeg({ quality: 80 })
            .toFile(filepath);

        const products = this.productsService.findAll();
        const newProduct: IProduct = {
            id: products.length + 1,
            status: true,
            ...productDto,
            image: filename,
        };

        this.productsService.create(newProduct);

        return { message: 'Created successfully', product: newProduct };
    }

    @Get()
    findAll(@Query('status') status?: string): IProduct[] {
        return this.productsService.findAll(status);
    }

    @Get(':id')
    findOne(@Param('id') id: number): IProduct {
        return this.productsService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updatedProduct: IProduct): string {
        this.productsService.update(+id, updatedProduct);
        return 'Updated successfully!'
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number): void {
        return this.productsService.delete(+id);
    }
}
