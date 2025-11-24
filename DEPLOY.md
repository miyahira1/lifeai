# Project Guide

## 🔗 Important Links
*   **GitHub Repository:** [https://github.com/miyahira1/lifeai](https://github.com/miyahira1/lifeai)
*   **Firebase Console:** [https://console.firebase.google.com/project/lifeai-f305e/overview](https://console.firebase.google.com/project/lifeai-f305e/overview)
*   **Live App:** [https://lifeai-f305e.web.app/](https://lifeai-f305e.web.app/)

---

## 💻 Run Locally (Development)
To work on the app on your computer and see changes in real-time:

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser to: **[http://localhost:5173](http://localhost:5173)**

---

## 🚀 Deploy (Public)

### Automatic Deployment (Recommended)
Your app is configured to **automatically deploy** when you push to GitHub:

1.  Commit your changes:
    ```bash
    git add .
    git commit -m "Your commit message"
    ```
2.  Push to GitHub:
    ```bash
    git push origin main
    ```
3.  **GitHub Actions will automatically build and deploy** your app to Firebase!
4.  Check the deployment status at: [GitHub Actions](https://github.com/miyahira1/lifeai/actions)

### Manual Deployment
If you prefer to deploy manually without pushing to GitHub:

```bash
npm run deploy
```

### Manual Steps (if you prefer):
1.  Build the project: `npm run build`
2.  Upload to Firebase: `firebase deploy`

---

## 🔧 Troubleshooting
If you deploy but don't see your changes immediately, your browser might be showing a cached version.

**Try a Hard Refresh:**
*   **Windows / Linux:** Press `Ctrl` + `F5` (or `Ctrl` + `Shift` + `R`)
*   **Mac:** Press `Cmd` + `Shift` + `R`
