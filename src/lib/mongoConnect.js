import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);
    console.log("Connected to MongoDB: ", db.databaseName);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
}

export default connectToMongo;
