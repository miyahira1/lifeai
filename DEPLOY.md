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
Whenever you want to publish a new version of your app to the internet:

1.  Run this single command:
    ```bash
    npm run deploy
    ```

### Manual Deployment Steps
If you prefer to run the steps manually:
1.  Build the project: `npm run build`
2.  Upload to Firebase: `firebase deploy`

### 🔧 Troubleshooting
If you deploy but don't see your changes immediately, your browser might be showing a cached version.

**Try a Hard Refresh:**
*   **Windows / Linux:** Press `Ctrl` + `F5` (or `Ctrl` + `Shift` + `R`)
*   **Mac:** Press `Cmd` + `Shift` + `R`
