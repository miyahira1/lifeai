# How to Enable Real Google Authentication (Firebase)

Currently, the login page is just a visual interface. To make it work, we recommend using **Firebase Authentication**. It's free, secure, and easy to integrate with React.

Follow these steps to set it up:

## Phase 1: Set up Firebase (You need to do this)

1.  **Go to the Firebase Console**:
    *   Visit [console.firebase.google.com](https://console.firebase.google.com/) and sign in.

2.  **Create a Project**:
    *   Click **"Add project"** (or "Create a project").
    *   Name it `lifeai` (or whatever you prefer).
    *   You can disable Google Analytics for now to make setup faster.

3.  **Register your App**:
    *   Click the **Web icon** (`</>`) on the project overview page.
    *   Nickname: `LifeAI Web`.
    *   Click **Register app**.

4.  **Get your Config**:
    *   Firebase will show you a code block with `firebaseConfig`.
    *   **COPY this config object**. You will need to give this to me (or add it to your environment variables).

5.  **Enable Google Authentication**:
    *   Go to **Build** > **Authentication** in the left sidebar.
    *   Click **Get Started**.
    *   Select the **Sign-in method** tab.
    *   Click **Google**.
    *   Toggle **Enable**.
    *   Select a **Project support email**.
    *   Click **Save**.

## Phase 2: Connect Code (I can do this for you)

Once you have the configuration from Step 4, just paste it in the chat!

I will then:
1.  Install the Firebase SDK: `npm install firebase`
2.  Create a `firebase.ts` file to initialize the app.
3.  Update `Login.tsx` to actually sign the user in.
4.  Add a user state listener to update the UI when logged in.

### Example of what I need from you:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "lifeai-12345.firebaseapp.com",
  projectId: "lifeai-12345",
  storageBucket: "lifeai-12345.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```
