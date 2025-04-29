#!/usr/bin/env -S npm run tsn -T

import { LlamaAPIClient } from 'llama-api-client';

// Interface for the Address structure
interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

// gets API Key from environment variable LLAMA_API_KEY
const client = new LlamaAPIClient();

async function run(stream: boolean = false) {
  const addressSchema = {
    type: 'object',
    properties: {
      street: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      zip: { type: 'string' },
    },
    required: ['street', 'city', 'state', 'zip'],
  };

  if (stream) {
    const response = await client.chat.completions.create({
      model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Summarize the address in a JSON object.',
        },
        {
          role: 'user',
          content: '123 Main St, Anytown, USA',
        },
      ],
      temperature: 0.1,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'Address',
          schema: addressSchema,
        },
      },
      stream: true,
    });

    let maybeJson = '';
    for await (const chunk of response) {
      if (chunk.event.delta.type === 'text') {
        const text = chunk.event.delta.text || '';
        maybeJson += text;
        process.stdout.write(text);
      }
    }
    process.stdout.write('\n');

    // Parse the JSON string into an Address object
    const address: Address = JSON.parse(maybeJson);
    console.log(address);
  } else {
    const response = await client.chat.completions.create({
      model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Summarize the address in a JSON object.',
        },
        {
          role: 'user',
          content: '123 Main St, Anytown, USA',
        },
      ],
      temperature: 0.1,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'Address',
          schema: addressSchema,
        },
      },
      stream: false,
    });

    // Parse the JSON string into an Address object
    if (
      typeof response.completion_message.content !== 'string' &&
      response.completion_message.content.type === 'text'
    ) {
      const address: Address = JSON.parse(response.completion_message.content.text);
      console.log(address);
    }
  }
}

async function main() {
  await run(true);
  await run(false);
}

main();
