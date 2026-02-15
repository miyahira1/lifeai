"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledFunction = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// This function runs every day at 00:00 (midnight).
// You can change the schedule using crontab syntax or natural language.
// Note: Scheduled functions require the Blaze (pay-as-you-go) plan,
// but you get a generous free tier (3 jobs/account are free).
exports.scheduledFunction = functions.pubsub.schedule("every day 00:00")
    .timeZone("America/New_York") // Users can change this to their timezone
    .onRun((context) => {
    console.log("This will be run every day at 00:00 AM Eastern Time!");
    // Add your logic here (e.g., database cleanup, sending emails, etc.)
    return null;
});
//# sourceMappingURL=index.js.map