import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const fetchConversations = async () => {
  const conversations = [];
  let startingAfter = null;
  const perPage = 100; // Number of results per page
  const headers = {
    'Authorization': `Bearer ${process.env.INTERCOM_API_KEY}`,
    'Intercom-Version': '2.11',
    'Content-Type': 'application/json'
  };

  try {
    while (conversations.length < 100) {
      const query = new URLSearchParams({
        per_page: perPage.toString(),
        ...(startingAfter && { starting_after: startingAfter })
      }).toString();

      const response = await fetch(
        `https://api.intercom.io/conversations?${query}`,
        { method: 'GET', headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      conversations.push(...data.conversations);

      // Check if we need to paginate
      if (data.pages && data.pages.next) {
        startingAfter = data.pages.next.starting_after;
      } else {
        break; // Exit loop if there's no next page
      }
    }

    // Process each conversation
    for (let conversation of conversations.slice(0, 1)) { // limiting to the first x for demonstration
      console.log(conversation.id)
      await postConversationId(conversation.id);
    }

  } catch (error) {
    console.error('Failed to fetch conversations:', error);
  }
};

// Function to post conversation ID to your endpoint
const postConversationId = async (conversationId) => {
  try {
    const response = await fetch(`http://localhost:5173/api/intercom/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('POST Result for ID', conversationId, ':', result);
  } catch (error) {
    console.error('Failed to post conversation ID:', conversationId, error);
  }
};

fetchConversations().then(() => {
  console.log('Finished processing conversations');
});
