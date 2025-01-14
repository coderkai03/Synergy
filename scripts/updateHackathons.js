const fs = require('fs');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin with service account
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Read MLH HTML file
const mlhHtml = fs.readFileSync('../mlh-spring2025.txt', 'utf8');
const $ = cheerio.load(mlhHtml);

// Extract hackathon data
const hackathons = [];

$('.event').each((i, element) => {
  const $event = $(element);
  
  const id = $event.attr('class').split(' ')[1].split('-')[1];
  const name = $event.find('.event-name').text();
  const date = $event.find('.event-date').text().trim();
  const endDate = $event.find('meta[itemprop="endDate"]').attr('content');
  const city = $event.find('span[itemprop="city"]').text();
  const state = $event.find('span[itemprop="state"]').text();
  const location = `${city}, ${state}`;
  const website = $event.find('.event-link').attr('href');
  const image = $event.find('.event-logo img').attr('src');
  const isOnline = $event.find('.event-hybrid-notes span').text().trim() === 'Digital Only';

  hackathons.push({
    name,
    date,
    endDate,
    location,
    website,
    image,
    isOnline
  });
});

// Upload to Firestore
async function uploadToFirestore() {
  try {
    const batch = db.batch();
    
    for (const hackathon of hackathons) {
      const docRef = db.collection('hackathons').doc();
      batch.set(docRef, hackathon);
    }

    await batch.commit();
    console.log(`Successfully uploaded ${hackathons.length} hackathons to Firestore`);
  } catch (error) {
    console.error('Error uploading to Firestore:', error);
  }
}

uploadToFirestore();
