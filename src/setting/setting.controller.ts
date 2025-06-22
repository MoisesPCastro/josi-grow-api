import { Controller, Get, Body, Put } from '@nestjs/common';
import { SettingService } from './setting.service';
import { UpdateOrderViewDto } from './interface';

@Controller('setting')
export class SettingController {
    constructor(private readonly settingsService: SettingService) { }

    @Get('order-view')
    async getOrderView(): Promise<string[]> {
        return this.settingsService.getOrderViewProduct();
    }

    @Put('order-view')
    async updateOrderView(
        @Body() orderByProducts: UpdateOrderViewDto
    ): Promise<{ message: string }> {
        await this.settingsService.updateOrderViewProduct(orderByProducts.orderViewProduct);
        return { message: 'Order product salvo com sucesso!' };
    }
}
