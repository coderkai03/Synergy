const fs = require("fs");
const csv = require("csv-parser");

function parseProfileEmails() {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream('data/profileEmails.csv')
      .pipe(csv())
      .on("data", (row) => {
        // Extract only required fields
        const id = row["id"];
        const fullName = `${row["first_name"] || ""} ${row["last_name"] || ""}`.trim();
        const email = row["primary_email_address"];

        // Ensure email exists before adding to results
        if (id && email) {
          results.push({
            id: id,
            full_name: fullName,
            email: email
          });
        }
      })
      .on("end", () => {
        // Resolve the promise with the results array
        resolve(results);
      })
      .on("error", (error) => {
        // Reject the promise if there is an error
        reject(error);
      });
  });
}

module.exports = { parseProfileEmails };
