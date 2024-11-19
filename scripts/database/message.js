import { clerkClient, createClerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';
import fs from 'fs';
import csv from 'csv-parser';
import crypto from 'crypto';
import path from 'path';

dotenv.config();

async function checkEmailExists(clerk, email) {
  try {
    const users = await clerk.users.getUserList({
      emailAddress: email,
    });
    return users.length > 0;
  } catch (error) {
    console.error(`Error checking email ${email}:`, error.message);
    return false;
  }
}

async function migrateUsersFromCSV(csvFilePath, secretKey) {
  const clerk = secretKey ? 
    createClerkClient({ secretKey }) : 
    clerkClient;

  const users = [];
  const results = {
    successful: 0,
    failed: [],
    skipped: [], // Track skipped users due to existing email
    passwords: []
  };

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const userId = row.id;
        const firstName = row.first_name;
        const lastName = row.last_name;
        const email = row.primary_email_address;

        if (userId && email) {
          const randomPassword = crypto.randomBytes(12).toString('hex');
          users.push({
            id: userId,
            emailAddress: [email],
            password: randomPassword,
            firstName,
            lastName,
          });
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      })
      .on('end', async () => {
        console.log(`Processing ${users.length} users from CSV...`);

        for (const user of users) {
          try {
            // Check if email already exists
            const emailExists = await checkEmailExists(clerk, user.emailAddress[0]);
            
            if (emailExists) {
              results.skipped.push({
                userId: user.id,
                email: user.emailAddress[0],
                reason: 'Email already exists'
              });
              console.log(`Skipped user: ${user.emailAddress[0]} (email already exists)`);
              continue;
            }

            // Create user if email doesn't exist
            const createdUser = await clerk.users.createUser({
              id: user.id,
              emailAddress: user.emailAddress,
              password: user.password,
              firstName: user.firstName,
              lastName: user.lastName,
            });

            results.successful++;
            results.passwords.push({
              email: user.emailAddress[0],
              password: user.password
            });

            console.log(`User created: ${user.emailAddress[0]}, Temporary Password: ${user.password}`);

          } catch (error) {
            results.failed.push({
              userId: user.id,
              email: user.emailAddress[0],
              error: error.message || 'Unknown error'
            });
            console.error(`Error creating user for ${user.emailAddress[0]}:`, error.message);
          }

          // Add a small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 400));
        }

        // Save results to files
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Save failed migrations
        if (results.failed.length > 0) {
          await fs.promises.writeFile(
            `failed_migrations_${timestamp}.json`,
            JSON.stringify(results.failed, null, 2)
          );
          console.log(`Failed migrations saved to failed_migrations_${timestamp}.json`);
        }

        // Save skipped users
        if (results.skipped.length > 0) {
          await fs.promises.writeFile(
            `skipped_users_${timestamp}.json`,
            JSON.stringify(results.skipped, null, 2)
          );
          console.log(`Skipped users saved to skipped_users_${timestamp}.json`);
        }

        // Save passwords (for admin reference)
        if (results.passwords.length > 0) {
          await fs.promises.writeFile(
            `user_passwords_${timestamp}.json`,
            JSON.stringify(results.passwords, null, 2)
          );
          console.log(`User passwords saved to user_passwords_${timestamp}.json`);
        }

        // Print summary
        console.log('\nMigration Summary:');
        console.log(`Successfully migrated: ${results.successful}`);
        console.log(`Skipped (existing emails): ${results.skipped.length}`);
        console.log(`Failed migrations: ${results.failed.length}`);

        resolve(results);
      });
  });
}

async function main() {
  // You can either set CLERK_SECRET_KEY in your environment
  // or pass it directly to createClerkClient
  const secretKey = 'sk_live_yyZgT2lmdddXTx0sQReeG84OL0BCDMzmcb2EBigTEv';
  const csvFilePath = "../data/clerkAccounts.csv" || path.join(process.cwd(), 'clerkAccounts.csv');

  if (!secretKey) {
    throw new Error('Missing CLERK_SECRET_KEY in environment variables');
  }

  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`CSV file not found at: ${csvFilePath}`);
  }

  try {
    await migrateUsersFromCSV(csvFilePath, secretKey);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Add error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

// Run the migration
main();