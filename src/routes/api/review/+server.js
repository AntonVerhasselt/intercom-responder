import { json } from "@sveltejs/kit";
import { fetchRandomDocument } from "$lib/mongoOperations";

export async function GET() {
  try {
    const randomDocument = await fetchRandomDocument();

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
