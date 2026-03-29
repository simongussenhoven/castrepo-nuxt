# Capacitor + Ionic Setup for Nuxt

## Usage

1. **Build your Nuxt app:**

   ```sh
   pnpm build
   ```

   This will output your web assets to the `dist` directory (as set in `capacitor.config.ts`).

2. **Sync Capacitor:**

   ```sh
   npx cap sync
   ```

   This copies the latest web build into the native projects.

3. **Open native IDEs:**
   - Android: `npx cap open android`
   - iOS: `npx cap open ios`

4. **Run on device/emulator:**
   Use Android Studio or Xcode to run and debug.

## Notes

- You can use `@ionic/pwa-elements` for camera, toast, and other web-native features. Import it in your Nuxt entrypoint (e.g., `app.vue` or a plugin).
- For more info, see [Capacitor Docs](https://capacitorjs.com/docs) and [Ionic PWA Elements](https://ionic.io/docs/pwa-elements/overview).

## Example: Importing PWA Elements

```js
// In app.vue or a Nuxt plugin
import { defineNuxtPlugin } from "#app";
import { defineCustomElements } from "@ionic/pwa-elements/loader";

export default defineNuxtPlugin(() => {
  defineCustomElements(window);
});
```
