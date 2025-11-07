Login / Signup (Expo) — quick notes

What I added
- `src/auth.ts` — simple AsyncStorage backed user store with `signupUser` and `loginUser`.
- `app/signup.tsx` — sign-up screen collecting name, email, mobile, current location, address, pincode, state, district and password.
- `app/login.tsx` — login screen using email + password.

How it works
- Signing up stores the user in AsyncStorage (key: `APP_USERS_V1`).
- Passwords are stored as a simple demo hash (non-cryptographic). This is for local/demo use only.

How to try
1. Open the project in your terminal and start Expo as you usually do (e.g. `npm run start` or `expo start`).
2. Open the app on a simulator or device. Navigate to /signup or open the Signup screen from the app entry.
3. Create an account, then go to Login and sign in. After successful login you'll be routed to `/` (home).

Notes & security
- This is a client-only demo storing users locally. It's not secure for production.
- For production, use a server-based auth flow, secure password hashing (bcrypt/argon2), and secure storage.

Where to improve
- Add input masks and better UX for location (autocomplete using Expo Location / Places APIs).
- Replace demo hash with a proper server-side auth and persistent DB.
