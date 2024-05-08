import connectToMongo from './mongoConnect';

async function insertConversation(conversationData) {
  const db = await connectToMongo();
  try {
    // Destructure the statistics out and keep the rest of the conversation data
    const { statistics, ...dataToStore } = conversationData.item;

    const result = await db.collection('conversations').insertOne(dataToStore);
    console.log(`Conversation inserted with the following id: ${result.insertedId}`);
  } catch (error) {
    console.error('Error inserting conversation into MongoDB', error);
  }
}

export { insertConversation };
