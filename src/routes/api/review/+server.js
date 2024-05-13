import { json } from "@sveltejs/kit";
import { fetchRandomDocument, addCategoryReview } from "$lib/mongoOperations";

export async function GET() {
  try {
    const {document, count} = await fetchRandomDocument();

    return json(
      {
        status: "Success",
        message: "Random document fetched successfully.",
        data: document,
        count: count,
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

export async function POST({ request }) {
  try {
    const reqBody = await request.json();
    const { documentId, goodCategory } = reqBody;

    if (!documentId || goodCategory === undefined) {
      return json(
        { status: "Error", message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const updateSuccess = await addCategoryReview(documentId, goodCategory);
    if (!updateSuccess) {
      return json(
        { status: "Error", message: "Failed to update the document" },
        { status: 500 }
      );
    }

    return json(
      {
        status: "Success",
        message: "Category review added successfully."
      },
      {
        status: 200
      }
    );
  } catch (error) {
    return json(
      {
        status: "Error",
        message: "Server error: " + error.message
      },
      {
        status: 500
      }
    );
  }
}