const admin = require('firebase-admin');
const serviceAccount = {
  type: "service_account",
  project_id: "synergy-443009",
  private_key_id: "50494297c5615f8ea9f59171174c88ec009cdee9",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHqezFe4g0XunC\n0E4cNF8jVGtrL+3uBtpLgIKGBuBS/LIXf+ZttL5NckSVX9GkSsN/Btg3S0AhAQ9a\n+lGANYbh60u7Q93lPX4cTHRbvkhtnZ/trfkjLEjDUEQ/tKnfGfyNsf9tWVtqT2FA\nHX8hxdsFVDCC0IcFC0cBMRMdBpr1YH4RfWpK9jvVqP9Xs3iiaeq4zjJ4SM74QFKB\nebhaW7NqeQ1E25iPfZYa6DTCRVMiJ9Br3CTmKrBqtpQJ6J6Ff9rsFTljP2KJawhF\nNAU6VkxcBBA1pu6n3+BWW7TvNdDe8FM9fLq0gRybkPo+IVrZZ727l1vKuMeA16Di\n+hLdXNZlAgMBAAECggEALJlRUR9x4jjdQG3lNLmiErM1t2CiZgvT0Q+omCWLEB5v\n7X3dS94WsBf5J+CaZHdqycIOo/NEJNsmweyuLdRHB8nWRcM4Go+szsdpKmELrqiJ\n4757qxamPjJ8vDovw6z7U+9Rnexa1hlbIMY18qZOcRdIKsBHmKHXP3XlzhL+pBZ/\ngMLUshs5J+rKG1uCT5u/Re7fEOusfzgJ55fwxO1A3d/WXbOWfM9bBszyIs8O8kr5\nziIbb25PuaqkiOgnPbeqgTiQvIwjfBeHpxh5ZGyrnvDxu0iqfWpvsKzBl3v0q3gL\nN9qT1Y6s+xhKwNOMA5jkD3mqKet1dUrKxDP24B1n9QKBgQDwd9ErAjxwKtOtuh8k\nJk0XxJvzDUevwRYiwDKUOWItxnY0TtIqXESOzCqWtdTFMjbH4OHuhRCAZJqGVFP2\nNlLXTXBNsQBMVUpnw7TPMOjHGZXwmt1GKWuOOJYZARnYviuvGWiT1ZjoDvaqr7rG\nVJH+PZ59UNwRSbVY7XtoK4czXwKBgQDUj2bdvV54mV07Q49wdnsIDTfp6FeSsAMD\nJpX8bzapfOWNOwsfmqoNpx+H+849S84OfJqrB3utiENKxCLCMW5g72aCKDO4Ilel\nsE8PMuPAwkWKZaLbd/w7ZeZyLuQYCQrk4a6f6sWs64C6qlKzGiCwJiwLO+AdgEem\novVV91ewuwKBgFd7H2tIGvire+q9xUp/bJhy/FEFyciUtBrcVQo7fg4tHx+UdTzX\n6FES0YOWjttWkztQAqGlYwVylAy+bPUreiO9lleNRxB+Dt2FAyhFIMod8sBfdpRp\nySkqSOC7181UEcxXsAXoNQJnPzGFUKuKZLpbbGcmnYjkicbaToTtIPh9AoGBAJYt\nZxEdPUTZnkxD1HEx1IUAydNiS5Ug9E/ikC+U57rhulGJOLewj5sry5RI7RLTnxcP\nJDvYAqK9VkXZw3EOeZzVJ8in3Lqo0OIIaiMj4lQLLhS08FY9NKFGwoVD6fWtVdwW\nM0lbFySwEvhPZDSULiomHhIl0JcnTfhGxC1jnroHAoGABCAU9rtAm4MAFIrHdBNe\nyhyhDEG88dU62RJAqa6lq6F7M1LaBcV6iRI+DAbxrv5p7lt1/5jdCe8GruA2ElDq\nG3nZM0qtuhD5YxgQZvC5sFhE2psebdrwv6UrGqv8FBz/o/Cn2DYeLa+JveCVaeIR\nOvKQsMWOzg2jkaMWesVQ4bA=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-ca10i@synergy-443009.iam.gserviceaccount.com",
  client_id: "117522276945836173417",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ca10i%40synergy-443009.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function updateHackathonGracePeriods() {
  try {
    // Get all hackathons
    const hackathonsRef = db.collection('hackathons');
    const snapshot = await hackathonsRef.get();

    // Update each hackathon
    const updatePromises = snapshot.docs.map(doc => {
      return doc.ref.update({
        grace_period: true
      });
    });

    await Promise.all(updatePromises);
    console.log('Successfully updated grace period for all hackathons');

  } catch (error) {
    console.error('Error updating hackathon grace periods:', error);
  } finally {
    // Exit the process when done
    process.exit(0);
  }
}

updateHackathonGracePeriods();
