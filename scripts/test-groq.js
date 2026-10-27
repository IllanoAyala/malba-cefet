import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const result = await streamText({
      model: groq('qwen/qwen3.8-27b'),
      prompt: 'oi',
    });
    for await (const part of result.fullStream) {
      console.log('PART:', part);
    }
  } catch(e) {
    console.error("ERROR:", e.message);
  }
}
run();
