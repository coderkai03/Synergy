const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function removeNonUserDocs() {
  try {
    // Get all user docs using admin SDK
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    let deletedCount = 0;

    // Delete docs where id doesn't start with "user"
    const deletePromises = snapshot.docs
      .filter(doc => !doc.id.startsWith('user'))
      .map(async doc => {
        await doc.ref.delete();
        deletedCount++;
      });

    await Promise.all(deletePromises);

    console.log(`Successfully deleted ${deletedCount} non-user documents`);

  } catch (error) {
    console.error('Error removing non-user documents:', error);
  }
}

removeNonUserDocs();
