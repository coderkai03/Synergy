const { getFirestore, collection, doc, getDocs, getDoc } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = getFirestore();

async function fetchMatchRequestsWithUsers() {
  try {
    // Get match requests where any user's timestamp is after January 27, 2025 at 12:32:56 PM UTC-8
    const matchRequestDocRef = db.collection('matchRequests').doc('7d5JhR9Jt8reVaScmqFj');
    const matchRequestDoc = await matchRequestDocRef.get();
    console.log(matchRequestDoc.data());

    if (!matchRequestDoc.exists) {
      throw new Error('Match request not found');
    }

    const matchRequests = matchRequestDoc.data() || [];
    const mrUsers = matchRequests.users || [];
    console.log('matchRequests:', matchRequests);
    const matchRequestIds = Object.keys(mrUsers).filter(request => {
      console.log('request:', request, 'vs user_2s3WwoJm5NvJ7M4Am6LC6Kepl5W');
      if (request >= 'user_2s3WwoJm5NvJ7M4Am6LC6Kepl5W') {
        console.log('request found:', request);
        return request;
      }
    });
    console.log(matchRequestIds);

    if (!matchRequestIds.length) {
      throw new Error('No match requests found after the specified date');
    }

    // Fetch user data for each user ID
    const users = await Promise.all(
      matchRequestIds.map(async (userId) => {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
          return null;
        }

        return {
          id: userId,
          ...userDoc.data()
        };
      })
    );

    console.log(users);
    // Write results to match-requests.json
    const fs = require('fs');
    fs.writeFileSync('match-requests.json', JSON.stringify({
      users: users
    }, null, 2));

  } catch (error) {
    console.error('Error fetching match request with users:', error);
  }
}

fetchMatchRequestsWithUsers();