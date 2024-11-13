const fs = require("fs");
const csv = require("csv-parser");

// Helper function to count the number of filled fields in an entry
const countFilledFields = (entry) => {
  return Object.values(entry).reduce((count, field) => {
    return field && field.toString().trim() !== "" ? count + 1 : count;
  }, 0);
};

// Function to process the CSV file and return the most accurate entries as a promise
function filterMostAccurateEntries() {
  return new Promise((resolve, reject) => {
    const records = {};

    fs.createReadStream('data/profileData.csv')
      .pipe(csv())
      .on("data", (row) => {
        // Use a unique key for each person, combining Name and Phone Number (or other identifiers as needed)
        const key = `${row["name"]}_${row["phone"]}`;

        // Convert comma-separated strings to arrays for specified fields
        const fieldsToConvert = [
          "programming_languages",
          "frameworks_and_tools",
          "focus_experience"
        ];
        fieldsToConvert.forEach((field) => {
          if (row[field] && typeof row[field] === "string" && row[field].includes(",")) {
            row[field] = row[field].split(",").map((item) => item.trim());
          }
        });

        // Count filled fields for the current row
        const filledFieldsCount = countFilledFields(row);

        // Check if we have an existing record for this key and compare filled fields
        if (!records[key] || filledFieldsCount > records[key].filledFieldsCount) {
          records[key] = {
            data: row,
            filledFieldsCount: filledFieldsCount,
          };
        }
      })
      .on("end", () => {
        // Collect only the most accurate entries and resolve the promise
        const mostAccurateEntries = Object.values(records)
          .filter(record => record.data.name !== 'name')
          .map((record) => record.data);

        resolve(mostAccurateEntries); // Resolve the data as a JSON object
      })
      .on("error", (error) => {
        reject(error); // Reject the promise in case of an error
      });
  });
}

module.exports = { filterMostAccurateEntries };
