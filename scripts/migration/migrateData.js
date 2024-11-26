const fs = require("fs");
const csv = require("csv-parser");
const admin = require("firebase-admin");
const { parseProfileEmails } = require("./filterClerkData");
const { filterMostAccurateEntries } = require("./filterProfileData");

// Firebase Admin SDK setup
const serviceAccount = require("./synergy-2a320-firebase-adminsdk-hwusn-b63b956bff.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Fields to store as arrays
const fieldsToConvertToArray = ["programming_languages", "frameworks_and_tools", "focus_experience"];

// Combine entries by full_name
function combineEntriesByFullName(entries) {
  const combinedData = {};

  entries.forEach((entry) => {
    const fullName = entry.full_name || entry.name; // Use `full_name` from `parseProfileEmails` or `name` from `filterMostAccurateEntries`

    if (!combinedData[fullName]) {
      combinedData[fullName] = { ...entry }; // Initialize with the first entry
    } else {
      // Merge fields by adding any non-empty values from new entries
      Object.keys(entry).forEach((key) => {
        // Exclude timestamp fields
        if (key.toLowerCase().includes("timestamp")) return;

        // Convert specific fields to arrays if they are not already
        if (fieldsToConvertToArray.includes(key)) {
          // Initialize as an array if not already an array
          combinedData[fullName][key] = combinedData[fullName][key] || [];
          
          // Convert string to array if necessary and merge
          const newArray = Array.isArray(entry[key])
            ? entry[key]
            : entry[key].split(",").map((item) => item.trim());

          combinedData[fullName][key] = [
            ...combinedData[fullName][key],
            ...newArray.filter((item) => !combinedData[fullName][key].includes(item)),
          ];
        } else if (Array.isArray(entry[key])) {
          // Merge arrays without duplicates for other array fields
          combinedData[fullName][key] = combinedData[fullName][key] || [];
          combinedData[fullName][key] = [
            ...combinedData[fullName][key],
            ...entry[key].filter((item) => !combinedData[fullName][key].includes(item)),
          ];
        } else if (entry[key] && !combinedData[fullName][key]) {
          // Add non-empty values for non-array fields
          combinedData[fullName][key] = entry[key];
        }
      });
    }
  });

  return Object.values(combinedData);
}

// Parse emails and accurate profile data, then combine by full_name
async function processAndCombineData() {
  try {
    const profileEmails = await parseProfileEmails();
    const mostAccurateEntries = await filterMostAccurateEntries();

    // Combine both data sets by name
    const combinedData = combineEntriesByFullName([...profileEmails, ...mostAccurateEntries]);
    console.log(profileEmails.map(entry => entry.email))

    console.log("Uploading data to Firestore...");

    // // Upload combined data to Firestore
    // for (const user of combinedData) {
    //   const userId = user.id; // Save the document ID as the user ID
    //   delete user.id; // Remove the id field from the actual document data

    //   try {
    //     await db.collection("users").doc(userId).set(user);
    //     console.log(`Uploaded user ${userId} to Firestore.`);
    //   } catch (error) {
    //     console.error(`Error uploading user ${userId}:`, error);
    //   }
    // }

    console.log("All data has been uploaded to Firestore.");
  } catch (error) {
    console.error("Error processing data:", error);
  }
}

processAndCombineData();
