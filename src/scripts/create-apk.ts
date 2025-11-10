#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

class AndroidBuilder {
  private projectRoot: string;
  private androidDir: string;

  constructor() {
    this.projectRoot = path.resolve(__dirname, "../..");
    this.androidDir = path.join(this.projectRoot, "android");
  }

  log(message: string, type: "info" | "success" | "error" = "info"): void {
    const prefix = type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️";
    console.log(`${prefix} ${message}`);
  }

  executeCommand(command: string, description: string): void {
    this.log(description);
    try {
      execSync(command, {
        cwd: this.projectRoot,
        stdio: "inherit",
      });
      this.log(`${description} - Done`, "success");
    } catch (error) {
      this.log(`${description} - Failed`, "error");
      throw error;
    }
  }

  checkPrerequisites(): void {
    if (!fs.existsSync(path.join(this.projectRoot, "package.json"))) {
      throw new Error("package.json not found");
    }
  }

  cleanAndroidDir(): void {
    if (fs.existsSync(this.androidDir)) {
      this.log("Cleaning android directory...");
      fs.rmSync(this.androidDir, { recursive: true, force: true });
    }
  }

  buildAPK(): void {
    this.log("🚀 Starting APK build process...");

    this.checkPrerequisites();
    this.cleanAndroidDir();

    this.executeCommand("npx expo prebuild --platform android --clean", "Running Expo prebuild");

    this.executeCommand("cd android && ./gradlew assembleRelease", "Building release APK");

    const apkPath = path.join(this.androidDir, "app/build/outputs/apk/release/app-release.apk");

    if (fs.existsSync(apkPath)) {
      const sizeInMB = (fs.statSync(apkPath).size / (1024 * 1024)).toFixed(2);
      this.log(`\n🎉 APK built successfully!`, "success");
      this.log(`📦 Size: ${sizeInMB} MB`, "info");
      this.log(`📍 Location: ${apkPath}`, "info");
    } else {
      throw new Error("APK file not found after build");
    }
  }

  run(): void {
    try {
      this.buildAPK();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`\nBuild failed: ${errorMessage}`, "error");
      process.exit(1);
    }
  }
}

// Show help
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
🔨 Android APK Builder

Usage: node src/scripts/create-apk.ts

This script will:
1. Clean the android directory
2. Run expo prebuild for Android
3. Build a release APK

Output: android/app/build/outputs/apk/release/app-release.apk
`);
  process.exit(0);
}

// Run the builder
new AndroidBuilder().run();
