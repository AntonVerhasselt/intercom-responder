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
    return result.insertedId;  // Return the ID
  } catch (error) {
    console.error('Error inserting conversation into MongoDB', error);
    throw new Error('Failed to insert conversation'); // Ensure to throw an error to handle it in calling function
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

export { insertConversation, addCategoryPrompt, updateConversationWithGPTResponse };
