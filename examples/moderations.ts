#!/usr/bin/env -S npm run tsn -T

import LlamaAPIClient from 'llama-api-client';

const client = new LlamaAPIClient();

async function main() {
  const response = await client.moderations.create({
    messages: [{ role: 'user', content: 'Hello, how are you today?' }],
  });

  console.log('Moderation results:');
  for (const result of response.results) {
    console.log(`  Flagged: ${result.flagged}`);
    if (result.flagged_categories.length > 0) {
      console.log(`  Categories: ${result.flagged_categories.join(', ')}`);
    }
  }
}

main();
