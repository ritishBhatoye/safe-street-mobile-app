#!/bin/bash

echo "🛑 Stopping all Metro processes..."
pkill -f "react-native" || true
pkill -f "metro" || true
pkill -f "expo" || true

echo "🧹 Clearing caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .expo 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

echo "🚀 Starting fresh..."
npx expo start --clear

echo "✅ Done! Now:"
echo "1. Close your app completely (swipe away)"
echo "2. Reopen the app"
echo "3. Try registering/signing in"
