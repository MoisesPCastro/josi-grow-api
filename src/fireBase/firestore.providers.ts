import { Firestore } from '@google-cloud/firestore';

export const FIRESTORE = 'FIRESTORE';

export const firestoreProvider = {
    provide: FIRESTORE,
    useFactory: () => {
        return new Firestore({
            projectId: process.env.GCLOUD_PROJECT_ID,
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });
    },
};
