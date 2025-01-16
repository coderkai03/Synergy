const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateHackathonImages() {
  try {
    // Read the JSON file containing image data
    const imageData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../exact300x300.json'), 'utf8')
    );

    // Create map of hackathon names to image URLs
    const imageMap = imageData.reduce((acc, item) => {
      acc[item.hackathonName] = item.src;
      return acc;
    }, {});

    // Get all hackathons
    const hackathonsSnapshot = await db.collection('hackathons').get();

    const updatePromises = hackathonsSnapshot.docs.map(async (doc) => {
      const hackathonData = doc.data();
      const matchingImage = imageMap[hackathonData.name];

      if (matchingImage) {
        // Update the document with matching image URL
        return doc.ref.update({
          image: matchingImage
        });
      }
      return Promise.resolve(); // Skip if no matching image
    });

    await Promise.all(updatePromises);
    console.log('Successfully updated hackathon images');

  } catch (error) {
    console.error('Error updating hackathon images:', error);
  } finally {
    // Terminate the Firebase Admin app
    admin.app().delete();
  }
}

// Run the update function
updateHackathonImages();
