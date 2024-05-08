import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

function connectToGPT() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OpenAI API key not found. Please provide the API key in the environment variable OPENAI_API_KEY.');
    }

    const openai = new OpenAI(apiKey);

    return openai;
}

export default connectToGPT;
