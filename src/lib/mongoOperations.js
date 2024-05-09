import connectToMongo from './mongoConnect';

async function insertConversation(conversationData) {
  const db = await connectToMongo();
  try {
    const { statistics, ...dataToStore } = conversationData.item;
    const documentToInsert = {
      webhook: dataToStore
    };
    const result = await db.collection('conversations').insertOne(documentToInsert);
    console.log(`Conversation inserted with the following id: ${result.insertedId}`);
    return result.insertedId;
  } catch (error) {
    console.error('Error inserting conversation into MongoDB', error);
    throw new Error('Failed to insert conversation');
  }
}

async function addCategoryPrompt(conversationId, messages) {
  const db = await connectToMongo();
  try {
    const result = await db.collection('conversations').updateOne(
      { _id: conversationId },
      { $set: { categoryPrompt: messages } }
    );
    console.log(`Updated conversation ${conversationId} with categoryPrompt`);
  } catch (error) {
    console.error('Error updating conversation with categoryPrompt', error);
  }
}

async function updateConversationWithGPTResponse(conversationId, gptResponse) {
  const db = await connectToMongo();
  try {
    const result = await db.collection('conversations').updateOne(
      { _id: conversationId },
      { $set: { category: gptResponse } }
    );
    console.log(`Updated conversation ${conversationId} with GPT response`);
  } catch (error) {
    console.error('Error updating conversation with GPT response', error);
  }
}

async function fetchRandomDocument() {
  try {
    console.log("Fetching random document...");

    const db = await connectToMongo();
    console.log("Connected to MongoDB.");

    const collection = db.collection('conversations');

    console.log("Querying for random document...");
    const randomDocument = await collection.findOne({
      $or: [
        { goodReview: { $exists: false } }, // Check if the field doesn't exist
        { goodReview: null } // Check if the field is explicitly null
      ],
      'category.category_name': { $ne: 'ambiguous' }
    });

    console.log("Random document fetched:", randomDocument);

    return randomDocument;
  } catch (error) {
    console.error("Failed to fetch document:", error);
    throw new Error("Failed to fetch document: " + error.message);
  }
}

export {
  insertConversation,
  addCategoryPrompt,
  updateConversationWithGPTResponse,
  fetchRandomDocument
};
