import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'FIRESTORE',
            useFactory: (config: ConfigService) => {
                if (!admin.apps.length) {
                    admin.initializeApp({
                        credential: admin.credential.cert({
                            projectId: config.get('FIREBASE_PROJECT_ID'),
                            clientEmail: config.get('FIREBASE_CLIENT_EMAIL'),
                            privateKey: config.get('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
                        }),
                    });
                }
                return admin.firestore();
            },
            inject: [ConfigService],
        },
    ],
    exports: ['FIRESTORE'],
})
export class FirestoreModule { }
