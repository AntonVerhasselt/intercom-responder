import { error, json } from "@sveltejs/kit";
import { insertConversation } from "$lib/mongoOperations";
import { categorizeWithGPT } from "$lib/gptCategorize";
import { fetchConversationDetails } from "$lib/intercomOperations"; 

export async function POST({ request }) {
  try {
    const payload = await request.json();

    if (payload.topic === "conversation.user.created") {
      console.log("Received conversation.user.created event");

      const conversationDetails = await fetchConversationDetails(payload.data.item.id);

      if (!conversationDetails) {
        console.log("No user messages to process or failed to fetch details for:", payload.data.item.id);
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

      const conversationId = await insertConversation(conversationDetails);
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
      console.log("Received irrelevant event:", payload.topic);
      return json(
        {
          status: "Ignored",
          message: "Irrelevant webhook event",
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
