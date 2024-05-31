import { error, json } from "@sveltejs/kit";
import { insertWebhookData, addConversationDetails } from "$lib/mongoOperations";
import { categorizeWithGPT } from "$lib/gptCategorize";
import { fetchConversationDetails } from "$lib/intercomOperations"; 

export async function POST({ request }) {
  try {
    const payload = await request.json();

    // Store every webhook payload
    const webhookId = await insertWebhookData(payload);
    console.log(`Webhook data logged with ID: ${webhookId}`);

    // Fetch conversation details based on the payload's data item ID
    const conversationDetails = await fetchConversationDetails(payload.data.item.id);

    if (conversationDetails) {
      const conversationId = await addConversationDetails(conversationDetails, webhookId);
      await categorizeWithGPT(conversationDetails, conversationId);

      return json(
        {
          status: "Success",
          message: "Webhook received and data stored",
        },
        {
          status: 200,
        }
      );
    } else {
      console.log("Failed to fetch or no conversation details available for:", payload.data.item.id);
      return json(
        {
          status: "Failed",
          message: "Failed to fetch conversation details or no data to process."
        },
        {
          status: 200,
        }
      );
    }
  } catch (err) {
    console.error("Error processing the webhook:", err);
    return json(
      {
        status: "Error",
        message: "Unable to process webhook",
      },
      {
        status: 500,
      }
    );
  }
}
