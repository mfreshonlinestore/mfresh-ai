import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  Firestore,
} from "firebase/firestore";
import {
  getAuth,
  Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

export const isFirebaseConfigured = (): boolean => {
  return Object.values(firebaseConfig).every((value) => {
    const trimmedValue = String(value).trim();
    return (
      trimmedValue.length > 0 &&
      !trimmedValue.includes("demo") &&
      !trimmedValue.includes("your_") &&
      !trimmedValue.includes("your-project")
    );
  });
};

let app: ReturnType<typeof initializeApp> | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

const initializeFirebase = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!isFirebaseConfigured()) {
    console.error(
      "Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* values to .env.local or your Vercel environment variables."
    );
    return null;
  }

  if (!app && getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
      dbInstance = getFirestore(app);
      authInstance = getAuth(app);
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      return null;
    }
  }

  if (!app) {
    app = getApps()[0];
    dbInstance = getFirestore(app);
    authInstance = getAuth(app);
  }

  return app;
};

export const getDb = (): Firestore | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const initializedApp = initializeFirebase();
  if (!initializedApp) {
    return null;
  }

  return dbInstance;
};

export const getAuth_Instance = (): Auth | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const initializedApp = initializeFirebase();
  if (!initializedApp) {
    return null;
  }

  return authInstance;
};

export const db = null as Firestore | null;
export const auth = null as Auth | null;

export default app;


