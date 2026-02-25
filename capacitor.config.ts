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
};

export default config;
