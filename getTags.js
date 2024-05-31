// Import necessary modules
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function run() {
    const authToken = process.env.INTERCOM_API_KEY;

  try {
    const response = await fetch('https://api.intercom.io/tags', {
      method: 'GET',
      headers: {
        'Intercom-Version': '2.10',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
}

run();

