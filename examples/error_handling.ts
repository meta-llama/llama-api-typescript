#!/usr/bin/env -S npm run tsn -T

import LlamaAPIClient, {
  APIError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  APIConnectionError,
} from 'llama-api-client';

const client = new LlamaAPIClient();

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: 'Llama-3.3-70B-Instruct',
      messages: [{ role: 'user', content: 'Hello!' }],
    });
    console.log(response.completion_message.content);
  } catch (err) {
    if (err instanceof AuthenticationError) {
      console.error('Authentication failed — check your LLAMA_API_KEY');
      console.error(`Status: ${err.status}`);
    } else if (err instanceof RateLimitError) {
      console.error('Rate limited — try again later');
      console.error(`Status: ${err.status}`);
    } else if (err instanceof NotFoundError) {
      console.error('Resource not found');
      console.error(`Status: ${err.status}`);
    } else if (err instanceof APIConnectionError) {
      console.error('Connection failed — check your network');
    } else if (err instanceof APIError) {
      console.error(`API error: ${err.status} — ${err.message}`);
    } else {
      throw err;
    }
  }
}

main();
