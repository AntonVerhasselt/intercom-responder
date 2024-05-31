import { json } from "@sveltejs/kit";
import { insertConversation } from "$lib/mongoOperations";
import { categorizeWithGPT } from "$lib/gptCategorize";
import { fetchConversationDetails } from "$lib/intercomOperations"; 
import { assignConversation } from "../../../../lib/intercomOperations";

// Adjust the function to use the params object from the request context.
export async function POST({ params }) {
  try {
    // Extract the ID from the URL parameters (route params).
    const { id } = params;

    // Fetch the conversation details using the provided ID.
    const conversationDetails = await fetchConversationDetails(id);
    if (!conversationDetails) {
      console.log("No user messages to process or failed to fetch details for:", id);
      return json(
        {
          status: "Failed",
          message: "No user messages to process or failed to fetch conversation details. Aborted insert.",
        },
        {
          status: 200,
        }
      );
    }

    // Insert the conversation details into the database and categorize it.
    const conversationId = await insertConversation(conversationDetails);
    const categoryJson = await categorizeWithGPT(conversationDetails, conversationId);

    await assignConversation(conversationId, categoryJson);

    return json(
      {
        status: "Success",
        message: "Webhook received and data stored",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error processing the request:", err);
    return json(
      {
        status: "Error",
        message: "Unable to process request",
      },
      {
        status: 500,
      }
    );
  }
}
