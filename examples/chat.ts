#!/usr/bin/env -S npm run tsn -T

import { LlamaAPIClient } from 'llama-api-client';

// gets API Key from environment variable LLAMA_API_KEY
const llamaapi = new LlamaAPIClient();

async function main() {
  // Non-streaming:
  const completion = await llamaapi.chat.completions.create({
    model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
    messages: [{ role: 'user', content: 'Hello, how are you?' }],
  });
  console.log(completion);

  // Streaming:
  const stream = await llamaapi.chat.completions.create({
    model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
    messages: [{ role: 'user', content: 'Hello, how are you?' }],
    stream: true,
  });
  for await (const chunk of stream) {
    if (chunk.event.delta.type === 'text') {
      process.stdout.write(chunk.event.delta.text || '');
    }
  }
  process.stdout.write('\n');
}

main();
