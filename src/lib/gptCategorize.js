import dotenv from "dotenv";
import connectToMongo from "./mongoConnect.js";
import connectToGPT from "./gptConnect.js";
import { addCategoryPrompt, updateConversationWithGPTResponse } from "./mongoOperations.js";

dotenv.config();

async function getCategoryDescriptions() {
  const db = await connectToMongo();
  try {
    const categoriesCollection = db.collection("categories");
    const categories = await categoriesCollection.find().toArray();
    const categoriesDescriptions = categories
      .map(
        (category) =>
          `${category.name} (id = ${category.id}): ${category.explanation}`
      )
      .join(", ");
    return categoriesDescriptions;
  } catch (error) {
    console.error("Error retrieving category descriptions:", error);
    throw error;
  }
}

async function generateMessages(conversationDetails) {
  const categoriesDescriptions = await getCategoryDescriptions();
  const language = conversationDetails?.custom_attributes?.Language;
  const systemMessageContent = `This message is in ${language}. Categorize the message in one of the given categories. If a message could fit more than one category, choose the most likely category. If it's too ambiguous, indicate the ambiguity in your response. Output should be formatted as a JSON object with 'category_name', 'category_id', and 'confidence_score' fields. In cases of ambiguity, set the 'category_name' to ambiguous and leave the 'category_id' empty. Example of expected output for a clear case: {'category_name': 'Missed sales', 'category_id': '9110875', 'confidence_score': 0.9}. Example for an ambiguous case: {'category_name': 'ambiguous', 'category_id': '' 'confidence_score': 0}. Here you have our list of categories, the category id's and their explanations: ${categoriesDescriptions}.`;

  const userMessages = [
    ...(conversationDetails?.source?.author?.type === "user" ? [stripHTML(conversationDetails.source.body)]: []),

    ...(conversationDetails?.conversation_parts?.conversation_parts || [])
      .filter(
        (part) => part.part_type === "comment" && part.author?.type === "user"
      )
      .map((part) => stripHTML(part.body)),
  ].join(" ");

  console.log("User Messages:", userMessages);

  const messages = [
    {
      role: "system",
      content: systemMessageContent,
    },
    {
      role: "user",
      content: userMessages,
    },
  ];

  console.log(messages);
  return messages;
}

function stripHTML(html) {
  return html ? html.replace(/<[^>]*>?/gm, "") : "";
}

async function categorizeWithGPT(conversationDetails, conversationId) {
  try {
    const messages = await generateMessages(conversationDetails);

    await addCategoryPrompt(conversationId, messages);

    const openai = connectToGPT();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.2,
      response_format: { type: "json_object" },
      seed: 12345,
    });

    // Assuming response.choices[0].message.content is a valid JSON string
    if (
      response.choices &&
      response.choices.length > 0 &&
      response.choices[0].message
    ) {
      // Parse the JSON string into an object
      const jsonResponse = JSON.parse(response.choices[0].message.content);
      console.log("Parsed GPT JSON response:", jsonResponse);

      await updateConversationWithGPTResponse(conversationId, jsonResponse);
    } else {
      console.log("No choices available in response.");
    }

    return jsonResponse;
  } catch (error) {
    console.error("Error sending prompt to GPT:", error);
    return null;
  }
}

export { categorizeWithGPT };
