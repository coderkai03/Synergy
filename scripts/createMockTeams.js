const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Create mock teams data
const mockTeams = [
  {
    id: "team1",
    name: "Code Crusaders",
    hackathonId: "hack2024",
    teammates: ["test1", "test2", "test3"],
    hostId: "test1",
    requests: []
  },
  {
    id: "team2",
    name: "Binary Bandits", 
    hackathonId: "hack2024",
    teammates: ["test4", "test5"],
    hostId: "test4",
    requests: []
  }
];

// Generate 8 more mock teams programmatically
for (let i = 3; i <= 10; i++) {
  const teamNames = [
    "Tech Titans",
    "Data Dragons",
    "Algorithm Aces",
    "Pixel Pirates",
    "Neural Ninjas",
    "Cloud Champions",
    "DevOps Defenders",
    "Web Warriors"
  ];

  // Generate 2-4 random teammate IDs
  const numTeammates = Math.floor(Math.random() * 3) + 2; // 2-4 teammates
  const teammates = Array.from({length: numTeammates}, (_, index) => 
    `test${Math.floor(Math.random() * 13) + 3}` // Using test3 through test15 from mock users
  );

  // Make sure teammates are unique
  const uniqueTeammates = [...new Set(teammates)];
  
  mockTeams.push({
    id: `team${i}`,
    name: teamNames[i-3],
    hackathonId: "hack2024",
    teammates: uniqueTeammates,
    hostId: uniqueTeammates[0], // First teammate is the host
    requests: []
  });
}

// Upload teams to Firebase
async function uploadTeams() {
  try {
    const batch = db.batch();
    
    mockTeams.forEach((team) => {
      const teamRef = db.collection('testTeams').doc(team.id);
      batch.set(teamRef, team);
    });

    await batch.commit();
    console.log('Successfully uploaded 10 mock teams to Firebase');
    process.exit(0);
  } catch (error) {
    console.error('Error uploading teams:', error);
    process.exit(1);
  }
}

uploadTeams();

