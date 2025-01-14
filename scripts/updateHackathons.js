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
  const dateText = $event.find('.event-date').text().trim();
  const startDateMatch = dateText.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?(?:\s*-\s*(?:\w+\s+)?(\d+)(?:st|nd|rd|th)?)?/);
  const month = startDateMatch[1];
  const startDay = startDateMatch[2];
  const date = `2025-${String(new Date(Date.parse(month + ' 1, 2025')).getMonth() + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
  const endDate = $event.find('meta[itemprop="endDate"]').attr('content').split('T')[0]; // Already in yyyy-mm-dd format
  const city = $event.find('span[itemprop="city"]').text();
  const state = $event.find('span[itemprop="state"]').text();
  const location = `${city}, ${state}`;
  const website = $event.find('.event-link').attr('href');
  const image = $event.find('.event-logo img').attr('src').replace('./mlh-spring2025_files/', '');
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
