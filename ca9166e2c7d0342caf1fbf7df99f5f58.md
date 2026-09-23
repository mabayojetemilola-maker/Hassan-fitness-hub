# Hassan Fitness — React + Firebase

This is the React version of the Hassan Fitness HTML app.

## Setup

1. Install Node.js.
2. In this folder run:
   `npm install`
3. Create a file named `.env.local` and copy the variables from `.env.example`.
4. Put the Firebase Web App configuration values into `.env.local`.
5. Run:
   `npm run dev`

## Firebase

Authentication providers:
- Email/Password
- Google

Also create a Firestore database and publish `firestore.rules`.

The app stores each signed-in user's profile, weight history, workout history, streak, and totals under:
`users/{userId}`

## Vercel

Push the project to GitHub, import it into Vercel, and add the same `VITE_FIREBASE_*` values under Vercel Project Settings → Environment Variables.
