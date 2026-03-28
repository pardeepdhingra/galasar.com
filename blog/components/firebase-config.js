/**
 * Firebase configuration for blog engagement.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (e.g., "galasar-blog")
 * 3. Go to Project Settings → General → Your Apps → Add Web App
 * 4. Copy the firebaseConfig values and paste them below
 * 5. Go to Realtime Database → Create Database → Start in test mode
 * 6. Update the database rules to:
 *
 *    {
 *      "rules": {
 *        "blog": {
 *          "$slug": {
 *            "claps": { ".read": true, ".write": true },
 *            "likes": { ".read": true, ".write": true }
 *          }
 *        }
 *      }
 *    }
 *
 * 7. Replace the placeholder values below with your real config.
 */

window.__FIREBASE_CONFIG = {
  apiKey: "AIzaSyC-iKZMs63mCg9btSOiWTAUJlT8XLRD0eI",
  authDomain: "pardeeps-blog.firebaseapp.com",
  projectId: "pardeeps-blog",
  storageBucket: "pardeeps-blog.firebasestorage.app",
  messagingSenderId: "641556998614",
  appId: "1:641556998614:web:763e95ea46202870909c77",
  measurementId: "G-FLCJE6NEHP",
};
