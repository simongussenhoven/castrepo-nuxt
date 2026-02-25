#!/bin/bash
# Script to build and run the Android app using Capacitor and Gradle

set -e

# Navigate to project root
cd "$(dirname "$0")/.."

# Sync Capacitor Android project
npx cap sync android

# Open Android Studio or run the app via Gradle
if command -v ./android/gradlew &> /dev/null; then
	echo "Running app via Gradle..."
	cd android
	./gradlew assembleDebug
	./gradlew installDebug
	adb shell am start -n "com.example.castrepo/com.example.castrepo.MainActivity"
else
	echo "Gradle wrapper not found. Opening Android Studio..."
	npx cap open android
fi
