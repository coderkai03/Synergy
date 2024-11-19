import { Clerk } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import crypto from 'crypto';

const NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

// Initialize Clerk client
const clerkClient = clerk.default({
  secretKey: CLERK_SECRET_KEY,
  publishableKey: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
});

export async function POST() {
  const filePath = '../data/clerkAccounts.csv'; // Update to your CSV file path

  try {
    const users = [];

    // Read CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        const userId = row.id;
        const firstName = row.first_name;
        const lastName = row.last_name;
        const email = row.primary_email_address;

        if (userId && email) {
          const randomPassword = crypto.randomBytes(12).toString('hex'); // Generate a strong random password
          users.push({
            id: userId, // Reuse userId from CSV
            emailAddress: [email],
            password: randomPassword,
            firstName,
            lastName,
          });
        }
      })
      .on('end', async () => {
        for (const user of users) {
          try {
            // Create user with the provided userId and randomized password
            const createdUser = await clerkClient.users.createUser({
              id: user.id,
              emailAddress: user.emailAddress,
              password: user.password,
              firstName: user.firstName,
              lastName: user.lastName,
            });

            console.log(`User created: ${user.emailAddress[0]}, Temporary Password: ${user.password}`);
          } catch (error) {
            console.error(`Error creating user for ${user.emailAddress[0]}:`, error);
          }
        }
        return NextResponse.json({ message: `${users.length} users processed` });
      });
  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json({ error: 'Error processing CSV' });
  }
}
