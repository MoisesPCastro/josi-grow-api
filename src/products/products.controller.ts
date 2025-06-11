// src/products/products.controller.ts
import {
    Controller, Post, Body, Param, Get, Put, Delete,
    HttpCode, BadRequestException, UseInterceptors, UploadedFile,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CloudinaryService } from 'src/providers/cloudinary/cloudinary.service';
import { CreateProductDto, IProduct } from './interfaces';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cloudinary: CloudinaryService,
    ) { }

    @Post()
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() payload: CreateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('Image is required');
        }



        const statusBool = payload.status === 'true' || payload.status === true;

        await this.productsService.create({
            ...payload,
            status: statusBool,
            imageUrl: 'upload.secure_url,',
            publicId: 'upload.public_id',
        });

        return { message: 'Created successfully' };
    }

    @Get()
    findAll(@Query('status') status?: string): IProduct[] {
        return this.productsService.findAll(status);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.productsService.findOne(+id);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() body: Partial<CreateProductDto>,
    ) {
        if (body.status !== undefined) body.status = body.status === 'true' || body.status === true;
        return this.productsService.update(+id, body);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number) {
        const product = this.productsService.findOne(+id);
        await this.cloudinary.deleteFile(product.publicId);
        this.productsService.remove(+id);
    }
}
