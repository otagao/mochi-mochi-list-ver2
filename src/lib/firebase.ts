// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// 環境変数からFirebase設定を読み込み
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 起動時に匿名ログインを確立して uid を得る（失敗してもアプリは起動可能）
export const ensureAnonLogin = async () => {
  return new Promise<string>((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) await signInAnonymously(auth);
        resolve(auth.currentUser?.uid ?? '');
      } catch (e) {
        reject(e);
      }
    });
  });
};
