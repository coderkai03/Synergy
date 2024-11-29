import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { clerkClient, createClerkClient } from '@clerk/clerk-sdk-node';

// Initialize both dev and prod Clerk clients
const devClerk = createClerkClient({ 
  secretKey: 'sk_test_YhovjPl5LK4gXmkwCBsa9xiDBq9Z7MGSslMIZ4jSz5' 
});

const prodClerk = createClerkClient({ 
  secretKey: 'sk_live_yyZgT2lmdddXTx0sQReeG84OL0BCDMzmcb2EBigTEv' 
});

// Initialize Firebase
import serviceAccount from "../synergy-2a320-firebase-adminsdk-hwusn-b63b956bff.json" assert { type: "json" };
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();
console.log("Firebase Admin SDK Initialized.");

async function fetchAllUsers(clerk) {
  let allUsers = [];
  let pageNumber = 1;
  
  while (true) {
    const usersPage = await clerk.users.getUserList({
      limit: 100,
      offset: (pageNumber - 1) * 100,
    });
    
    if (usersPage.data.length === 0) break;
    
    allUsers = [...allUsers, ...usersPage.data];
    console.log(`Fetched page ${pageNumber} with ${usersPage.data.length} users`);
    
    if (usersPage.data.length < 100) break;
    pageNumber++;
  }
  
  return allUsers;
}

async function updateFirestoreDocIds() {
  try {
    // Fetch both dev and prod users
    console.log("Fetching dev users from Clerk...");
    const devUsers = await fetchAllUsers(devClerk);
    console.log(`Fetched ${devUsers.length} dev users`);

    console.log("Fetching prod users from Clerk...");
    const prodUsers = await fetchAllUsers(prodClerk);
    console.log(`Fetched ${prodUsers.length} prod users`);

    // Create map of email to prod ID
    const emailToProdIdMap = {};
    prodUsers.forEach((user) => {
      const email = user.emailAddresses[0]?.emailAddress;
      if (email && email === 'audgeviolin07@gmail.com') {
        emailToProdIdMap[email] = user.id;
      }
    });

    // Create map of dev ID to prod ID
    const devToProdIdMap = {};
    devUsers.forEach((devUser) => {
      const email = devUser.emailAddresses[0]?.emailAddress;
      if (email && emailToProdIdMap[email]) {
        devToProdIdMap[devUser.id] = emailToProdIdMap[email];
        console.log(`Mapped dev ID ${devUser.id} to prod ID ${emailToProdIdMap[email]} for email ${email}`);
      }
    });

    // Update Firestore documents
    const usersCollection = db.collection("users");
    const snapshot = await usersCollection.get();
    console.log("Fetched Firestore Documents:", snapshot.docs.length);

    for (const doc of snapshot.docs) {
      const currentId = doc.id; // This should be the dev ID
      const prodId = devToProdIdMap[currentId];
      
      if (prodId) {
        const data = doc.data();
        console.log(`Updating document: ${currentId} -> ${prodId}`);

        // Create new document with prod ID
        await usersCollection.doc(prodId).set(data);
        console.log(`Created new document with prod ID: ${prodId}`);

        // Delete old document with dev ID
        await usersCollection.doc(currentId).delete();
        console.log(`Deleted old document with dev ID: ${currentId}`);
      } else {
        console.warn(`No matching prod ID found for dev ID: ${currentId}`);
      }
    }

    console.log("Firestore document IDs successfully updated.");
  } catch (error) {
    console.error("Error updating Firestore document IDs:", error);
  }
}

// Run the update function
updateFirestoreDocIds();
