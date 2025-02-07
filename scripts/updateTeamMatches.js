const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const createTeam = async (hackathonId, userIds) => {
  try {
    const db = admin.firestore();
    
    // Create new team document data
    const teamData = {
      id: admin.firestore().collection('teams').doc().id, // Generate Firestore ID
      name: "New Team", // Default name that can be changed later
      hackathonId: hackathonId,
      teammates: userIds,
      hostId: userIds[0], // Set first user as host
      requests: []
    };

    // Add new team to Firestore using admin SDK
    await db.collection('teams').doc(teamData.id).set(teamData);

    console.log(`Created new team ${teamData.id} for hackathon ${hackathonId}`);
    return teamData;

  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};

// Get user IDs from match requests and create team
const matchRequestsSnapshot = await admin.firestore().collection('matchRequests').doc(hackathonId).get();
const matchRequestData = matchRequestsSnapshot.data();
const userIds = matchRequestData ? Object.keys(matchRequestData.users || {}) : [];
await createTeam(hackathonId, userIds);

