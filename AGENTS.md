# AGENTS.md

## Cursor Cloud specific instructions

### Product
Ionic/Capacitor Android app (Angular 20 + Ionic 8) — a couple's love diary called "布布与一二的恋爱日记". Pure client-side; no backend, no API server. All data stored in IndexedDB/localStorage.

### Project layout
- `ionic-android-app/` — main app (Angular + Ionic + Capacitor)
- `example/love-diary/` — static HTML/CSS design mockups (reference only, not runnable)
- `docs/` — Chinese-language requirements and design docs

### Standard commands (run from `ionic-android-app/`)
| Action | Command |
|--------|---------|
| Dev server | `npm start` (alias for `ng serve`, default port 4200) |
| Lint | `npm run lint` |
| Unit tests | `npx ng test --no-watch --browsers=ChromeHeadless` |
| Build (dev) | `npx ng build --configuration development` |
| Build (prod) | `npm run build` |
| Capacitor sync | `npm run cap:sync` |
| Android APK (debug) | `npm run android:build` then `cd android && ./gradlew assembleDebug` |

### Android build notes
- **Gradle wrapper**: The committed `android/gradle/wrapper/gradle-wrapper.properties` originally pointed to a local Windows path (`file:///G:/gradle-8.9-all.zip`). This was fixed to use the official Gradle distribution URL. If you see a `FileNotFoundException` during Gradle builds, check this file.
- **Environment variables needed for Android builds**:
  ```
  export ANDROID_HOME=/opt/android-sdk
  export ANDROID_SDK_ROOT=/opt/android-sdk
  export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
  export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
  ```
- **Android SDK components installed**: `platform-tools`, `platforms;android-35`, `build-tools;35.0.0`, `emulator`, `system-images;android-35;google_apis;x86_64`
- **Emulator limitation**: Cloud VMs lack `/dev/kvm`, so Android emulators must use `-accel off` and are extremely slow. The emulator boots but apps may crash due to SIGTRAP in software emulation mode. For UI testing, use the web dev server (`npm start`) with Chrome DevTools mobile simulation (Pixel 6/7) instead — the Ionic app renders identically in browser and Android WebView.

### Pre-existing lint errors
The codebase has 13 pre-existing ESLint errors (all `@angular-eslint/prefer-inject` — preferring `inject()` over constructor injection). These are not regressions.
