import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.example.castrepo',
    appName: 'castrepo-nuxt',
    webDir: 'dist',
    server: {
        // 10.0.2.2 is the Android emulator's alias for the host machine's localhost
        url: 'http://10.0.2.2:3000',
        cleartext: true, // Allow HTTP (non-HTTPS) traffic
    },
    plugins: {
        SplashScreen: {
            launchAutoHide: false,
            backgroundColor: '#0f172a', // matches dark:bg-slate-900
            androidScaleType: 'CENTER_CROP',
            splashFullScreen: true,
            splashImmersive: true,
            layoutName: 'launch_screen',
            useDialog: true,
        },
    },
    android: {
        backgroundColor: '#0f172a', // WebView background to prevent white flash
    },
};

export default config;
