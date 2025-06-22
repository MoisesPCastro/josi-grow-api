// src/products/products.controller.ts
import {
    Controller, Post, Body, Param, Get, Put, Delete,
    HttpCode, BadRequestException, UseInterceptors,
    UploadedFile, Query, ParseArrayPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CloudinaryService } from 'src/providers/cloudinary/cloudinary.service';
import { ICreateProductDto } from './interfaces';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cloudinary: CloudinaryService,
    ) { }

    private parseBoolean(val: any): boolean {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') return val.toLowerCase() === 'true';
        return false;
    }

    @Get()
    async findAll(@Query('status') status?: string) {
        return this.productsService.findAll(status);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() payload: ICreateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('Image is required');
        const upload = await this.cloudinary.uploadFile(file.buffer, 'products');

        await this.productsService.create({
            ...payload,
            status: this.parseBoolean(payload.status),
            emphasis: this.parseBoolean(payload.emphasis),
            imageUrl: upload.secure_url,
            publicId: upload.public_id,
        });

        return { message: 'Produto criado com sucesso!' }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() body: Partial<ICreateProductDto>,
    ) {
        if (body.status !== undefined) {
            body.status = body.status === 'true' || body.status === true;
        }
        if (body.emphasis !== undefined) {
            body.emphasis = body.emphasis === 'true' || body.emphasis === true;
        }
        await this.productsService.update(id, body);
        return { message: 'Produto atualizado com sucesso' };
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        const { products } = await this.productsService.findOne(id);
        await this.cloudinary.deleteFile(products[0].publicId);
        await this.productsService.remove(id);
    }
}
