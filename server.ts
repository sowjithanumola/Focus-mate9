
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      console.error('Could not parse FIREBASE_SERVICE_ACCOUNT_KEY', e);
      return undefined;
    }
  }
  return undefined;
}

function createFirebaseAdminApp(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }
    
    const serviceAccount = getServiceAccount();

    if (serviceAccount) {
        return initializeApp({
            credential: cert(serviceAccount),
            projectId: firebaseConfig.projectId,
        });
    }

    // This is for local development without a service account
    // It will use the default application credentials.
    return initializeApp({
        projectId: firebaseConfig.projectId,
    });
}

export function getFirebaseAdmin() {
  const app = createFirebaseAdminApp();
  const firestore = getFirestore(app);
  return { firestore, app };
}
