# Firebase Database Setup

This document explains how user data is stored in Firebase Firestore for the LifeAI application.

## Overview

All user data is now stored in **Firebase Firestore**, a NoSQL cloud database that provides:
- ✅ Real-time synchronization across devices
- ✅ Automatic data persistence
- ✅ User-specific data isolation
- ✅ Offline support
- ✅ Scalable cloud infrastructure

## Data Collections

### 1. Tasks Collection (`tasks`)

Stores user to-do items.

**Schema:**
```typescript
{
  id: string;              // Auto-generated document ID
  text: string;            // Task description
  completed: boolean;      // Task completion status
  userId: string;          // User ID (from Firebase Auth)
  createdAt: Timestamp;    // Creation timestamp
  updatedAt: Timestamp;    // Last update timestamp
}
```

**Security Rules:**
- Users can only read/write their own tasks
- Tasks are filtered by `userId`

### 2. Automations Collection (`automations`)

Stores user automation workflows.

**Schema:**
```typescript
{
  id: string;              // Auto-generated document ID
  name: string;            // Automation name
  description: string;     // Automation description
  status: 'active' | 'paused';  // Current status
  userId: string;          // User ID (from Firebase Auth)
  createdAt: Timestamp;    // Creation timestamp
  updatedAt: Timestamp;    // Last update timestamp
}
```

**Security Rules:**
- Users can only read/write their own automations
- Automations are filtered by `userId`

### 3. Stocks Collection (`stocks`)

Stores user's followed stocks.

**Schema:**
```typescript
{
  id: string;              // Auto-generated document ID
  symbol: string;          // Stock ticker symbol (e.g., "AAPL")
  name: string;            // Company name (e.g., "Apple Inc.")
  userId: string;          // User ID (from Firebase Auth)
  createdAt: Timestamp;    // Creation timestamp
}
```

**Security Rules:**
- Users can only read/write their own stocks
- Stocks are filtered by `userId`

## Database Service Layer

All database operations are handled through `src/lib/db.ts`, which provides:

### Real-time Subscriptions
- `subscribeToTasks(userId, callback)` - Listen to task changes
- `subscribeToAutomations(userId, callback)` - Listen to automation changes
- `subscribeToStocks(userId, callback)` - Listen to stock changes

### CRUD Operations

**Tasks:**
- `addTask(userId, text)` - Create a new task
- `updateTask(taskId, updates)` - Update a task
- `deleteTask(taskId)` - Delete a task

**Automations:**
- `addAutomation(userId, name, description, status)` - Create automation
- `updateAutomation(automationId, updates)` - Update automation
- `deleteAutomation(automationId)` - Delete automation

**Stocks:**
- `addStock(userId, symbol, name)` - Add a stock
- `deleteStock(stockId)` - Remove a stock

## How It Works

### 1. User Authentication
When a user signs in with Google (via Firebase Auth), they receive a unique `userId`.

### 2. Data Storage
All data is stored in Firestore with the user's `userId` attached, ensuring data isolation between users.

### 3. Real-time Sync
The app uses Firestore's `onSnapshot` listeners to receive real-time updates:
- When you add a task on one device, it instantly appears on all your devices
- Changes made by the user are immediately reflected in the UI
- No manual refresh needed

### 4. Offline Support
Firestore automatically caches data locally, so the app works offline and syncs when reconnected.

## Firebase Console

To view and manage your data:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `lifeai-f305e`
3. Navigate to **Firestore Database** in the left sidebar
4. You'll see three collections: `tasks`, `automations`, and `stocks`

## Security Rules (To Be Configured)

You should set up Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tasks collection
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.auth.uid == request.resource.data.userId;
    }
    
    // Automations collection
    match /automations/{automationId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.auth.uid == request.resource.data.userId;
    }
    
    // Stocks collection
    match /stocks/{stockId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                     request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Migration from localStorage

Previously, stocks were stored in `localStorage`. This has been migrated to Firestore:
- **Before:** Data only available on one device
- **After:** Data syncs across all devices in real-time

## Benefits

1. **Multi-device sync** - Access your data from any device
2. **Data persistence** - Never lose your data
3. **Real-time updates** - See changes instantly
4. **Scalability** - Handles millions of users
5. **Security** - User data is isolated and protected
6. **Offline support** - Works without internet connection

## Next Steps

1. **Set up Firestore Security Rules** in the Firebase Console
2. **Enable offline persistence** (optional, for better offline support)
3. **Add data validation** (optional, for data integrity)
4. **Set up indexes** (if you need complex queries)

## Troubleshooting

### Data not showing up?
- Check that the user is authenticated (`auth.currentUser` is not null)
- Verify the `userId` matches in the database
- Check browser console for errors

### Real-time updates not working?
- Ensure you're subscribed to the collection
- Check that the component unmounts properly (cleanup function)
- Verify Firebase configuration is correct

### Permission denied errors?
- Set up Firestore security rules (see above)
- Ensure user is authenticated before accessing data
