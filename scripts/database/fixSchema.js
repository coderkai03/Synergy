const admin = require('firebase-admin');

const serviceAccount = require("../synergy-2a320-firebase-adminsdk-hwusn-b63b956bff.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function correctSchema() {
  const usersSnapshot = await db.collection('users').get();
  
  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data();
    let updatedData = {};
    let requiresUpdate = false;

    //test on rian first
    if (userData.name === 'Rian Corcino') {
        continue
    }

    // Check if product_management, software, hardware, and uiux_design are outside role_experience
    const roleFields = ['product_management', 'software', 'hardware', 'uiux_design'];
    let roleExperience = userData.role_experience || {};

    for (const field of roleFields) {
      if (userData.hasOwnProperty(field)) {
        // Move field to role_experience map
        roleExperience[field] = userData[field];
        // Delete field from top-level
        updatedData[field] = admin.firestore.FieldValue.delete();
        requiresUpdate = true;
      }
    }

    // If there were fields to update, set role_experience
    if (requiresUpdate) {
      updatedData.role_experience = roleExperience;
      // Update the document with the corrected schema
      await userDoc.ref.update(updatedData);
      console.log(`Updated schema for user: ${userDoc.id}`);
    }
  }
  console.log("Schema correction completed.");
}

correctSchema().catch(console.error);
