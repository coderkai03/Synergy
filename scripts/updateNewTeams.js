const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const teamsData = require('./devfestTeams.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = getFirestore();

async function uploadTeams() {
  try {
    const teams = teamsData.teams;
    
    for (const team of teams) {
      // Create a new document in the teams collection
      const teamRef = db.collection('teams').doc();
      
      // Upload the team data
      await teamRef.set({
        id: teamRef.id,
        hackathonId: team.hackathon_id,
        hostId: team.hostId,
        name: team.name,
        teammates: team.teammates,
        requests: team.requests
      });

      console.log(`Successfully uploaded team: ${team.name}`);
    }

    console.log('All teams uploaded successfully');

  } catch (error) {
    console.error('Error uploading teams:', error);
  }
}

uploadTeams();
