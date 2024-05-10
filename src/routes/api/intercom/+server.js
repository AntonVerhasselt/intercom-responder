import { error, json } from "@sveltejs/kit";
import { insertConversation } from "$lib/mongoOperations";
import { categorizeWithGPT } from "$lib/gptCategorize";

export async function POST({ request }) {
  try {
    const payload = await request.json();

    if (payload.topic === "conversation.user.created") {
      console.log("Received conversation.user.created event");

      // TODO: Fetch conversation details

      // TODO: Adapt userMessages check to conversation details return
      const userMessages = (
        payload.data.item.conversation_parts.conversation_parts || []
      )
        .filter(
          (part) => part.part_type === "comment" && part.author?.type === "user"
        )
        .map((part) => part.body)
        .join(" ");

      if (!userMessages.trim()) {
        console.log("No user messages to process:", payload.data.item.conversation_parts.conversation_parts);
        return json(
          {
            status: "Failed",
            message: "No user messages to process. Aborted insert.",
          },
          {
            status: 200,
          }
        );
      }

      // TODO: Load conversation details into functions + adapt the selection in the function of the message & the language
      const conversationId = await insertConversation(payload.data);
      await categorizeWithGPT(payload.data, conversationId);

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
