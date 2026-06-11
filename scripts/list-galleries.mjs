import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69dd1f32003b7e825311';
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69e4ddd7003189c843fa';
const appwriteKey = process.env.APPWRITE_API_KEY || '';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(projectId)
  .setKey(appwriteKey);

import { Users } from 'node-appwrite';

const users = new Users(client);

async function list() {
  try {
    const res = await users.list();
    console.log("Users count:", res.users.length);
    res.users.forEach(u => {
      console.log(`- email: ${u.email}, name: ${u.name}, status: ${u.status}`);
    });
    process.exit(0);
  } catch (err) {
    console.error("Error fetching users:", err);
    process.exit(1);
  }
}

list();
