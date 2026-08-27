# GMT SSS - Global Site Security & Surveillance

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A unified multi-language, multi-cross platform site security and surveillance application powered by React, TypeScript, Gemini AI, and native platform targets.

---

## 🌍 Multi-Language Support (i18n)

GMT SSS supports full internationalization out-of-the-box across multiple languages:
- 🇺🇸 **English** (`en`)
- 🇪🇸 **Español** (`es`)
- 🇫🇷 **Français** (`fr`)
- 🇩🇪 **Deutsch** (`de`)
- 🇯🇵 **日本語** (`ja`)
- 🇨🇳 **中文** (`zh`)

Users can seamlessly switch languages using the interactive sidebar language selector.

---

## 📱 Platform Targets (100% Native Implementations)

 GMT SSS delivers one unified experience across desktop, web, and mobile native environments:

### 🤖 100% Kotlin Android Native App
- **Location:** `android/`
- **Language:** Kotlin
- **Entry point:** `android/app/src/main/java/com/gmt/sss/MainActivity.kt`
- **Features:** Embedded Web View container, native permissions (`INTERNET`, `ACCESS_NETWORK_STATE`), AndroidManifest setup, Gradle configuration.

### 🍏 100% iOS Native App
- **Location:** `ios/`
- **Language:** Swift / UIKit / WKWebView
- **Entry points:** `ios/AppDelegate.swift`, `ios/ViewController.swift`
- **Features:** WKWebView native UI hosting, iOS App Bundle configuration.

### 💻 100% macOS Native App
- **Location:** `macos/`
- **Language:** Swift / AppKit / WKWebView
- **Entry points:** `macos/AppDelegate.swift`, `macos/ViewController.swift`
- **Features:** Native macOS desktop windowing via NSWindow and WKWebView.

### 🪟 100% Windows Native App
- **Location:** `windows/`
- **Language:** C# / WinUI 3 / Windows App SDK
- **Entry points:** `windows/App.xaml.cs`, `windows/MainWindow.xaml.cs`
- **Features:** Native WinUI 3 desktop application with embedded WebView2 runtime.

---

## 🚀 GitHub Actions Workflow & Artifact Downloads

GMT SSS includes a continuous integration and deployment workflow located at `.github/workflows/build.yml`.

### Workflow Capabilities:
1. **Multi-Language Web Build:** Compiles the web bundle and checks i18n modules.
2. **Artifact Downloads:**
   - **`gmt-sss-web-dist`**: Production-ready web assets.
   - **`gmt-sss-android-apk`**: Android APK binary download for quick mobile installation.
   - **`gmt-sss-cross-platform-native-apps`**: Packaged iOS, macOS, Windows native source projects and build targets.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- Java JDK 17+ (for Android APK compilation)

### Quick Start
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start local development server
npm run dev

# 3. Build web & assets
npm run build
```

---

## 📄 License
Privately owned site security surveillance project. All rights reserved.
