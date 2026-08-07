# Android APK Build Instructions (EAS Build)

Follow these steps to build and generate a downloadable Android APK file for CareerOS AI.

---

## 1. Prerequisites

1. Create a free account at [expo.dev](https://expo.dev) if you don't have one.
2. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```

---

## 2. Login & Initialize EAS

Open your terminal in `apps/mobile`:

```bash
cd apps/mobile

# Login to your Expo account
eas login

# Initialize EAS configuration for the app
eas init
```

---

## 3. Build APK (Preview Profile)

To build a standalone APK that can be directly installed on any Android device:

```bash
eas build --platform android --profile preview
```

---

## 4. Install & Test on Android Device

1. Once the build completes, EAS will print a **direct download URL** and a **QR Code**.
2. Open the URL or scan the QR Code on your Android phone.
3. Download the `.apk` file and tap to install (enable "Install from unknown sources" if prompted).

---

## 5. Local Alternative (Without EAS Cloud)

If you have Android Studio installed locally and prefer building without Expo cloud:

```bash
cd apps/mobile
npx expo run:android
```
