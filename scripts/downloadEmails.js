const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

// Initialize Firebase Admin with service account
const serviceAccount = require('../serviceAccount.json');
const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

async function downloadEmails() {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const emails = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.email) {
        //emails.push(userData.email);
        console.log(doc.id, userData.email);
      }
    });

    // Write emails to file
    //fs.writeFileSync('emails.txt', emails.join('\n'));
    console.log(`Successfully downloaded ${emails.length} emails to emails.txt`);

  } catch (error) {
    console.error('Error downloading emails:', error);
  }
}

downloadEmails();
