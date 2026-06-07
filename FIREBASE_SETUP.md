# Firebase Setup Guide - KS Electrical & AC Services

This guide walks you through setting up the Firebase cloud environment to power the live services catalog, customer bookings database, manual invoicing book, and Google Authentication.

---

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** (or **Create Project**).
3. Enter a project name (e.g. `ks-electrical-services`) and click **Continue**.
4. (Optional) Disable Google Analytics if not needed, then click **Create Project**.
5. Once ready, click **Continue** to open the project dashboard.

---

## 2. Register Your Web App

1. In the center of the project overview page, click the **Web icon `</>`** (or click **Add app** -> **Web**).
2. Enter an app nickname (e.g., `KS Web Client`).
3. (Optional) Check **Also set up Firebase Hosting** (you can deploy to GitHub Pages instead, so this is optional).
4. Click **Register app**.
5. Copy the `firebaseConfig` object credentials displayed on screen. You will use these in your `.env` file.
6. Click **Continue to console**.

---

## 3. Enable Firebase Authentication

1. In the left sidebar menu, expand **Build** and click **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Google** under Additional Providers.
4. Toggle **Enable**.
5. Select a **Project support email** from the dropdown.
6. Click **Save**.

---

## 4. Create Cloud Firestore Database

1. In the left sidebar menu under **Build**, click **Firestore Database**.
2. Click **Create Database**.
3. Select your database location (choose a region close to your primary service area, e.g., `asia-south1` for India / Delhi NCR).
4. Click **Next**.
5. Start in **Production Mode** or **Test Mode**. (See [FIRESTORE_RULES.md](file:///c:/Users/A/OneDrive/Desktop/ks-demo/FIRESTORE_RULES.md) for securing it).
6. Click **Create**.

---

## 5. Configure Local Environment Variables

1. In the project root, create a file named `.env` by copying the template:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and replace the placeholder values with your exact keys from the `firebaseConfig` object copied in Step 2:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyA1...
   VITE_FIREBASE_AUTH_DOMAIN=ks-electrical-services.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=ks-electrical-services
   VITE_FIREBASE_STORAGE_BUCKET=ks-electrical-services.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=78953...
   VITE_FIREBASE_APP_ID=1:78953:web:a1b2c3...
   ```
3. Restart your development server (`npm run dev`) so Vite loads the new variables.

---

## 6. Seed Default Services & Branding

On the first launch, the website will check if Firestore has existing services. If empty, it will automatically populate your Firestore database collections with the default:
* Active services list (under the `services` collection)
* Default branding details (under the `branding_settings` collection)
* Default admin account registrations (under the `admins` collection)
No manual database seeding is required!
