const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK with the service account
const serviceAccount = require('../serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Function to clean the data object by removing internal fields
const cleanData = (obj) => {
  const cleaned = { ...obj };
  delete cleaned.__collections__;
  return cleaned;
};

// Function to import data into Firestore
const importData = async () => {
  try {
    console.log('Reading backup file...');
    const backupData = JSON.parse(fs.readFileSync('../backup.json', 'utf8'));
    
    // Get the collections from the nested structure
    const collections = backupData.__collections__ || {};
    console.log('Collections found:', Object.keys(collections));
    
    let batch = db.batch();
    let operationCount = 0;
    const MAX_BATCH_SIZE = 500;

    // Process each collection
    for (const [collectionName, documents] of Object.entries(collections)) {
      console.log(`Processing collection: ${collectionName}`);
      console.log(`Number of documents: ${Object.keys(documents).length}`);

      // Process each document in the collection
      for (const [docId, docData] of Object.entries(documents)) {
        console.log(`Processing document: ${docId}`);
        
        // Skip if docData is null or contains only internal fields
        if (!docData || Object.keys(cleanData(docData)).length === 0) {
          console.log(`Skipping empty document: ${docId}`);
          continue;
        }

        const cleanedData = cleanData(docData);
        console.log(`Adding document ${docId} to batch`);

        const docRef = db.collection(collectionName).doc(docId);
        batch.set(docRef, cleanedData);
        operationCount++;

        // If batch is full, commit it and start a new one
        if (operationCount >= MAX_BATCH_SIZE) {
          console.log(`Committing batch of ${operationCount} operations...`);
          await batch.commit();
          operationCount = 0;
          batch = db.batch();
        }
      }
    }

    // Commit any remaining operations
    if (operationCount > 0) {
      console.log(`Committing final batch of ${operationCount} operations...`);
      await batch.commit();
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
    console.error('Error details:', error.stack);
    throw error;
  }
};

// Run the import
importData()
  .then(() => {
    console.log('Import process completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  });
