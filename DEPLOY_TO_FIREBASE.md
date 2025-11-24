# How to Host Your App on Firebase

Since you already have a Firebase project, hosting is very easy!

## Step 1: Install the Firebase CLI
Open a new terminal (or stop the current one with `Ctrl+C`) and run:
```bash
npm install -g firebase-tools
```
*Note: If this fails with permission errors, you might need to run it as Administrator.*

## Step 2: Login
Link your computer to your Firebase account:
```bash
firebase login
```
This will open your browser. Log in with the same Google account you used to create the project.

## Step 3: Initialize (Connect Project)
Run this command to set up the project locally:
```bash
firebase init hosting
```
1.  It will ask **"Are you ready to proceed?"** -> Type `y` and Enter.
2.  **"Please select an option"** -> Choose **"Use an existing project"**.
3.  Select your project: `lifeai-f305e` (from the list).
4.  **"What do you want to use as your public directory?"** -> Type `dist` and Enter. (Important! Vite builds to `dist`).
5.  **"Configure as a single-page app?"** -> Type `y` and Enter.
6.  **"Set up automatic builds and deploys with GitHub?"** -> Type `n` (unless you want that).
7.  **"File dist/index.html already exists. Overwrite?"** -> Type `n` (No).

## Step 4: Build and Deploy
Now, build your latest code and send it to the internet:

```bash
npm run build
firebase deploy
```

## Done!
The terminal will give you a **Hosting URL** (like `https://lifeai-f305e.web.app`). Click it to see your live site!
