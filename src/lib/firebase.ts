import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// @ts-ignore
import appletConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDm1V2v0FjSoyy34oENhyrldENjL5XL278",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mr-nexora.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mr-nexora",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mr-nexora.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "425660257877",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:425660257877:web:693856b7d8446ccb9f26dc",
};

const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'dummy-api-key';

let app = null;
try {
  app = isConfigValid ? initializeApp(firebaseConfig) : null;
} catch (e) {
  console.error("Firebase initialization failed", e);
}

export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };

export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;


export async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export function handleFirestoreError(error: any, operation: FirestoreErrorInfo['operationType'], path: string | null = null): never {
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown Firestore error',
    operationType: operation,
    path: path,
    authInfo: {
      userId: auth?.currentUser?.uid || 'unauthenticated',
      email: auth?.currentUser?.email || 'none',
      emailVerified: auth?.currentUser?.emailVerified || false,
      isAnonymous: auth?.currentUser?.isAnonymous || false,
      providerInfo: auth?.currentUser?.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName || '',
        email: p.email || ''
      })) || []
    }
  };
  throw new Error(JSON.stringify(errorInfo));
}
