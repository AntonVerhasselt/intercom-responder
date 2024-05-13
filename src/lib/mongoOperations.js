import { ObjectId } from 'mongodb';
import connectToMongo from './mongoConnect';

// Insert new conversation in Mongo
async function insertConversation(conversationData) {
  const db = await connectToMongo();
  try {
    const documentToInsert = {
      conversationData: conversationData,
      createDate: new Date()
    };
    const result = await db.collection('conversations').insertOne(documentToInsert);
    console.log(`Conversation inserted with the following id: ${result.insertedId}`);
    return result.insertedId;
  } catch (error) {
    console.error('Error inserting conversation into MongoDB', error);
    throw new Error('Failed to insert conversation');
  }
}

// Add category prompt to Mongo
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

// Add category result to Mongo
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

// Fetch random document for review
async function fetchRandomDocument() {
  try {
    const db = await connectToMongo();
    const collection = db.collection('conversations');

    // Define the query filter
    const queryFilter = {
      $or: [
        { goodReview: { $exists: false } },
        { goodReview: null }
      ],
      'category.category_name': { $not: /^ambiguous$/i }
    };

    console.log("Querying for a document matching the filters...");
    const randomDocument = await collection.findOne(queryFilter);
    
    if (!randomDocument) {
      console.log("No document found matching the criteria.");
      return { document: null, count: 0 };
    }
    
    console.log("Document fetched:", randomDocument._id);

    const count = await collection.countDocuments(queryFilter);
    console.log("Count of matching documents:", count);

    return { document: randomDocument, count: count };
  } catch (error) {
    console.error("Failed to fetch document:", error);
    throw new Error("Failed to fetch document: " + error.message);
  }
}

// Add review to conversation in Mongo
async function addCategoryReview(conversationId, goodCategory) {
  const db = await connectToMongo();
  try {
    console.log({ conversationId, goodCategory })
    const result = await db.collection('conversations').updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { goodReview: goodCategory } }
    );
    console.log(result)
    console.log(`Updated conversation ${conversationId} with review`);
    return result.modifiedCount === 1;
  } catch (error) {
    console.error('Error updating conversation with review', error);
    return false;
  }
}

export {
  insertConversation,
  addCategoryPrompt,
  updateConversationWithGPTResponse,
  fetchRandomDocument,
  addCategoryReview
};
