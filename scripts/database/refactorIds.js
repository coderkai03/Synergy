import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { clerkClient, createClerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const key = 'sk_live_yyZgT2lmdddXTx0sQReeG84OL0BCDMzmcb2EBigTEv';
console.log("Clerk Secret Key Loaded:", key);
const clerk = key ? 
    createClerkClient({ key }) : 
    clerkClient

// Initialize Firebase Admin SDK
import serviceAccount from "../synergy-2a320-firebase-adminsdk-hwusn-b63b956bff.json" assert { type: "json" };
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();
console.log("Firebase Admin SDK Initialized.");

// Fetch Clerk Production User Data and Update Firestore
async function updateFirestoreDocIds() {
  try {
    console.log("Fetching users from Clerk...");
    // Fetch all users from Clerk production
    let clerkUsers;
    try {
      clerkUsers = await clerk.users.getUserList();
      console.log("Fetched Clerk Users:", clerkUsers.length);
    } catch (error) {
      console.error("Error fetching users from Clerk:", error.message);
      throw error; // Re-throw to be caught by outer try-catch
    }

    const emailToProdIdMap = {};

    // Map emails to production user IDs
    clerkUsers.forEach((user) => {
      const email = user.primaryEmailAddress;
      const prodId = user.id;
      console.log(`Processing user: ${email} -> ${prodId}`);

      if (email && email === 'riancorci@gmail.com') {
        console.log(`Found matching email ${email} with production ID ${prodId}`);
        emailToProdIdMap[email] = prodId;
      }
    });

    console.log("Email to Production ID Map:", emailToProdIdMap);

    // Get all Firestore documents from the collection where user data is stored
    const usersCollection = db.collection("users"); // Adjust the collection name as needed
    const snapshot = await usersCollection.get();
    console.log("Fetched Firestore Documents:", snapshot.docs.length);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const email = data.email;

      // Check if the user's email exists in the Clerk map
      if (emailToProdIdMap[email]) {
        const newProdId = emailToProdIdMap[email];
        const oldData = data;

        // Create a new document with the production ID
        await usersCollection.doc(newProdId).set(oldData);
        console.log(`Document created for new production ID: ${newProdId}`);

        // Delete the old document
        await usersCollection.doc(doc.id).delete();
        console.log(`Document deleted: ${doc.id}`);

        console.log(`Document updated: ${email} -> ${newProdId}`);
      } else {
        console.warn(`No matching Clerk production user for email: ${email}`);
      }
    }

    console.log("Firestore document IDs successfully updated.");
  } catch (error) {
    console.error("Error updating Firestore document IDs:", error);
  }
}

// Run the update function
updateFirestoreDocIds();
