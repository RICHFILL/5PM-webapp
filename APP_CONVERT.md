# 5PM Nexus Invest — Mobile App Conversion

Convert the existing Vite + React + Tailwind CSS web app into a native Android/iOS application using **Capacitor** (by Ionic).

---

## Prerequisites

- Node.js 18+
- Android Studio (for Android builds)
- Android SDK (API 34+)
- A physical device or emulator for testing

---

## Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init 5PM-Nexus-Invest com.5pm.nexusinvest --webDir=dist
npx cap add android
```

> iOS setup (`npx cap add ios`) requires macOS + Xcode.

---

## Step 2: Configure Vite

**`vite.config.ts`** — add `base: './'` so asset paths resolve correctly in the native WebView (`file://` protocol):

```ts
export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

---

## Step 3: Install Capacitor Plugins

```bash
npm install @capacitor/camera @capacitor/filesystem @capacitor/splash-screen @capacitor/status-bar
```

### Plugin reference

| Feature | Plugin | Purpose |
|---------|--------|---------|
| KYC Selfie | `@capacitor/camera` | Take selfie via native camera (replaces `getUserMedia`) |
| Document Upload | `@capacitor/filesystem` | Pick files from device storage (replaces `<input type="file">`) |
| Splash Screen | `@capacitor/splash-screen` | Branded splash while web app loads |
| Status Bar | `@capacitor/status-bar` | Style status bar to match navy theme |

---

## Step 4: Adapt KYC Selfie for Native

**`src/pages/investor/KycPage.jsx`** — update `Step5Selfie` to use Capacitor Camera when running natively, with web API fallback:

```js
import { Camera, CameraResultType } from '@capacitor/camera';

// Inside Step5Selfie or a shared utility:
const takeSelfie = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      width: 480,
      height: 640,
    });
    // Convert URI to File object:
    const response = await fetch(image.webPath);
    const blob = await response.blob();
    const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
    onChange(file);
  } catch (err) {
    // Fallback to web camera (getUserMedia) if Capacitor not available
    startWebCamera();
  }
};
```

> **Note:** The existing `<input type="file">` uploads in `Step4Documents` work inside a WebView without changes. Only the selfie camera needs adaptation because `getUserMedia` is less reliable on Android WebView.

---

## Step 5: Configure Android Manifest

**`android/app/src/main/AndroidManifest.xml`** — add required permissions:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

Also update the `<application>` tag to allow cleartext traffic during development:
```xml
android:usesCleartextTraffic="true"
```

---

## Step 6: Splash Screen & Status Bar

In **`src/main.tsx`** (or `App.tsx`), add:

```js
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

// Hide splash after app is ready
SplashScreen.hide();

// Style the status bar
StatusBar.setStyle({ style: Style.Dark });
StatusBar.setBackgroundColor({ color: '#0f172a' }); // navy-900
```

Configure splash in **`capacitor.config.json`**:

```json
{
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#0f172a",
      "androidSplashResourceName": "splash"
    }
  }
}
```

---

## Step 7: Build & Sync

```bash
npm run build
npx cap copy
npx cap sync
```

These commands:
1. Build the Vite web app into `dist/`
2. Copy web build to the native project's `public/` folder
3. Sync Capacitor plugins and dependencies

---

## Step 8: Run on Device / Emulator

```bash
npx cap run android
```

Or open Android Studio for full control:
```bash
npx cap open android
```

---

## Step 9: App Icon

1. Generate icon assets from `public/assets/logo.png` using [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) or a tool like `@capacitor/assets`
2. Or manually:
   ```bash
   npx @capacitor/assets generate --icon public/assets/logo.png
   ```
3. Place generated icons in `android/app/src/main/res/`

---

## Packaging for Release

```bash
cd android
./gradlew assembleRelease
```

The signed APK/AAB will be at:
`android/app/build/outputs/apk/release/app-release-unsigned.apk`

Use Android Studio's **Build > Generate Signed Bundle / APK** for Play Store submission.

---

## Key Points

- **Existing React code works as-is** — Capacitor does not modify your source code
- **KYC camera** — adapt `getUserMedia` calls to use Capacitor Camera plugin for better native reliability
- **File uploads** — `<input type="file">` works natively in WebView, no changes needed
- **Push notifications** — add `@capacitor/push-notifications` when ready (not required for MVP)
- **Offline support** — consider adding a service worker for cached assets (optional)
- **API base URL** — update `.env` variable `VITE_API_URL` if the backend URL differs between dev and production

---

## Folder Structure After Setup

```
5PM-webapp/
├── android/               # Android native project (generated)
├── capacitor.config.json  # Capacitor configuration
├── src/                   # Your web app (unchanged)
├── dist/                  # Build output (copied to native)
├── package.json
└── vite.config.ts         # Updated with base: './'
```

---

## References

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Camera Plugin](https://capacitorjs.com/docs/apis/camera)
- [Publishing to Google Play](https://developer.android.com/distribute)
