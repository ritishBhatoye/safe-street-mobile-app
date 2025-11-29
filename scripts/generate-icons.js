#!/usr/bin/env node

/**
 * Icon Generation Script for SafeStreet App
 *
 * This script generates app icons in all required sizes from SVG source files.
 *
 * Requirements:
 * - sharp (npm package for image processing)
 *
 * Usage:
 * npm install sharp
 * node scripts/generate-icons.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Get current directory (works in both CommonJS and ES modules)
const __dirname = path.resolve();

// Paths
const ASSETS_DIR = path.join(__dirname, "assets");
const ICON_SVG = path.join(ASSETS_DIR, "icon-design.svg");
const ADAPTIVE_SVG = path.join(ASSETS_DIR, "adaptive-icon-design.svg");

// Icon sizes to generate
const ICON_SIZES = {
  // Main app icons
  "icon.png": 1024,
  "adaptive-icon.png": 1024,

  // Web/PWA icons
  "favicon.png": 48,
  "icon-192.png": 192,
  "icon-512.png": 512,

  // Additional sizes for various platforms
  "icon-16.png": 16,
  "icon-32.png": 32,
  "icon-64.png": 64,
  "icon-128.png": 128,
  "icon-256.png": 256,
};

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Check if SVG files exist
if (!fs.existsSync(ICON_SVG)) {
  console.error("❌ Error: icon-design.svg not found in assets/");
  console.log("Please create the SVG file first.");
  process.exit(1);
}

if (!fs.existsSync(ADAPTIVE_SVG)) {
  console.error("❌ Error: adaptive-icon-design.svg not found in assets/");
  console.log("Please create the SVG file first.");
  process.exit(1);
}

console.log("🎨 SafeStreet Icon Generator");
console.log("============================\n");

// Generate icons
async function generateIcons() {
  try {
    console.log("📦 Generating standard icons from icon-design.svg...\n");

    for (const [filename, size] of Object.entries(ICON_SIZES)) {
      const outputPath = path.join(ASSETS_DIR, filename);

      // Use adaptive icon for adaptive-icon.png, otherwise use standard icon
      const sourceSvg = filename === "adaptive-icon.png" ? ADAPTIVE_SVG : ICON_SVG;

      await sharp(sourceSvg)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${filename} (${size}x${size}px)`);
    }

    console.log("\n🎉 All icons generated successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Review generated icons in assets/ folder");
    console.log("2. Update app.json with icon paths");
    console.log("3. Run: npx expo prebuild --clean");
    console.log("4. Test on device/simulator\n");
  } catch (error) {
    console.error("❌ Error generating icons:", error.message);
    console.log("\n💡 Troubleshooting:");
    console.log("- Make sure sharp is installed: npm install sharp");
    console.log("- Check that SVG files are valid");
    console.log("- Ensure you have write permissions in assets/ folder\n");
    process.exit(1);
  }
}

// Generate splash screen placeholder
async function generateSplashPlaceholder() {
  try {
    console.log("\n📱 Generating splash screen placeholder...\n");

    const splashPath = path.join(ASSETS_DIR, "splash.png");

    // Create a simple splash screen with the icon centered
    const iconBuffer = await sharp(ICON_SVG).resize(400, 400).png().toBuffer();

    await sharp({
      create: {
        width: 1284,
        height: 2778,
        channels: 4,
        background: { r: 59, g: 130, b: 246, alpha: 1 }, // #3B82F6
      },
    })
      .composite([
        {
          input: iconBuffer,
          gravity: "center",
        },
      ])
      .png()
      .toFile(splashPath);

    console.log("✅ Generated splash.png (1284x2778px)");
  } catch (error) {
    console.log("⚠️  Could not generate splash screen:", error.message);
    console.log("You can create it manually or use the existing one.\n");
  }
}

// Run the generator
(async () => {
  await generateIcons();
  await generateSplashPlaceholder();
})();
