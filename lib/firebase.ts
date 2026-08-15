import { initializeApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
} from "firebase/firestore";
import {
  getAuth,
  Auth,
} from "firebase/auth";

// Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "demo-sender",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app",
};

// Initialize Firebase (will be called only on client-side)
let app: ReturnType<typeof initializeApp> | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

const initializeFirebase = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
      dbInstance = getFirestore(app);
      authInstance = getAuth(app);
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
    }
  }
};

// Lazy-load Firebase services
export const getDb = (): Firestore | null => {
  if (typeof window !== "undefined") {
    initializeFirebase();
    return dbInstance;
  }
  return null;
};

export const getAuth_Instance = (): Auth | null => {
  if (typeof window !== "undefined") {
    initializeFirebase();
    return authInstance;
  }
  return null;
};

// For backward compatibility
export const db = (() => {
  // This will be executed on build time, but we need to handle null safely
  return null as Firestore | null;
})();

export const auth = (() => {
  return null as Auth | null;
})();

export default app;


