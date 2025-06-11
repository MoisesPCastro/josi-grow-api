// src/providers/cloudinary/cloudinary.provider.ts
import { v2 as cloudinaryV2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    useFactory: (config: ConfigService) => {
        cloudinaryV2.config({
            cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
            api_key: config.get('CLOUDINARY_API_KEY'),
            api_secret: config.get('CLOUDINARY_API_SECRET'),
        });
        return cloudinaryV2;
    },
    inject: [ConfigService],
};
