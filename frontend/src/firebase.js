import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAV_OS6SOPV9iIei3Hq3fHc9wdSkZVlXvQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smartlib-875fc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartlib-875fc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smartlib-875fc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "802503610323",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:802503610323:web:db1c78430837fbb47d6926",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CJNQ3Z5LMT"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics safely in supported browser environments
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

/**
 * Maps Firebase error codes to user-friendly messages
 */
export function getFirebaseErrorMessage(error) {
  if (!error) return 'Authentication failed. Please try again.';
  const code = error.code || '';
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email address. Please sign up first.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid academic or personal email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a password with at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completion.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/cancelled-popup-request':
      return 'Authentication request cancelled.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to many failed attempts. Try again later or reset password.';
    default:
      return error.message || 'Authentication error. Please try again.';
  }
}

export {
  app,
  auth,
  analytics,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
};
