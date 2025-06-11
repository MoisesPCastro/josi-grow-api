import { Injectable, Inject, Logger } from '@nestjs/common';
import { v2 as cloudinaryV2, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger(CloudinaryService.name);

    constructor(
        @Inject('CLOUDINARY')
        private readonly client: typeof cloudinaryV2,
    ) { }

    async uploadFile(buffer: Buffer, folder = 'uploads'): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const stream = this.client.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error) {
                        this.logger.error('Erro no upload:', error.message);
                        return reject(error);
                    }
                    this.logger.log(`Upload concluído: public_id=${result.public_id}`);
                    resolve(result);
                },
            );
            Readable.from(buffer).pipe(stream);
        });
    }

    async deleteFile(publicId: string): Promise<void> {
        this.logger.log(`Removendo arquivo do Cloudinary: public_id=${publicId}`);
        await this.client.uploader.destroy(publicId);
        this.logger.log(`Arquivo ${publicId} removido com sucesso.`);
    }
}
