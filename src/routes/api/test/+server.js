import { json, error } from '@sveltejs/kit';

// Example GET handler
export async function GET() {
    // You could connect to your database or just return a static message
    return new Response(JSON.stringify({ message: "GET request received at /api/test" }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// Example POST handler
export async function POST({ request }) {
    try {
        const data = await request.json();
        // Process POST data, e.g., logging it or responding with the same object
        return json({ message: "POST request received at /api/test", yourData: data });
    } catch (err) {
        // Handle errors, such as if JSON parsing fails
        return error(400, { error: 'Bad Request: Could not parse JSON.' });
    }
}
