import { error, json } from '@sveltejs/kit';
import { insertConversation } from '$lib/mongoOperations';
import { sendPromptToGPT } from '../../../lib/gptPromptPrep';

export async function POST({ request }) {
    try {
        const payload = await request.json();

        if (payload.topic === 'conversation.user.created') {
            console.log('Received conversation.user.created event');
            console.log('Conversation details:', payload.data);

            await insertConversation(payload.data);
            await sendPromptToGPT(payload.data);

            return json({
                status: 'Success',
                message: 'Webhook received and data stored'
            }, {
                status: 200
            });
        } else {
            console.log('Received irrelevant event:', payload.topic);
            return json({
                status: 'Ignored',
                message: 'Irrelevant webhook event'
            }, {
                status: 200
            });
        }
    } catch (err) {
        console.error('Error processing the webhook:', err);

        return json({
            status: 'Error',
            message: 'Unable to process webhook'
        }, {
            status: 500
        });
    }
}
