<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Site Security and Surveillance (GMT SSS)

A comprehensive website activity, performance, and security monitoring hub powered by Gemini AI. GMT SSS is built as a single unified codebase supporting multi-language internationalization (i18n) and native cross-platform targets:
- **100% Kotlin Android Native App**
- **100% Swift iOS Native App**
- **100% Swift macOS Native App**
- **100% C++ / Win32 Windows Native App**
- **Web App (Vite + React + TypeScript)**

---

## 🌐 Multi-Language Support (i18n)

GMT SSS supports dynamic runtime language switching and full Right-to-Left (RTL) / Left-to-Right (LTR) layout adjustments.

Supported languages include:
- 🇺🇸 **English** (`en`)
- 🇪🇸 **Español** (`es`)
- 🇫🇷 **Français** (`fr`)
- 🇩🇪 **Deutsch** (`de`)
- 🇯🇵 **日本語** (`ja`)
- 🇨🇳 **中文** (`zh`)
- 🇸🇦 **العربية** (`ar` - with full RTL layout rendering)

---

## 📱 Cross-Platform Architecture

GMT SSS is structured to deliver native applications from one single codebase:

```
├── android/             # 100% Kotlin Android Native Application
│   ├── app/src/main/java/com/gmt/sss/MainActivity.kt
│   └── build.gradle
├── ios/                 # 100% Swift iOS Native Application
│   └── App/AppDelegate.swift
├── macos/               # 100% Swift macOS Native Application
│   └── App/AppDelegate.swift
├── windows/             # 100% C++ Win32 / CMake Windows Native Application
│   ├── CMakeLists.txt
│   └── src/main.cpp
├── .github/workflows/   # GitHub Actions Cross-Platform CI/CD
│   └── build-crossplatform.yml
├── capacitor.config.ts  # Capacitor Native Integration Config
├── translations.ts      # Multi-language translation dictionaries
└── components/          # Reusable UI Components & LanguageSelector
```

---

## ⚙️ GitHub Actions Workflow & Artifact Downloads

The GitHub Actions workflow (`.github/workflows/build-crossplatform.yml`) triggers on every push and pull request to automate cross-platform compilation and artifact publishing.

### Downloadable Build Artifacts:
- 📦 **Android APK**: `gmt-sss-android-apk` (`app-debug.apk` ready for Android devices)
- 📦 **Web Distribution**: `gmt-sss-web-dist` (Optimized production build)
- 📦 **iOS Native Package**: `gmt-sss-ios-native`
- 📦 **macOS Native Package**: `gmt-sss-macos-native`
- 📦 **Windows Native Package**: `gmt-sss-windows-native`

#### How to Download Artifacts:
1. Go to your GitHub repository's **Actions** tab.
2. Select the latest workflow run for **GMT SSS Cross-Platform Native & Multi-Language CI/CD**.
3. Scroll down to the **Artifacts** section at the bottom of the summary page.
4. Click on **gmt-sss-android-apk** to download the Android APK file or any desktop/web target package.

---

## 🚀 Local Development & Build Instructions

### Prerequisites
- Node.js 18+
- npm

### 1. Web Local Development
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Vite local development server
npm run dev

# Production build
npm run build
```

### 2. Android Build (100% Kotlin)
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
# APK generated at android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. iOS & macOS Native Builds
Open the Xcode workspace or project located in `ios/` or `macos/` and run target build via Xcode or `xcodebuild`.

### 4. Windows Native Build (C++)
```bash
cd windows
mkdir build && cd build
cmake ..
cmake --build .
```

---

## 🔑 Environment Variables

Set `GEMINI_API_KEY` in `.env.local` to enable Gemini AI security recommendations and automated report synthesis.
