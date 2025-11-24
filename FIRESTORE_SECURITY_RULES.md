# Setting Up Firestore Security Rules

Follow these steps to secure your Firestore database:

## Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **lifeai-f305e**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top

## Step 2: Update Security Rules

Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read, update, delete: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
                     request.resource.data.userId == request.auth.uid;
    }
    
    // Automations collection
    match /automations/{automationId} {
      allow read, update, delete: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
                     request.resource.data.userId == request.auth.uid;
    }
    
    // Stocks collection
    match /stocks/{stockId} {
      allow read, update, delete: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && 
                     request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Step 3: Publish Rules

1. Click the **Publish** button
2. Wait for the confirmation message

## What These Rules Do

### Security Features:
- ✅ **Authentication Required**: Only signed-in users can access data
- ✅ **User Isolation**: Users can only access their own data
- ✅ **Create Protection**: New documents must have the correct userId
- ✅ **Read/Write Protection**: Users can only modify their own documents

### Rule Breakdown:

**Read Operations:**
- Users can only read documents where `userId` matches their auth ID

**Create Operations:**
- Users must be authenticated
- The `userId` field must match the authenticated user's ID

**Update/Delete Operations:**
- Users can only update/delete their own documents

## Testing the Rules

### In Firebase Console:
1. Go to the **Rules** tab
2. Click **Rules Playground** at the top
3. Test different scenarios:
   - Authenticated user reading their own data ✅
   - Authenticated user reading someone else's data ❌
   - Unauthenticated user accessing data ❌

### In Your App:
1. Sign in with Google
2. Create some tasks, automations, or stocks
3. Check the browser console for any permission errors
4. Try accessing data - it should work seamlessly

## Common Issues

### "Missing or insufficient permissions" error
- **Cause**: Security rules are blocking the request
- **Solution**: Make sure you're signed in and the `userId` matches

### Rules not taking effect
- **Cause**: Rules haven't been published or cached
- **Solution**: Click Publish and wait a few seconds

### Can't create documents
- **Cause**: The `userId` field is missing or incorrect
- **Solution**: Check that your code includes `userId: user.uid` when creating documents

## Production Considerations

For production, consider adding:

1. **Data Validation**:
   ```javascript
   // Example: Validate task text length
   allow create: if isAuthenticated() && 
                  request.resource.data.userId == request.auth.uid &&
                  request.resource.data.text.size() > 0 &&
                  request.resource.data.text.size() < 500;
   ```

2. **Rate Limiting**: Use Firebase App Check to prevent abuse

3. **Indexes**: Create indexes for frequently queried fields

4. **Backup Rules**: Keep a copy of your rules in version control

## Next Steps

After setting up security rules:
1. ✅ Test the app thoroughly
2. ✅ Monitor usage in Firebase Console
3. ✅ Set up billing alerts
4. ✅ Enable Firebase App Check for additional security

## Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Testing](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Best Practices](https://firebase.google.com/docs/firestore/security/rules-conditions)
