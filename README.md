# LifeAI - Personal Life Management Dashboard

A modern, cloud-powered personal dashboard application built with React, TypeScript, and Firebase.

## 🌟 Features

- **Task Management** - Create, track, and complete your daily tasks
- **Automations** - Manage automated workflows and processes
- **Stock Tracking** - Follow your favorite stocks
- **Real-time Sync** - Data syncs instantly across all your devices
- **Offline Support** - Works without internet, syncs when reconnected
- **Google Authentication** - Secure sign-in with your Google account

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Vanilla CSS with modern design patterns
- **Routing**: React Router v7
- **Backend**: Firebase (Authentication + Firestore)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Hosting**: Firebase Hosting

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
npm run deploy
```

## 🔥 Firebase Setup

This project uses Firebase for:
- **Authentication**: Google OAuth sign-in
- **Database**: Firestore for cloud data storage
- **Hosting**: Firebase Hosting for deployment

### Database Structure

The app uses three Firestore collections:

1. **tasks** - User to-do items
2. **automations** - Workflow automations
3. **stocks** - Followed stock symbols

Each collection is user-specific and syncs in real-time.

### Important: Security Rules

⚠️ **Before deploying to production**, you must set up Firestore security rules!

See `FIRESTORE_SECURITY_RULES.md` for detailed instructions.

## 📚 Documentation

- **[DATABASE_INTEGRATION_SUMMARY.md](./DATABASE_INTEGRATION_SUMMARY.md)** - Overview of Firebase integration
- **[FIREBASE_DATABASE.md](./FIREBASE_DATABASE.md)** - Detailed database documentation
- **[FIRESTORE_SECURITY_RULES.md](./FIRESTORE_SECURITY_RULES.md)** - Security setup guide
- **[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)** - Authentication configuration
- **[DEPLOY.md](./DEPLOY.md)** - Deployment instructions

## 🎨 Design Philosophy

- **Modern & Premium** - Sleek dark theme with vibrant gradients
- **Glassmorphism** - Frosted glass effects for depth
- **Micro-animations** - Smooth transitions and hover effects
- **Responsive** - Works on all screen sizes
- **Accessible** - Semantic HTML and proper contrast

## 🔐 Authentication

Users sign in with Google OAuth. Once authenticated:
- User data is isolated by `userId`
- Real-time subscriptions are established
- Data syncs across all devices

## 📱 Pages

### Landing Page
- Hero section with call-to-action
- Feature showcase
- Footer with links

### Dashboard
- Overview of key metrics
- Quick actions
- Real-time clock and weather
- Followed stocks display

### Tasks
- Create, complete, and delete tasks
- Real-time updates
- Clean, minimal interface

### Automations
- Manage workflow automations
- Toggle active/paused status
- Visual status indicators

### Stocks
- Add and remove stocks
- View followed stocks
- Integration with dashboard

## 🛠️ Development

### Project Structure

```
lifeai/
├── src/
│   ├── components/      # Reusable components
│   ├── lib/            # Firebase config & database service
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── dist/              # Build output
```

### Key Files

- **`src/lib/firebase.ts`** - Firebase initialization
- **`src/lib/db.ts`** - Database service layer (CRUD operations)
- **`src/App.tsx`** - Routing and authentication logic
- **`src/index.css`** - Global styles and design system

## 🔄 Real-time Features

The app uses Firestore's `onSnapshot` for real-time updates:

```typescript
useEffect(() => {
  if (!user) return;
  
  const unsubscribe = subscribeToTasks(user.uid, (tasks) => {
    setTasks(tasks);
  });
  
  return () => unsubscribe();
}, [user]);
```

Changes appear instantly across all devices without manual refresh.

## 🌐 Deployment

### Deploy to Firebase Hosting

```bash
# Build and deploy
npm run deploy
```

This will:
1. Build the production bundle
2. Deploy to Firebase Hosting
3. Make your app live at: `https://lifeai-f305e.web.app`

See `DEPLOY.md` for detailed deployment instructions.

## 🐛 Troubleshooting

### Data not showing?
- Check that you're signed in
- Verify Firestore security rules are set up
- Check browser console for errors

### Build errors?
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Permission denied errors?
- Set up Firestore security rules (see `FIRESTORE_SECURITY_RULES.md`)
- Ensure you're authenticated

## 📄 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a personal project. Contributions are not currently accepted.

## 📧 Contact

For questions or issues, please contact the project maintainer.

---

Built with ❤️ using React, TypeScript, and Firebase
