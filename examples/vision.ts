#!/usr/bin/env -S npm run tsn -T

import { LlamaAPIClient } from 'llama-api-client';
import { Message } from 'llama-api-client/resources/chat';

// gets API Key from environment variable LLAMA_API_KEY
const llamaapi = new LlamaAPIClient();

async function main() {
  const messages: Message[] = [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the difference between the two images?' },
        {
          type: 'image_url',
          image_url: { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
        },
        {
          type: 'image_url',
          image_url: {
            url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png',
          },
        },
      ],
    },
  ];
  // Non-streaming:
  const completion = await llamaapi.chat.completions.create({
    model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
    messages: messages,
  });
  console.log(completion);

  // Streaming:
  const stream = await llamaapi.chat.completions.create({
    model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
    messages: messages,
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
