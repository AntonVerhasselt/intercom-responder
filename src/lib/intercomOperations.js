import fetch from 'node-fetch';
import dotenv from 'dotenv';
import connectToMongo from './mongoConnect';
import { stringify } from 'postcss';

dotenv.config();

async function fetchConversationDetails(conversationId) {
  const authToken = process.env.INTERCOM_API_KEY;

  try {
      const response = await fetch(`https://api.intercom.io/conversations/${conversationId}?display_as=plaintext`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authToken}`,
              'Intercom-Version': '2.11',
              'Accept': 'application/json'
          }
      });

      if (!response.ok) {
          console.error('Failed to fetch conversation details:', response.status, response.statusText);
          return null;
      }

      const data = await response.json();
      const conversationPartsUserMessages = data.conversation_parts?.conversation_parts?.some(part => 
          part.part_type === 'comment' && part.author?.type === 'user'
      );
      const sourceUserMessage = data.source?.author?.type === 'user';

      if (!conversationPartsUserMessages && !sourceUserMessage) {
          console.log('No user messages found in the conversation. Conversation details: ', data);
          return null;
      }

      console.log('Conversation details found')
      return data;
  } catch (error) {
      console.error('Error fetching conversation details:', error);
      return null;
  }
}

// Add category to conversation as tag: https://developers.intercom.com/docs/references/rest-api/api.intercom.io/Conversations/attachTagToConversation/


// Add category assign admin based on category: https://developers.intercom.com/docs/references/rest-api/api.intercom.io/Conversations/manageConversation/
async function assignConversation(conversationId, categoryJson) {
    const authToken = process.env.INTERCOM_API_KEY;

    try {
        const db = await connectToMongo();
        const { category_id } = categoryJson;

        const category = await db.collection('categories').findOne({ category_id });

        if (!category) {
            console.error('Category not found in the database for category_id:', category_id);
            return null;
        }

        const adminId = category.admin_id;
        console.log('Assigning to adminId:', adminId);

        const response = await fetch(`https://api.intercom.io/conversations/${conversationId}/parts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Intercom-Version': '2.11',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message_type: 'assignment',
                type: 'admin',
                admin_id: adminId,
                assignee_id: adminId
            })
        });

        if (!response.ok) {
            console.error('Failed to assign conversation:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error assigning conversation:', error);
        return null;
    }
}

// Respond to the message if needed: https://developers.intercom.com/docs/references/rest-api/api.intercom.io/Conversations/replyConversation/


// Loop all actions after categorization into one function


export { fetchConversationDetails, assignConversation };