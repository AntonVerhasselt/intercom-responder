import { json } from "@sveltejs/kit";
import { fetchRandomDocument } from "$lib/mongoOperations";

export async function GET() {
  try {
    console.log("Fetching random document...");

    const randomDocument = await fetchRandomDocument();

    console.log("Random document fetched:", randomDocument);

    return json(
      {
        status: "Success",
        message: "Random document fetched successfully.",
        data: randomDocument
      },
      {
        status: 200
      }
    );
  } catch (error) {
    console.error("Failed to fetch document:", error);

    return json(
      {
        status: "Error",
        message: "Failed to fetch document: " + error.message
      },
      {
        status: 500
      }
    );
  }
}
