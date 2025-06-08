import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        const token = req.headers['authorization'];

        if (token !== process.env.AUTH_TOKEN) {
            throw new UnauthorizedException('Token inválido');
        }

        next();
    }
}
