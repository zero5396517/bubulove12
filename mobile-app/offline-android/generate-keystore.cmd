@echo off
REM Generates a release keystore. Run from a secure directory; add the file to .gitignore.
REM See keystore.properties.example for wiring into Gradle.

keytool -genkeypair -alias bubulove -keyalg RSA -keysize 2048 -validity 36500 -keystore bubulove-release.keystore
