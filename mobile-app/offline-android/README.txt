Offline Android APK (DCloud HBuilder-Integrate-AS)

1) SDK: Download Android offline SDK from
   https://nativesupport.dcloud.net.cn/AppDocs/download/android.html
   Match the SDK version to your @dcloudio/uni-* runtime (see SDK Readme.txt).

2) Android Studio: Import HBuilder-Integrate-AS from the zip; follow
   https://nativesupport.dcloud.net.cn/AppDocs/usesdk/android.html
   (libs, assets/data from SDK, Gradle versions per SDK sample).

3) AppKey: In https://dev.dcloud.net.cn/ create/obtain Android offline AppKey.
   Merge AndroidManifest-appkey-snippet.xml into the app module AndroidManifest.

4) After "npm run build:app-android", sync resources:
   npm run android:sync-offline -- "C:\path\to\HBuilder-Integrate-AS"
   (or: node scripts/sync-offline-android.cjs "C:\path\to\HBuilder-Integrate-AS")

5) Release signing: copy keystore.properties.example, fill values, merge
   signing.gradle.snippet into the app module; generate APK in Android Studio.
