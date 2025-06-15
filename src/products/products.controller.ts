// src/products/products.controller.ts
import {
    Controller, Post, Body, Param, Get, Put, Delete,
    HttpCode, BadRequestException, UseInterceptors, UploadedFile, Query,
    ParseArrayPipe,
    ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CloudinaryService } from 'src/providers/cloudinary/cloudinary.service';
import { ICreateProductDto, IProduct, IProductsFile } from './interfaces';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cloudinary: CloudinaryService,
    ) { }

    @Get('orderBy')
    getOrderBy(): number[] {
        return this.productsService.getOrderBy();
    }

    @Get()
    findAll(@Query('status') status?: string): IProductsFile {
        return this.productsService.findAll(status);
    }

    @Put('update/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<ICreateProductDto>,
    ) {
        if (body.status !== undefined) {
            body.status = body.status === 'true' || body.status === true;
        }
        if (body.emphasis !== undefined) {
            body.emphasis = body.emphasis === 'true' || body.emphasis === true;
        }
        this.productsService.update(+id, body);
        return { message: "Produto Atualizado com sucesso" };
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number) {
        const productFile = this.productsService.findOne(+id);
        await this.cloudinary.deleteFile(productFile.products[0].publicId);
        this.productsService.remove(+id);
    }

    @Post()
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() payload: ICreateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) throw new BadRequestException('Image is required');

        const upload = await this.cloudinary.uploadFile(
            file.buffer,
            'products',
        );

        const statusBool = payload.status === 'true' || payload.status === true;
        const emphasisBool =
            payload.emphasis === 'true' ||
            payload.emphasis === true ||
            false;

        await this.productsService.create({
            ...payload,
            emphasis: emphasisBool,
            status: statusBool,
            imageUrl: upload.url,
            publicId: upload.publicId,
        });
        return { message: 'Created successfully' };
    }

    @Post('orderBy')
    @HttpCode(201)
    setOrderBy(
        @Body(
            'orderBy',
            new ParseArrayPipe({ items: Number, optional: false })
        )
        orderby: number[],
    ) {
        this.productsService.createOrderBy(orderby);
        return { message: 'OrderBy criado com sucesso' }
    }

    @Get(':id')
    findOne(@Param('id') id: number): IProductsFile {
        return this.productsService.findOne(+id);
    }
}
