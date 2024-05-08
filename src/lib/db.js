import { MongoClient } from 'mongodb';

const client = new MongoClient('your_mongodb_connection_string');

async function connect() {
  try {
    await client.connect();
    const db = client.db('your_database_name');
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
}

export default connect;
