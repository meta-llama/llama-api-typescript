#!/usr/bin/env -S npm run tsn -T

/**
 * Demonstrates Llama Inference + Vercel `ai`:
 * generateText / streamText / generateObject via native `response_format.json_schema`.
 *
 * Requires `LLAMA_API_KEY` or `LlamaAPIClient` defaults per README.
 */

import { generateObject, generateText, streamText } from 'ai';
import { z } from 'zod';

import { createLlama } from 'llama-api-client/ai';

const MODEL = process.env['LLAMA_MODEL'] ?? 'Llama-4-Maverick-17B-128E-Instruct-FP8';

async function main() {
  const llama = createLlama();

  const greeting = await generateText({
    model: llama(MODEL),
    prompt: 'Reply with exactly: hello-from-llama',
  });
  console.log('[generateText]', greeting.text);

  const stream = streamText({
    model: llama(MODEL),
    prompt: 'Say two short hyphenated tokens about the ocean.',
    temperature: 0.5,
  });
  process.stdout.write('[streamText] ');
  for await (const delta of stream.textStream) {
    process.stdout.write(delta);
  }
  process.stdout.write('\n');

  const Obj = z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']),
  });

  const structured = await generateObject({
    model: llama(MODEL),
    schema: Obj,
    prompt: 'The response was cheerful. Respond with sentiment only.',
  });
  console.log('[generateObject]', structured.object);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
