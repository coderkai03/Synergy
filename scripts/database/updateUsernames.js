const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

// Initialize Firebase Admin with service account
const serviceAccount = require('../synergy-2a320-firebase-adminsdk-hwusn-b63b956bff.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

async function updateUsernames() {
  try {
    // Get all users from the users collection
    const usersSnapshot = await db.collection('users').get();

    const batch = db.batch();
    let count = 0;

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.email) {
        // Extract username from email (everything before @)
        const username = userData.email.split('@')[0];
        
        // Update the document with the new username field
        const userRef = db.collection('users').doc(doc.id);
        batch.update(userRef, { username: username });
        count++;
      }
    });

    // Commit the batch
    await batch.commit();
    console.log(`Successfully updated ${count} users with usernames`);

  } catch (error) {
    console.error('Error updating usernames:', error);
  } finally {
    // Exit the process
    process.exit(0);
  }
}

// Run the update
updateUsernames();


