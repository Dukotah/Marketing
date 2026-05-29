# Publishing Launchpad to the App Stores

This guide walks through building and submitting the Launchpad mobile app to the Apple App Store and Google Play Store using Expo Application Services (EAS).

---

## Prerequisites

### Apple App Store
- **Apple Developer Program** membership — $99/year
  - Enroll at https://developer.apple.com/programs/enroll/
  - Required to distribute on the App Store and TestFlight
  - Allow 24–48 hours for approval after enrolling

### Google Play Store
- **Google Play Developer account** — $25 one-time fee
  - Register at https://play.google.com/console/signup
  - Account activation is usually instant

### Local Requirements
- Node.js 18+ and npm/yarn installed
- Expo CLI: `npm install -g expo-cli`
- An Expo account — create one free at https://expo.dev

---

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

Log in to your Expo account:

```bash
eas login
```

---

## Step 2: Configure Your EAS Project

From the `apps/mobile` directory, initialize EAS for this project:

```bash
eas init
```

This will create a project on expo.dev and give you a real `projectId`. Replace the placeholder in `app.json`:

```json
"eas": {
  "projectId": "your-actual-project-id-here"
}
```

---

## Step 3: Set Up Environment Variables in EAS

Sensitive values like Supabase credentials should be set as EAS secrets rather than committed to the repo.

```bash
# Set secrets for all build profiles
eas secret:create --scope project --name SUPABASE_URL --value "https://your-project.supabase.co"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "your-anon-key"
```

View existing secrets:

```bash
eas secret:list
```

In your app code, access these via `process.env.SUPABASE_URL` (they are injected at build time).

---

## Step 4: Build the App

### Development Build (for testing on a device)

```bash
eas build --profile development --platform all
```

Install the development build on your device and use it with Expo Go or your own dev client.

### Preview Build (internal testing)

```bash
# iOS — distributed via TestFlight or direct install
eas build --profile preview --platform ios

# Android — produces an APK for direct installation
eas build --profile preview --platform android
```

### Production Build (for store submission)

```bash
eas build --profile production --platform all
```

EAS handles code signing automatically. For iOS, it will create or use existing provisioning profiles and certificates. For Android, it manages the keystore.

> **Important:** Store your Android keystore safely. If you lose it, you cannot update your app on Google Play.

---

## Step 5: Submit to the App Stores

After a successful production build, submit directly from EAS:

### Apple App Store

```bash
eas submit --platform ios
```

EAS will prompt for your Apple ID and app-specific password. You can also configure auto-submission in `eas.json` under `submit.production`.

After submission:
1. Log in to App Store Connect (https://appstoreconnect.apple.com)
2. Complete your app metadata: description, screenshots, keywords, age rating
3. Submit for App Store Review (typically 1–3 days)

### Google Play Store

```bash
eas submit --platform android
```

After submission:
1. Log in to Google Play Console (https://play.google.com/console)
2. Complete your store listing: description, screenshots, content rating
3. Choose a release track (internal → closed testing → open testing → production)
4. Roll out to production

---

## Step 6: Over-the-Air Updates (OTA)

For JS/asset-only changes that don't require a new binary, use EAS Update to push updates instantly without going through app store review:

```bash
eas update --branch production --message "Fix: campaign list loading"
```

Configure update channels in `app.json` or `eas.json` as needed.

---

## Useful Commands

| Command | Description |
|---|---|
| `eas build:list` | View recent builds |
| `eas build:cancel` | Cancel a running build |
| `eas credentials` | Manage iOS/Android credentials |
| `eas secret:list` | List project secrets |
| `eas update:list` | View OTA updates |
| `eas diagnostics` | Check your environment for issues |

---

## Resources

- EAS Build docs: https://docs.expo.dev/build/introduction/
- EAS Submit docs: https://docs.expo.dev/submit/introduction/
- EAS Update docs: https://docs.expo.dev/eas-update/introduction/
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
